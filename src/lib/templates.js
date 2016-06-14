let prefix = 'algolia-docsearch';
let suggestionPrefix = `${prefix}-suggestion`;
let footerPrefix = `${prefix}-footer`;

let templates = {
  suggestion: `
  <div class="${suggestionPrefix}
    {{#isCategoryHeader}}${suggestionPrefix}__main{{/isCategoryHeader}}
    {{#isSubCategoryHeader}}${suggestionPrefix}__secondary{{/isSubCategoryHeader}}
    {{#isSimpleLayout}}suggestion-layout-simple{{/isSimpleLayout}}
  ">
    <div class="${suggestionPrefix}--category-header">{{{category}}}</div>
    <div class="${suggestionPrefix}--wrapper">
      <div class="${suggestionPrefix}--subcategory-column {{#isSubcategoryDuplicate}}${suggestionPrefix}--duplicate-content{{/isSubcategoryDuplicate}}">
        <span class="${suggestionPrefix}--subcategory-column-text">{{{subcategory}}}</span>
      </div>
      {{#isTextOrSubcatoryNonEmpty}}
      <div class="${suggestionPrefix}--content">
        <div class="${suggestionPrefix}--subcategory-inline {{#isSubcategoryDuplicate}}${suggestionPrefix}--duplicate-content{{/isSubcategoryDuplicate}}">{{{subcategory}}}</div>
        <div class="${suggestionPrefix}--title {{#isDisplayTitleDuplicate}}${suggestionPrefix}--duplicate-content{{/isDisplayTitleDuplicate}}">{{{title}}}</div>
        {{#text}}<div class="${suggestionPrefix}--text">{{{text}}}</div>{{/text}}
      </div>
      {{/isTextOrSubcatoryNonEmpty}}
    </div>
  </div>
  `,
  footer: `
    <div class="${footerPrefix}">
      Search by <a class="${footerPrefix}--logo" href="https://www.algolia.com/docsearch">Algolia</a>
    </div>
  `,
  empty: `
  <div class="${suggestionPrefix}">
    <div class="${suggestionPrefix}--wrapper">
        <div class="${suggestionPrefix}--content ${suggestionPrefix}--no-result">
            <div class="${suggestionPrefix}--title">
                <div class="${suggestionPrefix}--text">
                    No results found for query <b>{{{query}}}</b>
                </div>
            </div>
        </div>
    </div>
  </div>
  `,
  searchBox: `
  <svg xmlns="http://www.w3.org/2000/svg" style="display:none">
    <symbol xmlns="http://www.w3.org/2000/svg" id="sbx-icon-search-18" viewBox="0 0 40 40">
      <path d="M30.776 27.146l-1.32-1.32-3.63 3.632 1.32 1.32 3.63-3.632zm1.368 1.368l6.035 6.035c.39.39.4 1.017.008 1.408l-2.23 2.23c-.387.387-1.015.387-1.41-.008l-6.035-6.035 3.63-3.63zm-8.11 1.392c-2.356 1.363-5.092 2.143-8.01 2.143C7.174 32.05 0 24.873 0 16.023S7.174 0 16.024 0c8.85 0 16.025 7.174 16.025 16.024 0 2.918-.78 5.654-2.144 8.01l8.96 8.962c1.175 1.174 1.184 3.07.008 4.246l-1.632 1.632c-1.17 1.17-3.067 1.173-4.247-.007l-8.96-8.96zm-8.01.54c7.965 0 14.422-6.457 14.422-14.422 0-7.965-6.457-14.422-14.422-14.422-7.965 0-14.422 6.457-14.422 14.422 0 7.965 6.457 14.422 14.422 14.422zm0-2.403c6.638 0 12.018-5.38 12.018-12.02 0-6.636-5.38-12.017-12.018-12.017-6.637 0-12.018 5.38-12.018 12.018 0 6.638 5.38 12.02 12.018 12.02zm0-1.402c5.863 0 10.616-4.752 10.616-10.616 0-5.863-4.753-10.616-10.616-10.616-5.863 0-10.616 4.753-10.616 10.616 0 5.864 4.753 10.617 10.616 10.617z"
      fill-rule="evenodd" />
    </symbol>
    <symbol xmlns="http://www.w3.org/2000/svg" id="sbx-icon-clear-5" viewBox="0 0 20 20">
      <path d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10zm1.35-10.123l3.567 3.568-1.225 1.226-3.57-3.568-3.567 3.57-1.226-1.227 3.568-3.568-3.57-3.57 1.227-1.224 3.568 3.568 3.57-3.567 1.224 1.225-3.568 3.57zM10 18.272c4.568 0 8.272-3.704 8.272-8.272S14.568 1.728 10 1.728 1.728 5.432 1.728 10 5.432 18.272 10 18.272z"
      fill-rule="evenodd" />
    </symbol>
  </svg>

  <form action="void(0);" novalidate="novalidate" class="searchbox sbx-custom">
    <div role="search" class="sbx-custom__wrapper">
      <input type="search" name="search" placeholder="Search your website" autocomplete="off" required="required" class="sbx-custom__input">
      <button type="submit" title="Submit your search query." class="sbx-custom__submit">
        <svg role="img" aria-label="Search">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#sbx-icon-search-18"></use>
        </svg>
      </button>
      <button type="reset" title="Clear the search query." class="sbx-custom__reset">
        <svg role="img" aria-label="Reset">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#sbx-icon-clear-5"></use>
        </svg>
      </button>
    </div>
  </form>
  <!--Js: focus search input after reset-->
  <script type="text/javascript">
    //<![CDATA[
             document.querySelector('.searchbox [type="reset"]').addEventListener('click', function() {
               this.parentNode.querySelector('input').focus();
             });
    //]]>
  </script>
  `
};

export default templates;

