/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(() => {
  // Test / driver code (temporary). Eventually will get this from the server.
  const tweetData = [
    {
      user: {
        name: 'Newton',
        avatars: 'https://i.imgur.com/73hZDYK.png',
        handle: '@SirIsaac',
      },
      content: {
        text: 'If I have seen further it is by standing on the shoulders of giants',
      },
      created_at: 1461116232227,
    },
    {
      user: {
        name: 'Descartes',
        avatars: 'https://i.imgur.com/nlhLi3I.png',
        handle: '@rd',
      },
      content: {
        text: 'Je pense , donc je suis',
      },
      created_at: 1461113959088,
    },
  ];

  const createTweetElement = (tweetObj) => {
    const tweet_Time = timeago.format(tweetObj.created_at);
    const safeText = $('<div>').text(tweetObj.content.text).html();
    const tweet = $(`<article class="tweet-article">
      <header>
        <div>
          <h3><img src=${tweetObj.user.avatars} alt="profile pic"/>${tweetObj.user.name}</h3>
          <h2>${tweetObj.user.handle}</h2>
        </div>
        <p class="tweet">${safeText}</p>
      </header>
      <hr>
      <footer>
        <span>${tweet_Time}</span>
        <div>
          <span><i class="fa-solid fa-flag"></i></span>
          <span><i class="fa-solid fa-retweet"></i></span>
          <span><i class="fa-solid fa-heart"></i></span>
        </div>
      </footer>
    </article>`);
    return tweet;
  };

  const renderTweets = function (tweets) {
    let tweetResult = [];
    // loops through tweets in descending order
    for (let i = tweets.length - 1; i >= 0; i--) {
      tweetResult.push(createTweetElement(tweets[i])); // calls createTweetElement for each tweet and push it to the array
    }
    return tweetResult;
  };

  $('#tweet-form').on('submit', function (event) {
    event.preventDefault();
    const formData = $('#tweet-form').serialize();
    const tweet = $('#tweet-text').val();
    $('#error-message').slideUp(() => {
      // Check if formData is empty or null
      if (tweet === '') {
        $('#error-message').text('Invalid Tweet').slideDown();
        return; // Exit the function
      }
      if (tweet.length > 140) {
        $('#error-message').text('Length too long!').slideDown();
        return; // Exit the function
      }

      $.post('/tweets', formData)
        .then((req, res) => {
          window.location.href = '/';
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });

  const $loadTweets = () => {
    $.get('/tweets')
      .then((res) => {
        $('#tweets-container').append(renderTweets(res)); //takes return value and appends it to the tweets container
      })
      .catch((err) => {
        console.log(err);
      });
  };

  $loadTweets();
});
