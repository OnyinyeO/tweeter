'use strict';

function timeAgo(timestamp) {
  const now = new Date();
  const givenTime = new Date(timestamp);

  const timeDifference = now - givenTime;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365);
  if (seconds <= 59) {
    return 'now';
  }
  if (years > 0) {
    return years + (years === 1 ? ' year ago' : ' years ago');
  } else if (months > 0) {
    return months + (months === 1 ? ' month ago' : ' months ago');
  } else if (weeks > 0) {
    return weeks + (weeks === 1 ? ' week ago' : ' weeks ago');
  } else if (days > 0) {
    return days + (days === 1 ? ' day ago' : ' days ago');
  } else if (hours > 0) {
    return hours + (hours === 1 ? ' hour ago' : ' hours ago');
  } else if (minutes > 0) {
    return minutes + (minutes === 1 ? ' minute ago' : ' minutes ago');
  } else {
    return seconds + (seconds === 1 ? ' second ago' : ' seconds ago');
  }
}

$(document).ready(() => {
  const createTweetElement = (tweetObj, id) => {
    const tweetTime = timeAgo(tweetObj.created_at);
    const safeText = $('<div>').text(tweetObj.content.text).text();

    const tweet = $(`
      <article class="tweet-article">
        <header>
          <div>
            <h3><img src="https://i.pravatar.cc/150?u=${id}" alt="profile pic"/>${tweetObj.user.name}</h3>
            <h2>${tweetObj.user.handle}</h2>
          </div>
          <p class="tweet">${safeText}</p>
        </header>
        <hr>
        <footer>
          <span>${tweetTime}</span>
          <div>
            <span><i class="fa-solid fa-flag"></i></span>
            <span><i class="fa-solid fa-retweet"></i></span>
            <span><i class="fa-solid fa-heart"></i></span>
          </div>
        </footer>
      </article>
    `);

    return tweet;
  };

  const renderTweets = function (tweets) {
    let tweetResult = [];
    for (let i = tweets.length - 1; i >= 0; i--) {
      const tweet = createTweetElement(tweets[i], i);
      tweetResult.push(tweet);
    }
    return tweetResult;
  };

  $('#tweet-form').on('submit', function (event) {
    event.preventDefault();
    const tweet = $('#tweet-text').val();
    $('#error-message').slideUp(() => {
      if (tweet === '') {
        $('#error-message').text('Invalid Tweet').slideDown();
        return;
      }
      if (tweet.length > 140) {
        $('#error-message').text('Length too long!').slideDown();
        return;
      }

      $.ajax({
        url: 'http://localhost:8080/tweets',
        type: 'POST',
        data: JSON.stringify({ text: tweet }),
        contentType: 'application/json',
        success: (tweet) => {
          $('#tweets-container').prepend(createTweetElement(tweet));
          $('#tweet-text').val('');
        },
        error: function (error) {
          console.error('Error sending data:', error);
        },
      });
    });
  });

  const loadTweets = () => {
    $.ajax({
      url: 'http://localhost:8080/tweets',
      type: 'GET',
      success: function (data) {
        const tweets = renderTweets(data);
        $('#tweets-container').append(tweets);
      },
      error: function (err) {
        console.error(err.error);
      },
    });
  };

  loadTweets();
});
