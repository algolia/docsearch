window.onload = function() {
  let i = 0;
  let txt;
  let query = '';

  const demoDocsearch = docsearch({
    apiKey: '5990ad008512000bba2cf951ccf0332f',
    indexName: 'bootstrap',
    inputSelector: '.docsearch-live-demo-input',
    algoliaOptions: {
      facetFilters: ['version:4.1'],
    },
    enhancedSearchInput: true,
    debug: false,
  });

  const reference = document.querySelector(
    '.docsearch-live-demo-input-wrapper'
  );
  const popperElement = document.querySelector('.my-popper');

  const anotherPopper = new Popper(reference, popperElement, {
    placement: 'bottom-start',
    removeOnDestroy: 'true',
  });

  function openDocsearch(sampleQuery) {
    demoDocsearch.autocomplete.autocomplete.setVal(sampleQuery);
    demoDocsearch.autocomplete.autocomplete.open();
  }

  function typeWriter() {
    const speed = 250;
    if (i < txt.length) {
      query += txt.charAt(i);
      openDocsearch(query);
      i++;
      setTimeout(typeWriter, speed);
    }
  }

  document.querySelectorAll('.ds-sample-query').forEach(el => {
    const element = el;
    element.onclick = function(event) {
      txt = el.getAttribute('data-sample');
      typeWriter();
      event.preventDefault();
    };
  });

  demoDocsearch.autocomplete.on('autocomplete:opened', () => {
    anotherPopper.destroy();
  });

  new Glide('.glide', {
    type: 'carousel',
    startAt: 0,
    perView: 16,
    autoplay: 1300,
    breakpoints: {
      400: {
        perView: 4,
      },
      600: {
        perView: 6,
      },
      800: {
        perView: 8,
      },
      1000: {
        perView: 10,
      },
      1200: {
        perView: 12,
      },
    },
  }).mount();
};
