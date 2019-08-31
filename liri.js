// require packages
require("dotenv").config();
var keys = require('./keys.js');
var fs = require("fs");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");
//  user inputs global variables and a divider variable for formatting responses
var command = process.argv[2];
var argument = process.argv.slice(3).join(" ");
var divider = `\n----------\n\n`;
// dec,are function to record user input and LIRI response in the log.txt file
function logCommand(param) {
  fs.appendFile("log.txt", param, function (err) {
    if (err) {
      console.log(`\nError logging information\n\n${err}\n${divider}`);
    }
  })
};
// declare function for movie data from omdb and displaying results
function axiosGetMovie() {
  var movieName = "";
  if (argument) {
    movieName = argument;
  } else {
    movieName = "Mr Nobody";
  };
  var omdbQueryUrl = `http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=trilogy`;
  axios.get(omdbQueryUrl)
    .then(function (response) {
      omdbInfo = response.data;
      var title = omdbInfo.Title;
      var year = omdbInfo.Year;
      var imdbRating = omdbInfo.Ratings[0].Value;
      var rotRating = omdbInfo.Ratings[1].Value;
      var country = omdbInfo.Country;
      var language = omdbInfo.Language;
      var plot = omdbInfo.Plot;
      var actors = omdbInfo.Actors;
      var movieInfo = `\nTitle: ${title}\n\nYear: ${year}\n\nIMDB Rating: ${imdbRating}\n\nRotten Tomatoes Rating: ${rotRating}\n\nCountry: ${country}\n\nLanguage: ${language}\n\nPlot: ${plot}\n\nActors: ${actors}`;
      console.log(`\n${movieInfo} \n${divider}`);
      logCommand(`${divider}Command: ${command} ${argument}\n\nResults:\n${movieInfo}\n`);
    })
    .catch(function (error) {
      console.log(`\nLIRI says: Sorry I can't seem to find your movie\n\n${error}\n${divider}`);
    })
};
// declare function for concert data retrieval from bands in town and displaying results
function axiosGetConcert() {
  if (argument) {
    var bandsQueryUrl = `https://rest.bandsintown.com/artists/${argument}/events?app_id=codingbootcamp`;
    axios.get(bandsQueryUrl)
      .then(function (response) {
        var bandsInfo = response.data;
        if (bandsInfo.length > 0) {
          logCommand(`${divider}Command: ${command} ${argument}\n\nUpcoming shows for ${argument} are:\n`);
        console.log(`\nUpcoming ${argument} shows:`);
        for (var i = 0; i < bandsInfo.length; i++) {
          var concertVenue = bandsInfo[i].venue.name;
          var city = bandsInfo[i].venue.city;
          var region = bandsInfo[i].venue.region;
          var country = bandsInfo[i].venue.country;
          var date = moment(bandsInfo[i].datetime, "YYYY-MM-DDTHH:mm:ss");
          var dateConverted = moment(date).format("MM/DD/YYYY");
          console.log(`\n${i + 1}. ${concertVenue}, ${city}, ${region}, ${country} on ${dateConverted} \n`);
          logCommand(`\n${concertVenue}, ${city}, ${region}, ${country} on ${dateConverted}\n`);
        };
      } else {
        logCommand(`${divider}Command: ${command} ${argument}\n\nLooks like ${argument} is not touring right now\n`)
        console.log(`\nLIRI says: Looks like ${argument} is not touring right now\n${divider}`)
      };
      })
      .catch(function (error) {
        console.log(`\nLIRI says: Sorry I can't seem to find your artist\n\n${error}\n${divider}`);
      })
  } else {
    logCommand(`${divider}Command: ${command}\n\nPlease choose an artist and try again\n`);
    console.log(`\nLIRI says: Please choose an artist and try again\n${divider}`);
  };
};
// declare function for spotify data and displaying results
function spotifyThis() {
  var spotify = new Spotify(keys.spotify);
  var song = "";
  if (argument) {
    song = argument;
  } else {
    song = "The Sign Ace of Base"
  };
  spotify
    .search({ type: 'track', query: song, limit: 1 })
    .then(function (response) {
      var artist = response.tracks.items[0].artists[0].name;
      var songName = response.tracks.items[0].name;
      var album = response.tracks.items[0].album.name;
      var songUrl = response.tracks.items[0].external_urls.spotify;
      var spotifyInfo = `\nArtist: ${artist}\n\nSong: ${songName}\n\nAlbum: ${album}\n\nLink: ${songUrl}`;
      console.log(`${spotifyInfo} \n${divider}`);
      logCommand(`${divider}Command: ${command} ${argument}\n\nResults:\n${spotifyInfo}\n`);
    })
    .catch(function (err) {
      console.log(`\nLIRI says: Sorry I can't seem to find your song\n\n${err}\n${divider}`);
    })
};
// declare function for reading random.txt file and running the command within
function readAndRun() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(`\nLIRI says: Ooops I'm having trouble reading your instructions\n\n${error}\n${divider}`);
    };
    var inputArr = data.split(",");
    argument = inputArr[1];
    if (inputArr[0] === "spotify-this-song") {
      spotifyThis();
    } else if (inputArr[0] === "concert-this") {
      axiosGetConcert();
    } else if (inputArr[0] === "movie-this") {
      axiosGetMovie();
    };
  })
};
// switch case to determine user's command and calling corresponsing function
switch (command) {
  case "movie-this":
    axiosGetMovie();
    break;

  case "concert-this":
    axiosGetConcert();
    break;

  case "spotify-this-song":
    spotifyThis();
    break;

  case "do-what-it-says":
    readAndRun();
    break;
};