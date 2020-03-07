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
        var today = new Date();
        var date = today.getFullYear() + '.' +
            ((today.getMonth() + 1) < 10 ? ('0' + (today.getMonth() + 1)) : (today.getMonth() + 1)) + '.' +
            (today.getDate() < 10 ? ('0' + today.getDate()) : today.getDate());
        var time = (today.getHours() < 10 ? ('0' + today.getHours()) : today.getHours()) + ":" +
            (today.getMinutes() < 10 ? ('0' + today.getMinutes()) : today.getMinutes()) + ":" +
            (today.getSeconds() < 10 ? ('0' + today.getSeconds()) : today.getSeconds());
        var dateTime = date + ' ' + time;

        stMessages.push(msg + '|' + dateTime);
        if (stMessages.length >= 200) {
            stMessages.shift();
        }
        io.emit('chat message', msg, dateTime);
    });
});

http.listen(process.env.PORT || 3000, function() {
    console.log('listening on *:' + process.env.PORT);
});