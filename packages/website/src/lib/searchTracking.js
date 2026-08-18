import { track } from './segment.js';

const DEBOUNCE_MS = 1000;

export function createSearchTracker(trackedIndexNames) {
  const trackedIndices = new Set(trackedIndexNames);
  let pendingObservation = null;
  let timer = null;
  let sequenceCounter = 0;
  let highestObservedSequence = 0;
  let lastObservedSignature = null;

  function flush() {
    timer = null;
    if (!pendingObservation) return;

    const { query, results_count, no_results } = pendingObservation;
    pendingObservation = null;
    track('Search Performed', {
      query,
      results_count,
      surface: 'docsearch',
    });
  }

  function observe(args, response, sequence) {
    // Overlapping searches resolve out of order, so a straggler from an earlier
    // keystroke must not replace what a later one already recorded.
    if (sequence <= highestObservedSequence) return;

    const requests = args[0] && (args[0].requests || args[0]);
    const results = response && response.results;
    if (!Array.isArray(requests) || !Array.isArray(results)) return;

    const matches = requests
      .map((request, index) => ({ request, result: results[index] }))
      .filter(
        ({ request, result }) =>
          request && result && trackedIndices.has(request.indexName)
      );
    if (matches.length === 0) return;

    const query = matches[0].request.query;
    if (typeof query !== 'string' || query.trim() === '') return;

    const signature = JSON.stringify(
      matches.map(({ request }) => [
        request.indexName,
        request.query,
        request.facetFilters ?? null,
        request.filters ?? null,
      ])
    );
    if (signature === lastObservedSignature) return;
    lastObservedSignature = signature;

    const resultsCount = matches.reduce(
      (total, { result }) =>
        total + (typeof result.nbHits === 'number' ? result.nbHits : 0),
      0
    );

    highestObservedSequence = sequence;
    pendingObservation = {
      query,
      results_count: resultsCount,
      no_results: resultsCount === 0,
    };
    clearTimeout(timer);
    timer = setTimeout(flush, DEBOUNCE_MS);
  }

  return function transformSearchClient(client) {
    if (!client || typeof client.search !== 'function') return client;

    const search = client.search.bind(client);
    client.search = (...args) => {
      const sequence = ++sequenceCounter;
      const result = search(...args);
      Promise.resolve(result).then(
        (response) => {
          try {
            observe(args, response, sequence);
          } catch {}
        },
        () => {}
      );
      return result;
    };

    return client;
  };
}
