(function($) {
  $('.join-form').on('submit', function() {
    var $button = $(this).find('button');
    var $email = $(this).find('input[name="email"]');
    var $url = $(this).find('input[name="url"]');
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
