# liri-node-app

### Welcome to **LIRI**: A command-line **L**anguage **I**nterpretation and **R**ecognition **I**nterface!

#### What can LIRI do?

LIRI can...
* :bird: Show you the latest Tweets from @carlabot2018
    * In future versions, you should be able to see the latest Tweets of any public Twitter user.
* :musical_note: Search Spotify for any song title
* :movie_camera: Search OMDB (the Open Movie Database) for any movie title
* :question: Surprise you with one of the above!

So a better question would be, what *can't* LIRI do?

#### Great! So how do I use LIRI?

LIRI is a command-line application built using Node.js, so you can run it in your terminal. Type one of the following commands *exactly* as specified below to see it in action.

* :bird: node liri.js my-tweets
* :musical_note: node liri.js spotify-this-song 'Song Title'
    * If you don't enter a song title, LIRI will pick a fun song to search for you.
* :movie_camera: node liri.js movie-this 'Movie Title'
    * If you don't enter a movie title, LIRI will pick a cool movie to search for you.
* :question: node liri.js do-what-it-says

#### Hmm, those commands seem a little finicky.

I know, I know. Currently in [development](https://github.com/carladdg/liri-node-app/tree/development) is a much more user-friendly LIRI interface built using Inquirer.js. It's nearly there, but unfortunately there are a few last asynchronicity issues to figure out. :(

### Happy LIRI-ing!
