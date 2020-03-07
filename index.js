var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var stMessages = [];

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    socket.on('firstconn', function(username) {
        io.emit('firstconn', stMessages, username);
    });
    socket.on('chat message', function(msg) {
        stMessages.push(msg);
        if (stMessages.length >= 200) {
            stMessages.shift();
        }
        io.emit('chat message', msg);
    });
});

http.listen(process.env.PORT || 3000, function() {
    console.log('listening on *:' + process.env.PORT);
});