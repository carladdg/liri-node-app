require("dotenv").config();
var keys = require("./keys.js");

var Twitter = require("twitter");
var twitter = new Twitter(keys.twitter);

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var request = require("request");

var fs = require("fs");

var chalk = require("chalk");
var chalkTitle = chalk.black;


var command = process.argv[2];
var content = process.argv[3];
runLiri(command, content);

function runLiri(command, content) {
    if (command === "my-tweets") {
        getTweets();
    }
    
    else if (command === "spotify-this-song") {
        var song = "";
        if (content) {
            song = content;
        } else {
            song = "The Sign, Ace of Base";
        }

        searchSpotify(song);
    }
    
    else if (command === "movie-this") {
        var movie = "";
        if (content) {
            movie = content;
        } else {
            movie = "Mr. Nobody";
        }

        searchOmdb(movie);
    }
    
    else if (command === "do-what-it-says") {
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

    else {
        return console.log("Sorry, you entered an invalid LIRI command.");
    }

    logActivity(command, content);
}

function getTweets() {
    twitter.get("statuses/user_timeline", { screen_name: "carlabot2018", count: 20 }, function(error, tweets) {
        if (error) {
            throw error;
        }

        console.log(chalkTitle.bgCyanBright("\nLatest Tweets from @carlabot2018"));
        tweets.forEach(function(tweet) {
            console.log(chalk`\n{cyanBright ${tweet.created_at}} \n${tweet.text}`);
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

        console.log(chalkTitle.bgGreenBright("\nYour Spotify Search Results"));
        console.log(chalk`\n{greenBright Track:} ${songName} \n{greenBright Artist:} ${songArtist} \n{greenBright Album:} ${songAlbum} \n{greenBright Listen Here:} ${songLink}`);
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
                
                console.log(chalkTitle.bgYellowBright("\nYour OMDB Search Results"));
                console.log(chalk`\n{yellowBright.underline ${movieTitle} (${movieYear})} \n\n${moviePlot} \nStarring ${movieActors} \n\n{yellowBright Produced In:} ${movieCountry}\n{yellowBright Languages Spoken:} ${movieLanguage} \n\n{yellowBright IMDB Rating:} ${movieImdbRating} \n{yellowBright Rotten Tomatoes Rating:} ${movieRottenTomatoesRating}`);
            } else {
                console.log(movieInfo.Error);
            }
        } else {
            throw error;
        }
    })
}

function logActivity(command, content) {
    var record = "";
    if (content) {
        record = `${command} ${content}; `;
    } else {
        record = `${command}; `;
    }
    
    fs.appendFile("log.txt", record, function(error) {
        if (error) {
            throw error;
        }
    })
}