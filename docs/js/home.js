(function($) {
  $('.join-form').on('submit', function() {
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
      $email.val('');
      $url.val('');
      $button.text('Thank you!');
    }).fail(function() {
      $button.attr('disabled', null);
      alert('An error occurred, please try again later.');
    })
    return false;
  });
})(jQuery);
