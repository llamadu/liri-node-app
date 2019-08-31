# liri-node-app
### Overview
LIRI  (**L**anguage **I**nterpretation and **R**ecognition **I**nterface) is a command line node app that searches for and returns song, concert, and movie information.

### How LIRI Works
LIRI uses four node package managers to process requests:
* DotEnv protects API keys.
* Node-Spotify-API handles the search for song information.
* Axios handles calls to OMDB and Bands In Town APIs.
* Moment is used to format time and date.
  
### How to use LIRI
liri.js is able to take in the following commands:
1. **movie-this ->insert movie name here<-**
  - This command utilizes axios to query the OMDB API and returns information on the movie input by the user. If a movie is not input by the user, LIRI will provide information for "Mr. Nobody"  as the default response.
2. **concert-this ->insert band/artist name here<-**
  - This command utilizes axios to query the Bands In town API and return information on upcoming shows for the artist that was input by the user. If the user does not input artist LIRI will prompt the user to complete the command correctly. Moment converts the event dates to the MM/DD/YYYY format.
3. **spotify-this-song ->insert song name here<-**
  - This command utilizes Node-Spotify-API to retrieve data from Spotify on the song that was input by the user. If the user does not enter a song name LIRI will return information for the song "The Sign" by Ace of Base as the default response.
4. **do-what-it-says**
  - This command reads from the random.txt file and performs the command that is present in that document.
LIRI logs each valid command entered and the corresponding results in the log.txt file.

### LIRI in Action

##### images

![movie-this]()
![concert-this]()
![spotify-this-song]()
![do-what-it-says]()


