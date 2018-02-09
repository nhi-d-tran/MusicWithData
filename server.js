//Express.js

var express = require('express');
var app = express();

var http = require('http').createServer(app);

// create server that live/ listen all the time
// add port server to access our server 
var server = app.listen(8080);
var Twit = require('twit');

var io = require('socket.io').listen(server);

var TwitterAPI = new Twit({
	consumer_key: 'YgWW1e42akqpQ4UJ78Fe5FPL4',		//in twitter
	consumer_secret: '85jq8ENG39JB4itJ68mhmP6Nk0uZzCLTbv1gDxPaVnrF5BE7Gc',
	access_token: '913814735698763777-IbhqvTS551BLjDI29VeJnvpVtz8gzTd',
	access_token_secret: 'K7oXio2zMxYNTrWixVSfsvOu8Pxjb9UwSUliDxxBLvJqV',
	timeout_ms: 60 * 1000					
});


var ejs = require('ejs');

//setup view folder like pwd + /views
app.set('views', __dirname + '/views');

//use this folder that client can look for the file and static folder means access unchanged
app.use(express.static(__dirname + '/public'));

//EJS setup
app.engine('.html', ejs.__express);	// take html template engine file that we gonna search
app.set('view-engine', 'html');

var tweetStream = TwitterAPI.stream('statuses/filter', {track: 'Creative'});

tweetStream.on('tweet', function(tweet){
	io.sockets.emit('note', tweet.text, tweet.user.screen_name, tweet.user.followers_count);
	//print out what people writing 
	console.log(tweet.text + '\n');
});

app.get('/', function(req, res){
	res.render('index.html');		// return html file
});
