$(document).ready(function () {
  // --- our code goes here ---
  $('#tweet-text').on('input', function () {
    let maxLength = 140;
    let textLength = $(this).val().length;
    let remainingSpace = maxLength - textLength;
    $(this).siblings('div').find('#counter').text(remainingSpace);
    if (remainingSpace <= 0) {
      $(this).siblings('div').find('#counter').css('color', 'red');
    } else {
      $(this).siblings('div').find('#counter').css('color', '');
    }
  });
});
