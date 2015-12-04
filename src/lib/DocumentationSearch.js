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
    // First, we move all the hierarchy object to the root
    let hits = [];
    $.each(receivedHits, (index, item) => {
      let newItem = $.extend({}, item, item.hierarchy);
      delete newItem.hierarchy;
      hits.push(newItem);
    });

    let groupedHits = [];
    // Add the first element as a main header
    let firstElement = hits.shift();
    firstElement.isCategoryHeader = true;
    firstElement.isSubcategoryHeader = true;
    // Add all elements that share both lvl0 and lvl1
    $.each(hits, (index, item) => {
      if !(item.lvl0 === firstElement.lvl0 && item.lvl1 === firstElement.lvl1) {
        continue;
      }
      groupedHits.push(item);
      delete hits[index]
    });

    // Get all remaining hits that share lvl0
    let hitsThatShareLvl0 = [];
    $.each(hits, (index, item) => {
      if !(item.lvl0 === firstElement.lvl0) {
        continue;
      }
      hitsThatShareLvl0.push(item);
      delete hits[index]
    });

    // Group the items sharing lvl0 together
    $.each(hitsThatShareLvl0, (index, item) => {
    });

    // Flatten the lvl0 and add 
    // We take the first element of the array
    // We take all other elements of the array that share lvl0 and lvl1 and put
    // them after
    // We then take all elements that share lvl0, order them by lvl1 and put
    // them after
    // We start over with the remaining of the array

    return hits;
    //
    //
    // Given n hits, I'll take the first one in a separate list
    // Then find (A) all the other hits that share both lvl0 and lvl1
    //  And (B) all the other hits that share only lvl0
    //  I'll group A and B into C. Set 





    // Group hits by category / subcategory
    console.info(hits);
    var groupedHits = utils.groupBy(hits, 'category');
    console.info(groupedHits);
    groupedHits.each((list, category) => {
      var groupedHitsBySubCategory = groupBy(list, 'subcategory');
      var flattenedHits = utils.flattenObject(groupedHitsBySubCategory, 'isSubcategoryHeader');
      groupedHits[category] = flattenedHits;
    });
    groupedHits = utils.flattenObject(groupedHits, 'isCategoryHeader');

    // Translate hits into smaller objects to be send to the template
    return groupedHits.map((hit) => {
      return {
        isCategoryHeader: hit.isCategoryHeader,
        isSubcategoryHeader: hit.isSubcategoryHeader,
        category: hit._highlightResult.category ? hit._highlightResult.category.value : hit.category,
        subcategory: hit._highlightResult.subcategory ? hit._highlightResult.subcategory.value : hit.category,
        title: hit._highlightResult.display_title ? hit._highlightResult.display_title.value : hit.display_title,
        text: hit._snippetResult ? hit._snippetResult.text.value : hit.text,
        url: hit.url
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

export default DocumentationSearch;


