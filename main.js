var http = require('http'),
	fs = require('fs'),
	sanitize = require('validator').sanitize;
	
var app = http.createServer(function (request, response) {
	fs.readFile("client.html", 'utf-8', function (error, data) {
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(data);
		response.end();
	});
}).listen(80);

var io = require('socket.io').listen(app);

var people = {};

io.sockets.on('connection', function(socket) {
	
	socket.on("join", function(name){
		people[socket.id] = name;
		io.sockets.emit("update", name + " is verbonden met de server.")
		io.sockets.emit("update-people", people);
	});

	socket.on("send", function(msg){
		io.sockets.emit("chat", people[socket.id], msg);
	});

	socket.on("disconnect", function(){
		io.sockets.emit("update", people[socket.id] + " is heeft verbinding verbroken.");
		delete people[socket.id];
		io.sockets.emit("update-people", people);
	});
	
	
});
