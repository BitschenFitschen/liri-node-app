var keys = require('./keys.js');
var twitterKeys = keys.twitterKeys;

var fs = require('fs');
var prompt = require('prompt');
var Twitter = require('twitter');
var Spotify = require('spotify');
var request = require('request');


var userInput = '';


var userSelection = '';

var myTweets = 'tweets';
var songs = 'spotify-this-song';
var movies = 'movie';


prompt.message = ("Type one of the following: tweets, spotify-this-song, or movie");
prompt.delimiter = ("\n");

prompt.start();


prompt.get({
	properties: {
		userInput: {
			description:'What do you choose?'
		}
	}
}, function(err, result){
	userInput = result.userInput;

	
	if(userInput == myTweets){
		myTwitter();
	} 

	else if(userInput == songs){
		prompt.get({
			properties: {
				userSelection: {
					description:'What song do you want to look up?'
				}
			}
		}, function(err, result){

			if(result.userSelection === ""){
				userSelection = "The Sign";
			} else{
				userSelection = result.userSelection;
			}
			mySpotify(userSelection);
		});
	} 
	else if(userInput == movies){
		prompt.get({
			properties: {
				userSelection: {
					description:'What movie do you want to look up?'
				}
			}
		}, function(err, result){
			if(result.userSelection === ""){
				userSelection = "Mr. Nobody";
			} else{
				userSelection = result.userSelection;
			}
			myMovies(userSelection);
		});
	}
});


function myTwitter(){
	
	var client = new Twitter({
		consumer_key: twitterKeys.consumer_key,
		consumer_secret: twitterKeys.consumer_secret,
		access_token_key: twitterKeys.access_token_key,
		access_token_secret: twitterKeys.access_token_secret,
	});
	
	var params = {
		screen_name: 'whatafitch',
		count: '20',
		trim_user: false,
	}

	client.get('statuses/user_timeline', params, function(error, timeline, response){
		if(!error){

			//this is pulled from another project, I got a little lost through the documentation
			for(tweet in timeline){	
				var tDate = new Date(timeline[tweet].created_at);
				console.log("Tweet #: " + (parseInt(tweet)+1) + " ");
				console.log(tDate.toString().slice(0, 24) + " ");
				console.log(timeline[tweet].text);
				console.log("\n");
			}
		} 
	})

}

function mySpotify(userSelection){  
	Spotify.search({ 
		type: 'track', 
		query: userSelection
	}, function(err, data) {
	    if (err) throw err;
	    
		var music = data.tracks.items;
		
		    for (var i = 0; i<music.length; i++){
		    	for (j=0; j<music[i].artists.length; j++){
		    	    console.log("Artist: " + music[i].artists[j].name);
		        	console.log("Song Name: " + music[i].name);
		        	console.log("Preview Link of the song from Spotify: " + music[i].preview_url);
		        	console.log("Album Name: " + music[i].album.name + "\n");
		    	}
		    }
	});
}


function myMovies(type){
	
	request('http://www.omdbapi.com/?t='+type+'&y=&plot=short&tomatoes=true&r=json', function (error, response, body) {
		if(error) throw error;
		
		json = JSON.parse(body);
		
		console.log('Title: ' + json.Title);
		console.log('Year: ' + json.Year);
		console.log('Rated: ' + json.Rated);
		console.log('Country: ' + json.Country);
		console.log('Language: ' + json.Language);
		console.log('Director: ' + json.Director);
		console.log('Actors: ' + json.Actors);
		console.log('Plot: ' + json.Plot);
		console.log('imdbRating: ' + json.imdbRating);
		console.log('Rotten Tomatoes Rating: ' + json.tomatoRating);
		console.log('Rotten Tomatoes URL: ' + json.tomatoURL);


	})
}