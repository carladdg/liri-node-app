var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];

if (command === "my-tweets") {
    console.log("Tweet");
}

if (command === "spotify-this-song") {
    console.log("Spotify");
}

if (command === "movie-this") {
    console.log("Movie");
}

if (command === "do-what-it-says") {
    console.log("Random");
}