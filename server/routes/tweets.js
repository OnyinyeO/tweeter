'use strict';

// Import necessary modules and dependencies
const userHelper = require('../lib/util/user-helper');
const express = require('express');
const tweetsRoutes = express.Router();

// Export a function that takes DataHelpers as an argument
module.exports = function (DataHelpers) {
  // GET endpoint to retrieve all tweets
  tweetsRoutes.get('/', function (req, res) {
    // Call DataHelpers.getTweets to fetch all tweets
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        // If there's an error, send a 500 status code and the error message
        res.status(500).json({ error: err.message });
      } else {
        // If successful, send the tweets as a JSON response
        res.json(tweets);
      }
    });
  });

  // POST endpoint to create a new tweet
  tweetsRoutes.post('/', function (req, res) {
    // Check if the 'text' field is missing in the POST body
    if (!req.body.text) {
      // If 'text' is missing, send a 400 status code and an error message
      res.status(400).json({ error: 'invalid request: no data in POST body' });
      return;
    }

    // Generate a random user if 'user' field is missing in the POST body
    const user = req.body.user
      ? req.body.user
      : userHelper.generateRandomUser();

    // Create the tweet object with the necessary fields
    const tweet = {
      user: user,
      content: {
        text: req.body.text,
      },
      created_at: Date.now(),
    };

    // Call DataHelpers.saveTweet to save the new tweet
    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        // If there's an error, send a 500 status code and the error message
        res.status(500).json({ error: err.message });
      } else {
        // If successful, send a 201 status code and the newly created tweet as a JSON response
        res.status(201).json(tweet);
      }
    });
  });

  // Return the tweetsRoutes to be used in the main Express app
  return tweetsRoutes;
};
