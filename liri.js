require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

let command = process.argv[2];
let param = process.argv.slice(3).join(" ");

var concertThis = function (param) {
    axios.get("https://rest.bandsintown.com/artists/" + param + "/events?app_id=codingbootcamp")
		.then(function (response) {
			for (var i = 0; i < 5; i++) {
				let concertResults = "--------------------------------------------------------------------" +
					"\nVenue Name: " + response.data[i].venue.name +
					"\nVenue Location: " + response.data[i].venue.city +
					"\nDate of the Event: " + moment(response.data[i].datetime).format("MM/DD/YYYY") +
					"\n--------------------------------------------------------------------";
                console.log(concertResults);
                fs.appendFile('log.txt',concertResults);
			}
		})
		.catch(function (error) {
			console.log(error);
		});
}



var movieThis = function (param) {
    axios.get("http://www.omdbapi.com/?t=" + param + "&y=&plot=short&apikey=trilogy")
		.then(function (response) {
			let = movieInfo = "--------------------------------------------------------------------" +
				"\nTitle " + response.data.Title +
				"\nYear: " + response.data.Year +
				"\nIMDB Rating: " + response.data.Ratings[0].Value +
				"\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
				"\nCountry: " + response.data.Country +
				"\nLanguage: " + response.data.Language +
				"\nPlot: " + response.data.Plot +
				"\nActors/Actresses " + response.data.Actors +
				"\n--------------------------------------------------------------------";
			console.log(movieInfo);
		})
		.catch(function (error) {
			console.log(error);
        });
        if(param === "Mr.Nobody"){
            console.log("--------------------------------------------------------------------");
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");

        }
}


function spotifyThisSong(song) {
    spotify.search({ type: 'track', query: song, limit: 1 }, function (error, data) {
        if (error) {
            console.log('Error occurred.');
        } else {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];
                console.log("\n--------------------------------------------------------------------");
                console.log("\nArtist: " + songData.artists[0].name);
                console.log("\nSong: " + songData.name);
                console.log("\nPreview URL: " + songData.preview_url);
                console.log("\nAlbum: " + songData.album.name);
                console.log("\n--------------------------------------------------------------------");
            }
        }
    });
}

function doTheThing() {
    fs.readFile('random.txt', "utf8", function (error, data) {
        var txt = data.split(',');
        spotifyThisSong(txt[1]);
    });
}

switch (command) {
    case ('concert-this'):
            concertThis(param);
        break;
    case ('spotify-this-song'):
            if(param){
                spotifyThisSong(param);
            } else{
                spotifyThisSong("The Sign")
            }
        break;
    case ('movie-this'):
            if(param){
                movieThis(param);
            } else {
                movieThis("Mr.Nobody");
            }
        break;
    case ('do-what-it-says'):
        doTheThing();
        break;
    default:
        console.log('Error: Try again');
};

