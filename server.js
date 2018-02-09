//Express.js

var express = require('express');
var app = express();

//HTTP
var http = require('http').createServer(app);


// create server that live/ listen all the time
// add port server to access our server 
var server = app.listen(8080);

//require the package, tell node that we using 'twit'
//twit is the class and tell Twitter API 
var Twit = require('twit');


//socket.io
//let the package be part of our server, keep eye open in the server until we stop
//call every new tweet 
var io = require('socket.io').listen(server);





var TwitterAPI = new Twit({
	consumer_key: 'YgWW1e42akqpQ4UJ78Fe5FPL4',		//in twitter
	consumer_secret: '85jq8ENG39JB4itJ68mhmP6Nk0uZzCLTbv1gDxPaVnrF5BE7Gc',
	access_token: '913814735698763777-IbhqvTS551BLjDI29VeJnvpVtz8gzTd',
	access_token_secret: 'K7oXio2zMxYNTrWixVSfsvOu8Pxjb9UwSUliDxxBLvJqV',
	timeout_ms: 60 * 1000					
});


//js function
console.log('Yay our server is running!');

//package ejs
/*serve HTML, this is template engine of file, but every request we will have new contain
EJS - essence template do deal with HTML, give HTML to client
*/

var ejs = require('ejs');

//setup view folder like pwd + /views
app.set('views', __dirname + '/views');

//use this folder that client can look for the file and static folder means access unchanged
app.use(express.static(__dirname + '/public'));

//EJS setup
app.engine('.html', ejs.__express);	// take html template engine file that we gonna search
app.set('view-engine', 'html');


//write the command and filter it out
//we want to get tweet and the contain of statuses and filter, by not taking old tweet
//track what we want: apple
var tweetStream = TwitterAPI.stream('statuses/filter', {track: 'Creative'});

//make it happen
//tweet is the object 
tweetStream.on('tweet', function(tweet){
	// everyone is online will get this
	//trigger note
	//socket.io allow to send the data to client 
	//tweet.text to print it to console 
	// you can send many data and separate by comma 
	io.sockets.emit('note', tweet.text, tweet.user.screen_name, tweet.user.followers_count);

	//print out what people writing 
	console.log(tweet.text + '\n');
});


//bouncer server means accept request
//get request, from the root folder of the server like wikipedia.com 
// what node understand, take the root folder, then generate the function
//request: burn of data of client, what kind of browser,
//respond: return data to client  
// render: generate file and send it back to client
app.get('/', function(req, res){
	res.render('index.html');		// return html file
});