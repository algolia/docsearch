import Hogan from 'hogan.js';
import algoliasearch from 'algoliasearch';
import autocomplete from 'autocomplete.js';
import templates from './templates.js';
import utils from './utils.js';
import $ from 'npm-zepto';

/**
 * Adds an autocomplete dropdown to an input fields
 * @function documentationSearch
 * @param  {string} options.apiKey         Read-only API key
 * @param  {string} options.indexName      Name of the index to target
 * @param  {string} options.inputSelector  CSS selector that targets the input
 * @param  {Object} [options.algoliaOptions] Options to pass the underlying Algolia client
 * @param  {Object} [options.autocompleteOptions] Options to pass to the underlying autocomplete instance
 * @return {Object}
 */
const usage = `Usage:
  documentationSearch({
  apiKey,
  indexName,
  inputSelector,
  [ options.{hint,debug} ]
})`;
class DocumentationSearch {
  constructor({
    apiKey,
    indexName,
    inputSelector,
    algoliaOptions = {
      hitsPerPage: 5
    },
    autocompleteOptions = {
      debug: true,
      hint: false
    }
  }) {
    this.checkArguments({apiKey, indexName, inputSelector, algoliaOptions, autocompleteOptions});

    this.client = algoliasearch('BH4D9OD16A', this.apiKey);
    this.autocomplete = autocomplete(this.input, autocompleteOptions, [{
      source: this.getSource(),
      templates: {
        suggestion: this.getSuggestionTemplate()
      }
    }]);
    this.autocomplete.on('autocomplete:selected', this.handleSelected);
  }

  // TEST:
  // - Usage error if no apiKey or no indexName
  // - Error if nothing matches
  // - Error if matches are not input
  // - apiKey nad indexName are set
  // - input is set to the Zepto-wrapped inputSelector
  checkArguments(args) {
    if (!args.apiKey || !args.indexName) {
      throw new Error(usage);
    }

    const input = $(args.inputSelector).filter('input');
    if (input.length === 0) {
      throw new Error(`Error: No input element in the page matches ${args.inputSelector}`);
    }

    this.apiKey = args.apiKey;
    this.indexName = args.indexName;
    this.input = input;
    this.algoliaOptions = args.algoliaOptions;
    this.autocompleteOptions = args.autocompleteOptions;
  }

  // Returns a `source` method to be used by `autocomplete`. This will query the
  // Algolia index.
  getSource() {
    return (query, callback) => {
      this.client.search([{
        indexName: this.indexName,
        query: query,
        params: this.algoliaOptions
      }]).then((data) => {
        callback(this.formatHits(data.results[0].hits));
      });
    };
  }

  // Given a list of hits returned by the API, will reformat them to be used in
  // a Hogan template
  formatHits(receivedHits) {
    let hits = receivedHits.map((hit) => {
      hit._highlightResult = utils.mergeKeyWithParent(hit._highlightResult, 'hierarchy');
      return utils.mergeKeyWithParent(hit, 'hierarchy');
    });

    // Group hits by category / subcategory
    var groupedHits = utils.groupBy(hits, 'lvl0');
    $.each(groupedHits, (level, collection) => {
      let groupedHitsByLvl1 = utils.groupBy(collection, 'lvl1');
      let flattenedHits = utils.flattenAndFlagFirst(groupedHitsByLvl1, 'isSubCategoryHeader');
      groupedHits[level] = flattenedHits;
    });
    groupedHits = utils.flattenAndFlagFirst(groupedHits, 'isCategoryHeader');

    // Translate hits into smaller objects to be send to the template
    return groupedHits.map((hit) => {
      let url = hit.anchor ? `${hit.url}#${hit.anchor}` : hit.url;
      let displayTitle = utils.compact([hit.lvl2, hit.lvl3, hit.lvl4, hit.lvl5, hit.lvl6]).join(' › ');

      return {
        isCategoryHeader: hit.isCategoryHeader,
        isSubcategoryHeader: hit.isSubcategoryHeader,
        category: this.getHighlightedValue(hit, 'lvl0'),
        subcategory: this.getHighlightedValue(hit, 'lvl1'),
        title: displayTitle,
        text: hit.content,
        url: url
      };
    });
  }

  getHighlightedValue(object, key) {
    let highlight = object._highlightResult[key];
    console.info(highlight);
    return highlight ? highlight.value : object[key];
  }

  getSuggestionTemplate() {
    const template = Hogan.compile(templates.suggestion);
    return (suggestion) => {
      return template.render(suggestion);
    };
  }

  handleSelected(event, suggestion) {
    this.autocomplete.autocomplete.setVal('');
    window.location.href = suggestion.url;
  }
}

export default DocumentationSearch;


