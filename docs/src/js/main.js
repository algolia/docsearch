docsearch({
  apiKey: '25626fae796133dc1e734c6bcaaeac3c',
  indexName: 'docsearch',
  inputSelector: '.custom-search-input',
  debug: false,
});

(function() {
  const applyForm = document.querySelector('.custom-apply-form');
  if (!applyForm) {
    return;
  }

  applyForm.onsubmit = submitForm;

  // Called when submitting the form
  function submitForm(event) {
    event.preventDefault();
    grecaptcha.execute();
  }

  // Called when recaptcha thinks you're a human.
  // Note: for testing purpose, opening the page in incognito and running
  // document.querySelectorAll('#apply button')[0].click() seems to trigger
  // a failed recaptcha.
  function recaptchaCallback(token) {
    const url = applyForm.getAttribute('action');
    const payload = {
      recaptchaToken: token,
      documentationUrl: getValue('documentationUrl'),
      repoUrl: getValue('repoUrl'),
      email: getValue('email'),
      algoliaPolicy: getValue('algoliaPolicy'),
    };

    postJSON(url, payload, onHubResponse);
    grecaptcha.reset();
  }
  window.recaptchaCallback = recaptchaCallback;

  // Called with the response from the hub
  function onHubResponse(response) {
    try {
      const data = JSON.parse(response);
      if (data.success) {
        displaySuccess();
        return;
      }
      displayErrors(data.errors);
    } catch (err) {
      // In case the backend fails, we display our email, to have people still
      // contacting us
      formFallback();
    }
  }

  // Return the value of a given input
  function getValue(inputName) {
    const input = applyForm.querySelector(`input[name=${inputName}]`);
    if (input.type === 'checkbox') {
      return input.checked;
    }
    return input.value;
  }

  // POST data to a url and call callback with the result
  function postJSON(url, data, callback) {
    const request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function() {
      callback(request.responseText);
    };
    request.send(JSON.stringify(data));
  }

  // Clear all errors of the form
  function clearAllErrors() {
    const inputSteps = applyForm.querySelectorAll('.form-step');
    inputSteps.forEach(inputStep => {
      inputStep.classList.remove('form-step__error');
    });
  }

  // Display errors returned from the hub
  function displayErrors(errors) {
    if (errors === 'recaptcha') {
      formFallback();
      return;
    }

    clearAllErrors();
    // We loop through errors in reverse order, to make sure we always display
    // the first error message of each field
    errors.reverse().forEach(error => {
      const inputName = error.field;
      const formStep = applyForm.querySelector(
        `.form-step[name=step-${inputName}]`
      );
      formStep.classList.add('form-step__error');
      formStep.querySelector('.form-error').innerHTML = error.message;
    });
  }

  // Display success message
  function displaySuccess() {
    const formThankYou = document.querySelector('.custom-form-thank-you');
    const formContent = document.querySelector('.custom-form-content');
    const placeholderEmail = document.querySelector(
      '.custom-placeholder-email'
    );
    const placeholderUrl = document.querySelector('.custom-placeholder-url');

    const email = getValue('email');
    const documentationUrl = getValue('documentationUrl');

    placeholderEmail.innerText = email;
    placeholderUrl.innerText = documentationUrl;

    formContent.classList.toggle('hidden');
    formThankYou.classList.toggle('hidden');
  }

  // Display the error fallback when recaptcha is failing
  function formFallback() {
    const formContent = document.querySelector('.custom-form-content');
    const recaptchaFallback = document.querySelector(
      '.custom-form-recaptcha-fallback'
    );

    formContent.classList.toggle('hidden');
    recaptchaFallback.classList.toggle('hidden');
  }
})();
