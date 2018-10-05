import Hogan from 'hogan.js';
import algoliasearch from 'algoliasearch/lite';
import autocomplete from 'autocomplete.js';
import templates from './templates';
import utils from './utils';
import version from './version';
import $ from './zepto';

/**
 * Adds an autocomplete dropdown to an input field
 * @function DocSearch
 * @param  {string} options.apiKey         Read-only API key
 * @param  {string} options.indexName      Name of the index to target
 * @param  {string} options.inputSelector  CSS selector that targets the input
 * @param  {string} [options.appId]  Lets you override the applicationId used.
 * If using the default Algolia Crawler, you should not have to change this
 * value.
 * @param  {Object} [options.algoliaOptions] Options to pass the underlying Algolia client
 * @param  {Object} [options.autocompleteOptions] Options to pass to the underlying autocomplete instance
 * @return {Object}
 */
const usage = `Usage:
  documentationSearch({
  apiKey,
  indexName,
  inputSelector,
  [ appId ],
  [ algoliaOptions.{hitsPerPage} ]
  [ autocompleteOptions.{hint,debug} ]
})`;
class DocSearch {
  constructor({
    apiKey,
    indexName,
    inputSelector,
    appId = 'BH4D9OD16A',
    debug = false,
    algoliaOptions = {},
    autocompleteOptions = {
      debug: false,
      hint: false,
      autoselect: true,
    },
    transformData = false,
    queryHook = false,
    handleSelected = false,
    enhancedSearchInput = false,
    layout = 'collumns',
  }) {
    DocSearch.checkArguments({
      apiKey,
      indexName,
      inputSelector,
      debug,
      algoliaOptions,
      autocompleteOptions,
      transformData,
      queryHook,
      handleSelected,
      enhancedSearchInput,
      layout,
    });

    this.apiKey = apiKey;
    this.appId = appId;
    this.indexName = indexName;
    this.input = DocSearch.getInputFromSelector(inputSelector);
    this.algoliaOptions = { hitsPerPage: 5, ...algoliaOptions };
    const autocompleteOptionsDebug =
      autocompleteOptions && autocompleteOptions.debug
        ? autocompleteOptions.debug
        : false;
    // eslint-disable-next-line no-param-reassign
    autocompleteOptions.debug = debug || autocompleteOptionsDebug;
    this.autocompleteOptions = autocompleteOptions;
    this.autocompleteOptions.cssClasses =
      this.autocompleteOptions.cssClasses || {};
    this.autocompleteOptions.cssClasses.prefix =
      this.autocompleteOptions.cssClasses.prefix || 'ds';

    // eslint-disable-next-line no-param-reassign
    handleSelected = handleSelected || this.handleSelected;

    this.isSimpleLayout = layout === 'simple';

    this.client = algoliasearch(this.appId, this.apiKey);
    this.client.addAlgoliaAgent(`docsearch.js ${version}`);

    if (enhancedSearchInput) {
      this.input = DocSearch.injectSearchBox(this.input);
    }

    this.autocomplete = autocomplete(this.input, autocompleteOptions, [
      {
        source: this.getAutocompleteSource(transformData, queryHook),
        templates: {
          suggestion: DocSearch.getSuggestionTemplate(this.isSimpleLayout),
          footer: templates.footer,
          empty: DocSearch.getEmptyTemplate(),
        },
      },
    ]);
    this.autocomplete.on(
      'autocomplete:selected',
      handleSelected.bind(null, this.autocomplete.autocomplete)
    );
    this.autocomplete.on(
      'autocomplete:shown',
      this.handleShown.bind(null, this.input)
    );

    if (enhancedSearchInput) {
      DocSearch.bindSearchBoxEvent();
    }
  }

  /**
   * Checks that the passed arguments are valid. Will throw errors otherwise
   * @function checkArguments
   * @param  {object} args Arguments as an option object
   * @returns {void}
   */
  static checkArguments(args) {
    if (!args.apiKey || !args.indexName) {
      throw new Error(usage);
    }

    if (!DocSearch.getInputFromSelector(args.inputSelector)) {
      throw new Error(
        `Error: No input element in the page matches ${args.inputSelector}`
      );
    }
  }

  static injectSearchBox(input) {
    input.before(templates.searchBox);
    const newInput = input
      .prev()
      .prev()
      .find('input');
    input.remove();
    return newInput;
  }

  static bindSearchBoxEvent() {
    $('.searchbox [type="reset"]').on('click', function() {
      $('input#docsearch').focus();
      $(this).addClass('hide');
      autocomplete.autocomplete.setVal('');
    });

    $('input#docsearch').on('keyup', () => {
      const searchbox = document.querySelector('input#docsearch');
      const reset = document.querySelector('.searchbox [type="reset"]');
      reset.className = 'searchbox__reset';
      if (searchbox.value.length === 0) {
        reset.className += ' hide';
      }
    });
  }

  /**
   * Returns the matching input from a CSS selector, null if none matches
   * @function getInputFromSelector
   * @param  {string} selector CSS selector that matches the search
   * input of the page
   * @returns {void}
   */
  static getInputFromSelector(selector) {
    const input = $(selector).filter('input');
    return input.length ? $(input[0]) : null;
  }

  /**
   * Returns the `source` method to be passed to autocomplete.js. It will query
   * the Algolia index and call the callbacks with the formatted hits.
   * @function getAutocompleteSource
   * @param  {function} transformData An optional function to transform the hits
   * @param {function} queryHook An optional function to transform the query
   * @returns {function} Method to be passed as the `source` option of
   * autocomplete
   */
  getAutocompleteSource(transformData, queryHook) {
    return (query, callback) => {
      if (queryHook) {
        // eslint-disable-next-line no-param-reassign
        query = queryHook(query) || query;
      }

      this.client
        .search([
          {
            indexName: this.indexName,
            query,
            params: this.algoliaOptions,
          },
        ])
        .then(data => {
          let hits = data.results[0].hits;
          if (transformData) {
            hits = transformData(hits) || hits;
          }
          callback(DocSearch.formatHits(hits));
        });
    };
  }

  // Given a list of hits returned by the API, will reformat them to be used in
  // a Hogan template
  static formatHits(receivedHits) {
    const clonedHits = utils.deepClone(receivedHits);
    const hits = clonedHits.map(hit => {
      if (hit._highlightResult) {
        // eslint-disable-next-line no-param-reassign
        hit._highlightResult = utils.mergeKeyWithParent(
          hit._highlightResult,
          'hierarchy'
        );
      }
      return utils.mergeKeyWithParent(hit, 'hierarchy');
    });

    // Group hits by category / subcategory
    let groupedHits = utils.groupBy(hits, 'lvl0');
    $.each(groupedHits, (level, collection) => {
      const groupedHitsByLvl1 = utils.groupBy(collection, 'lvl1');
      const flattenedHits = utils.flattenAndFlagFirst(
        groupedHitsByLvl1,
        'isSubCategoryHeader'
      );
      groupedHits[level] = flattenedHits;
    });
    groupedHits = utils.flattenAndFlagFirst(groupedHits, 'isCategoryHeader');

    // Translate hits into smaller objects to be send to the template
    return groupedHits.map(hit => {
      const url = DocSearch.formatURL(hit);
      const category = utils.getHighlightedValue(hit, 'lvl0');
      const subcategory = utils.getHighlightedValue(hit, 'lvl1') || category;
      const displayTitle = utils
        .compact([
          utils.getHighlightedValue(hit, 'lvl2') || subcategory,
          utils.getHighlightedValue(hit, 'lvl3'),
          utils.getHighlightedValue(hit, 'lvl4'),
          utils.getHighlightedValue(hit, 'lvl5'),
          utils.getHighlightedValue(hit, 'lvl6'),
        ])
        .join(
          '<span class="aa-suggestion-title-separator" aria-hidden="true"> › </span>'
        );
      const text = utils.getSnippetedValue(hit, 'content');
      const isTextOrSubcategoryNonEmpty =
        (subcategory && subcategory !== '') ||
        (displayTitle && displayTitle !== '');
      const isLvl1EmptyOrDuplicate =
        !subcategory || subcategory === '' || subcategory === category;
      const isLvl2 =
        displayTitle && displayTitle !== '' && displayTitle !== subcategory;
      const isLvl1 =
        !isLvl2 &&
        (subcategory && subcategory !== '' && subcategory !== category);
      const isLvl0 = !isLvl1 && !isLvl2;

      return {
        isLvl0,
        isLvl1,
        isLvl2,
        isLvl1EmptyOrDuplicate,
        isCategoryHeader: hit.isCategoryHeader,
        isSubCategoryHeader: hit.isSubCategoryHeader,
        isTextOrSubcategoryNonEmpty,
        category,
        subcategory,
        title: displayTitle,
        text,
        url,
      };
    });
  }

  static formatURL(hit) {
    const { url, anchor } = hit;
    if (url) {
      const containsAnchor = url.indexOf('#') !== -1;
      if (containsAnchor) return url;
      else if (anchor) return `${hit.url}#${hit.anchor}`;
      return url;
    } else if (anchor) return `#${hit.anchor}`;
    /* eslint-disable */
    console.warn('no anchor nor url for : ', JSON.stringify(hit));
    /* eslint-enable */
    return null;
  }

  static getEmptyTemplate() {
    return args => Hogan.compile(templates.empty).render(args);
  }

  static getSuggestionTemplate(isSimpleLayout) {
    const stringTemplate = isSimpleLayout
      ? templates.suggestionSimple
      : templates.suggestion;
    const template = Hogan.compile(stringTemplate);
    return suggestion => template.render(suggestion);
  }

  handleSelected(input, event, suggestion) {
    input.setVal('');
    window.location.assign(suggestion.url);
  }

  handleShown(input) {
    const middleOfInput = input.offset().left + input.width() / 2;
    let middleOfWindow = $(document).width() / 2;

    if (isNaN(middleOfWindow)) {
      middleOfWindow = 900;
    }

    const alignClass =
      middleOfInput - middleOfWindow >= 0
        ? 'algolia-autocomplete-right'
        : 'algolia-autocomplete-left';
    const otherAlignClass =
      middleOfInput - middleOfWindow < 0
        ? 'algolia-autocomplete-right'
        : 'algolia-autocomplete-left';

    const autocompleteWrapper = $('.algolia-autocomplete');
    if (!autocompleteWrapper.hasClass(alignClass)) {
      autocompleteWrapper.addClass(alignClass);
    }

    if (autocompleteWrapper.hasClass(otherAlignClass)) {
      autocompleteWrapper.removeClass(otherAlignClass);
    }
  }
}

export default DocSearch;
