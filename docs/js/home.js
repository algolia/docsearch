(function($) {
  function pardotAppendIframe(url) {
    var iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.width = 1;
    iframe.height = 1;
    document.body.appendChild(iframe);
  }

  $('.join-form').on('submit', function(e) {
    var $button = $(this).find('button');
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
    $button.attr('disabled', true);
    $.ajax({
      url: 'https://www.algolia.com/docsearch/join',
      type: 'POST',
      data: {
        email: $email.val(),
        url: $url.val()
      }
    }).done(function() {
      pardotAppendIframe('https://go.pardot.com/l/139121/2016-08-05/ldp67?email=' + encodeURIComponent($email.val()) + '&website=' + encodeURIComponent($url.val()));
      $('.join-form').hide();
      $('.join-form-validated').show();
    }).fail(function() {
      $button.attr('disabled', null);
      alert('An error occurred, please try again later.');
    });

    return false;
  });
})(jQuery);
