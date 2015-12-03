let prefix = 'ads-suggestion';

let templates = {
  suggestion: `
  <div class="${prefix} {{#isCategoryHeader}}${prefix}__main{{/isCategoryHeader}} {{#isSubcategoryHeader}}${prefix}__secondary{{/isSubcategoryHeader}}">
    <div class="${prefix}--category-header">{{{category}}}</div>
    <div class="${prefix}--wrapper">
      <div class="${prefix}--subcategory">{{{subcategory}}}</div>
      <div class="${prefix}--content">
        <div class="${prefix}--subcategory">{{{subcategory}}}</div>
        <div class="${prefix}--title">{{{title}}}</div>
        <div class="${prefix}--text">{{{text}}}</div>
      </div>
    </div>
  </div>
  `
};

export default templates;

