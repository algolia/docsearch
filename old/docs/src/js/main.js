docsearch({
  apiKey: '25626fae796133dc1e734c6bcaaeac3c',
  indexName: 'docsearch',
  inputSelector: '.custom-search-input',
  debug: false,
});

const applyForm = document.querySelector('.custom-apply-form');
if (applyForm) {
  const formThankYou = document.querySelector('.custom-form-thank-you');
  const formContent = document.querySelector('.custom-form-content');
  const placeholderEmail = document.querySelector('.custom-placeholder-email');
  const placeholderUrl = document.querySelector('.custom-placeholder-url');

  applyForm.onsubmit = function(event) {
    event.preventDefault();

    const method = applyForm.getAttribute('method');
    const action = applyForm.getAttribute('action');
    const formData = new FormData(applyForm);

    const request = new XMLHttpRequest();
    request.open(method, action);
    request.send(formData);

    const userEmail = document.querySelector('input[name=email]').value;
    const userUrl = document.querySelector('input[name=url]').value;

    placeholderEmail.innerText = userEmail;
    placeholderUrl.innerText = userUrl;

    formContent.classList.toggle('hidden');
    formThankYou.classList.toggle('hidden');

    event.preventDefault();
  };
}
