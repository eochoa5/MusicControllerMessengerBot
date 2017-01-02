var express = require('express')
var app = express()
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var request = require('request');

users = [];
connections = [];
server.listen(process.env.PORT || 3000);
console.log('server running');

const APP_TOKEN = 'EAAZA80VIZAZAZB0BAHPCZBvepZBLJZBZAXkCypZBHoDJdYIL3NTxRzN2kXTZACAF8owD36iySZCvSpDZAyb5ZC2fZCrFCuWj6XF0XKRb23jzImOVyQpZABHjUpnxHv2RXlyMBBOEtxnZC9SebY9pN9SVsocjgANMOIJHYg7zLkRMsxDzYq7vAQZDZD';
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use(express.static(__dirname));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');

});

app.get('/webhook', function(req, res){
	if(req.query['hub.verify_token']==='edwin'){
		res.send(req.query['hub.challenge']);

	}
	else{
		res.send('forbidden access');
	}

});

app.post('/webhook',function(req, res){
	var data = req.body;
	
	
	if(data.object == 'page'){
		data.entry.forEach(function(pageEntry){
			pageEntry.messaging.forEach(function(messagingEvent){
				if(messagingEvent.message){	
					var senderID= messagingEvent.sender.id;
					var messageText = messagingEvent.message.text;
					

					//
					if(senderID != 1839949259554162){
						
						getMusicFromPHP(messageText);
						//io.sockets.emit('new message', {msg:messageText});

					}
					
					//	
					var messageData ={
						recipient: {id: senderID},
						message: {text: 'Playing: ' + messageText}

					}

					request({
						uri: 'https://graph.facebook.com/v2.6/me/messages',
						qs: {access_token: APP_TOKEN},
						method: 'POST',
						json: messageData
						},function(error, response, data){
						if(error)
						console.log('error')
						else
							console.log('Message sent')
						})

					
								
					

				}
			})
		})
	}
	
	res.sendStatus(200);
});

function getMusicFromPHP(input){
	request.post(
    'https://edwin-bot.herokuapp.com/index.php',
    { json: { key: input } },
    function (error, response, body) {
        if (!error) {
            io.sockets.emit('new message', {msg:body});
        }
    }
	);
	
}

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected %s sockets connected', connections.length);

	//disconnect
	
	socket.on('disconnect', function(data){
		console.log(socket.username, " disconnected");
		if(socket.username){
		users.splice(users.indexOf(socket.username), 1);
		}
		connections.splice(connections.indexOf(socket), 1);
		

	});

	
	//new user

	socket.on('new user', function(data, callback){
		if(users.indexOf(data) != -1){
			callback(false);
			return;
		}
		
		callback(true);
		socket.username = "Edwin";
		users.push(socket.username);
		


	});
			
});









