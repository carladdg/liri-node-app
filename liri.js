var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");
require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);

var command = process.argv[2];
var content = process.argv[3];
runLiri(command, content);

function runLiri(command, content) {
    if (command === "my-tweets") {
        getTweets();
    }
    
    if (command === "spotify-this-song") {
        var song = "";
        if (content) {
            song = content;
        } else {
            song = "The Sign, Ace of Base";
        }

        searchSpotify(song);
    }
    
    if (command === "movie-this") {
        var movie = "";
        if (content) {
            movie = content;
        } else {
            movie = "Mr. Nobody";
        }

        searchOmdb(movie);
    }
    
    if (command === "do-what-it-says") {
        fs.readFile("./random.txt", "utf8", function(error, data) {
            if (error) {
                throw error;
            }
    
            var dataArray = data.split(",");
            var randomCommand = dataArray[0];
            var randomContent = dataArray[1];

            runLiri(randomCommand, randomContent);
        })
    }
}

function getTweets() {
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

function searchSpotify(song) {
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

function searchOmdb(movie) {
    request("http://www.omdbapi.com/?apikey=trilogy&type=movie&t=" + movie, function(error, response, body) {
        if (!error && response.statusCode === 200 ) {
            var movieInfo = JSON.parse(body);

            if (movieInfo.Response === "True") {
                var movieTitle = movieInfo.Title;
                var movieYear = movieInfo.Year;
                var movieImdbRating = movieInfo.Ratings[0].Value;
                var movieRottenTomatoesRating = movieInfo.Ratings[1].Value;
                var movieCountry = movieInfo.Country;
                var movieLanguage = movieInfo.Language;
                var moviePlot = movieInfo.Plot;
                var movieActors = movieInfo.Actors;
                
                console.log("\nYour OMDB Search Results");
                console.log(`\n${movieTitle} (${movieYear}) \nStarring ${movieActors} \n\n${moviePlot} \n\nProduced in ${movieCountry}\nLanguages Spoken: ${movieLanguage} \n\nIMDB: ${movieImdbRating} \nRotten Tomatoes: ${movieRottenTomatoesRating}`);
            } else {
                console.log(movieInfo.Error);
            }
        } else {
            throw error;
        }
    })
}