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
class DocSearch {
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
      let category = utils.getHighlightedValue(hit, 'lvl0');
      let subcategory = utils.getHighlightedValue(hit, 'lvl1') || category;
      let displayTitle = utils.compact([
        utils.getHighlightedValue(hit, 'lvl2') || subcategory,
        utils.getHighlightedValue(hit, 'lvl3'),
        utils.getHighlightedValue(hit, 'lvl4'),
        utils.getHighlightedValue(hit, 'lvl5'),
        utils.getHighlightedValue(hit, 'lvl6')
      ]).join(' › ');
      let text = utils.getSnippetedValue(hit, 'content');

      return {
        isCategoryHeader: hit.isCategoryHeader,
        isSubcategoryHeader: hit.isSubcategoryHeader,
        category: category,
        subcategory: subcategory,
        title: displayTitle,
        text: text,
        url: url
      };
    });
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

export default DocSearch;


