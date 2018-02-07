const copy_links = [...document.querySelectorAll('.copy-link')];

copy_links.forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    return false;
  });
});

const clipboard = new Clipboard('.copy-link', {
  text: function(trigger) {
    const wrapper = $(trigger).closest('.snippet-wrapper');
    const current_snippet = wrapper.find('.tab-pane.active pre');

    return current_snippet.text().replace('<?php\n', '');
  }
});


clipboard.on('success', function(e) {
  const nodes = e.trigger.querySelector('.tooltip').childNodes;
  const lastNode = nodes[nodes.length - 1];
  
  lastNode.nodeValue = 'Copied!';

  setTimeout(function (e2) {
    lastNode.nodeValue = 'Copy';
  }, 3000);
});