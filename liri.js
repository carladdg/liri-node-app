require("dotenv").config();
var keys = require("./keys.js");

var Twitter = require("twitter");
var twitter = new Twitter(keys.twitter);

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var request = require("request");

var fs = require("fs");

var inquirer = require("inquirer");

var chalk = require("chalk");
var chalkTitle = chalk.black;


var command = "";
var content = "";
initializeLiri();

function initializeLiri() {
    console.log("\nWelcome to LIRI: Language Interpretation and Recognition Interface!");
    inquirer.prompt([
        {
            name: "command",
            type: "list",
            message: "What would you like to do?",
            choices: [
                { name: "See my Tweets", value: "my-tweets" },
                { name: "Search for a song on Spotify", value: "spotify-this-song" },
                { name: "Look up a movie on OMDB", value: "movie-this" },
                { key: "test", name: "Surprise me", value: "do-what-it-says" },
                "Quit LIRI"
            ]
        }
    ]).then(function(response) {
        command = response.command;
        var keyword = "";

        if (command === "spotify-this-song") {
            keyword = "song";
        } else if (command === "movie-this") {
            keyword = "movie";
        }

        if (keyword) {
            getContent(keyword);
        } else {
            runLiri(command, content);
        }
    })
}

function getContent(keyword) {
    inquirer.prompt([
        {
            name: keyword,
            type: "input",
            message: `Please enter a ${keyword} title (or leave it blank for a surprise ${keyword}!)`
        }
    ]).then(function(response) {
        content = response[keyword];
        runLiri(command, content);
    })
}

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

    logActivity(command, content);
    // initializeLiri(); 
    // ARGHH HOW DO I GET THIS TO RUN SYNCHRONOUSLY
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