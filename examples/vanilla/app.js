import docsearch from 'docsearch.js';
import autocomplete from 'autocomplete.js';

// const inputNode = document.querySelector('#searchbox');

// inputNode.addEventListener('input', event => {
//   searchService.search({ query: event.target.value });
// });

const docsearchPrefix = 'algolia-docsearch-suggestion';

function suggestionTemplate(hits) {
  return Object.values(hits)
    .map(hits => {
      return hits
        .map(hit => {
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

function docsearchAutocomplete({
  apiKey,
  indexName,
  inputSelector,
  algoliaOptions,
}) {
  const searchService = docsearch({
    apiKey,
    indexName,
  });

  autocomplete(
    document.querySelector(inputSelector),
    { hint: false, debug: true },
    [
      {
        source: (query, callback) => {
          return searchService
            .search({ ...algoliaOptions, query })
            .then(({ hits }) => {
              callback([hits]);
            });
        },
        displayKey: 'name',
        templates: {
          suggestion: suggestionTemplate,
        },
      },
    ]
  ).on('autocomplete:selected', function(event, suggestion, dataset, context) {
    console.log(event, suggestion, dataset, context);
  });
}

docsearchAutocomplete({
  apiKey: '25626fae796133dc1e734c6bcaaeac3c',
  indexName: 'docsearch',
  inputSelector: '#searchbox',
});

// function suggestionTemplate(hits: any) {
//   const itemsTemplate = Object.entries(hits)
//     .map(([category, records]: [any, any]) => {
//       return Object.values(records)
//         .map((record: any) => {
//           return record.map((subItem: any) => {
//             console.log(subItem);
//             const level = subItem.categories.length;
//             const lastCategory = subItem.categories[level - 1];

//             return `
// ${category} – ${lastCategory} (${level})
// ${subItem.excerpt}
// `;
//           });
//         })
//         .join('');
//     })
//     .join('–––');

//   return `<ul>${itemsTemplate}</ul>`;
// }
