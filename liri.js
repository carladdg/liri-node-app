var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);

var command = process.argv[2];

if (command === "my-tweets") {
    twitter.get("statuses/user_timeline", { screen_name: "carlabot2018", count: 20 }, function(error, tweets) {
        if (error) {
            throw error;
        }

        console.log("\nLatest Tweets from @carlabot2018");
        tweets.forEach(function(tweet) {
            console.log(`\n${tweet.created_at}\n${tweet.text}`);
        })
    })
}

if (command === "spotify-this-song") {
    var song = "";
    
    if (process.argv[3]) {
        song = process.argv[3];
    } else {
        song = "The Sign, Ace of Base"
    }

    spotify.search({ type: "track", query: song, limit: 1 }, function(error, data) {
        if (error) {
            throw error;
        }

        var songName = data.tracks.items[0].name;
        var songLink = data.tracks.items[0].external_urls.spotify;
        var songArtist = data.tracks.items[0].artists[0].name;
        var songAlbum = data.tracks.items[0].album.name;

        console.log("\nYour Spotify Search Results");
        console.log(`\nTrack: ${songName} \nArtist: ${songArtist} \nAlbum: ${songAlbum} \nListen Here: ${songLink}`);
    })
}

if (command === "movie-this") {
    console.log("Movie");
}

if (command === "do-what-it-says") {
    console.log("Random");
}