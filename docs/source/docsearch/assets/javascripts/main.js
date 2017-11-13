//= require ./vendors/clipboard.min.js
//= require ./components/copy-link.js

function setScreen() {
  const screens = [
    'screen_react',
    'screen_laravel',
    'screen_akka',
    'screen_bootstrap',
    'screen_vue',
    'screen_middleman',
  ];
  const rand = Math.floor(Math.random() * (screens.length - 0) + 0);
  const imgPath = '/docsearch/assets/images/screens/';
  const screenImage = document.createElement('img');
  const imageHolder = document.querySelector('#demo-screens');
  const imagePlaceholder = document.querySelector('#placeholder');

  if (imagePlaceholder) {
    screenImage.classList.add('demo-screen', 'w100p', 'elevation1');
    screenImage.src = imgPath + screens[rand] + '.png';

    imagePlaceholder.remove();
    imageHolder.appendChild(screenImage);
  }
}

window.addEventListener('load', function() {
  setScreen();
  document.body.classList.add('ready');

  (function($) {
    function pardotAppendIframe(url) {
      var iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.width = 1;
      iframe.height = 1;
      document.body.appendChild(iframe);
    }

    $('.join-form').on('submit', function(e) {
      e.preventDefault();

      var $email = $(this).find('input[name="email"]');
      var $url = $(this).find('input[name="url"]');
      var $owner = $(this).find('input[name="owner"]');
      var error = false;
      $(this).find('.has-errors').removeClass('has-errors');
      if (!$email.val()) {
        $email.closest('.input-group').addClass('has-errors');
        error = true;
      }
      if (!$url.val()) {
        $url.closest('.input-group').addClass('has-errors');
        error = true;
      }
      if (!$owner.is(':checked')) {
        $owner.addClass('has-errors');
        error = true;
      }
      if (error) {
        return false;
      }

      $.ajax({
        url: 'https://www.algolia.com/docsearch/join',
        type: 'POST',
        data: {
          email: $email.val(),
          url: $url.val()
        }
      }).done(function() {
        pardotAppendIframe(
          'https://go.pardot.com/l/139121/2016-08-05/ldp67?email=' +
          encodeURIComponent($email.val()) +
          '&website=' +
          encodeURIComponent($url.val())
        );

        $('.join-form-fill').hide();
        $('.join-form-validated').removeClass('hidden');
      })
        .fail(function() {
          alert('An error occurred, please try again later.');
        });

      return false;
    });
  })(jQuery);
});
