window.onload = function() {
  const reference = document.querySelector(
    '.docsearch-live-demo-input-wrapper'
  );
  const popper = document.querySelector('.my-popper');

  const anotherPopper = new Popper(reference, popper, {
    placement: 'bottom-start',
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

  let i = 0;
  let txt;
  let query = '';

  document.querySelectorAll('.ds-sample-query').forEach(el => {
    el.onclick = function() {
      txt = el.getAttribute('data-sample');
      typeWriter();
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
      600: { perView: 4 },
      800: { perView: 8 },
      1200: { perView: 10 },
    },
  }).mount();
};

docsearch({
  apiKey: 'e3082526e1d5f37055241c335ab10f72',
  indexName: 'talksearch',
  inputSelector: '.custom-search-input',
  debug: false,
});

var demoDocsearch = docsearch({
  apiKey: '5990ad008512000bba2cf951ccf0332f',
  indexName: 'bootstrap',
  inputSelector: '.docsearch-live-demo-input',
  enhancedSearchInput: true,
  debug: false,
});
