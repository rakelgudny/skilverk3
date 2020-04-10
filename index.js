var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var fjoldi_notenda = 0;


app.get('/', function(req, res){
	res.sendFile(__dirname+'/index.html');
});

//app.get('/12345', function(req, res){
//	res.sendFile(__dirname+'/index.html');
//});


io.on('connection', function(socket){
	console.log('a user connected');
	// hækkum fjöldi_notenda úr því nýr maður er kominn inn
	fjoldi_notenda++;
	console.log(fjoldi_notenda);
	// látum clientinn vita að fjoldi_notenda hafi breyst, client þarf þá að hlusta 
	// eftir 'count' atburði og gera eitthvað við breytuna sem við sendum honum, sem sagt
	// láta hana sjást einhversstaðar
	io.emit('count', fjoldi_notenda);
	
	socket.on('join', function(nick){
		socket.userName = nick;
	});

	
	socket.on('disconnect', function(){
		console.log('user disconnected');
		// lækkum fjöldi_notenda úr því einn maður er farinn út
		fjoldi_notenda--;
		// látum clientinn vita að fjoldi_notenda hafi breyst, client þarf þá að hlusta 
		// eftir 'count' atburði og gera eitthvað við breytuna sem við sendum honum, 
		// sem sagt láta hana sjást einhversstaðar
		io.emit('count', fjoldi_notenda);
		console.log(fjoldi_notenda);
	});
	socket.on('chat message', function(msg){
		io.emit('chat message', msg, socket.userName);
	});
});

http.listen(3000, function(){
	console.log('Server is listening on port *:3000');
});

