const docsearchPrefix = 'algolia-docsearch-suggestion';

export function suggestionTemplate(rawHits: any): string {
  return Object.values(rawHits)
    .map((hits: any) => {
      return hits
        .map((hit: any) => {
          const {
            isCategoryHeader,
            isSubCategoryHeader,
            category,
            subcategory,
            isTextOrSubcategoryNonEmpty,
            url,
            title,
            text,
          } = hit;

          return `
<a
  class="${docsearchPrefix}
    ${isCategoryHeader ? `${docsearchPrefix}__main` : ''}
    ${isSubCategoryHeader ? `${docsearchPrefix}__secondary` : ''}
  "
  aria-label="Link to the result"
  href="${url}"
  >
  <div class="${docsearchPrefix}--category-header">
      <span class="${docsearchPrefix}--category-header-lvl0">${category}</span>
  </div>
  <div class="${docsearchPrefix}--wrapper">
    <div class="${docsearchPrefix}--subcategory-column">
      <span class="${docsearchPrefix}--subcategory-column-text">${subcategory}</span>
    </div>
    ${
      isTextOrSubcategoryNonEmpty
        ? `
    <div class="${docsearchPrefix}--content">
      <div class="${docsearchPrefix}--subcategory-inline">${subcategory}</div>
      <div class="${docsearchPrefix}--title">${title}</div>
      ${text ? `<div class="${docsearchPrefix}--text">${text}</div>` : ''}
    </div>
`
        : ''
    }
  </div>
</a>
`;
        })
        .join('');
    })
    .join('');
}
