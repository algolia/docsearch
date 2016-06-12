let prefix = 'algolia-docsearch';
let suggestionPrefix = `${prefix}-suggestion`;
let footerPrefix = `${prefix}-footer`;

let templates = {
  suggestion: `
  <div class="${suggestionPrefix}
    {{#isCategoryHeader}}${suggestionPrefix}__main{{/isCategoryHeader}}
    {{#isSubCategoryHeader}}${suggestionPrefix}__secondary{{/isSubCategoryHeader}}
  ">
    <div class="${suggestionPrefix}--category-header">{{{category}}}</div>
    <div class="${suggestionPrefix}--wrapper">
      <div class="${suggestionPrefix}--subcategory-column {{#isSubcategoryDuplicate}}${suggestionPrefix}--duplicate-content{{/isSubcategoryDuplicate}}">
        <span class="${suggestionPrefix}--subcategory-column-text">{{{subcategory}}}</span>
      </div>
      <div class="${suggestionPrefix}--content">
        <div class="${suggestionPrefix}--subcategory-inline {{#isSubcategoryDuplicate}}${suggestionPrefix}--duplicate-content{{/isSubcategoryDuplicate}}">{{{subcategory}}}</div>
        <div class="${suggestionPrefix}--title {{#isDisplayTitleDuplicate}}${suggestionPrefix}--duplicate-content{{/isDisplayTitleDuplicate}}">{{{title}}}</div>
        <div class="${suggestionPrefix}--text">{{{text}}}</div>
      </div>
    </div>
  </div>
  `,
  footer: `
    <div class="${footerPrefix}">
      Search by <a class="${footerPrefix}--logo" href="https://www.algolia.com/docsearch">Algolia</a>
    </div>
  `
};

export default templates;

