var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var logger;

var timezone = 3;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    socket.on('firstconn', function(username) {
        var filedata = fs.readFileSync('log.txt', 'utf-8');
        var stMessages = filedata.split('\r\n');
        stMessages.pop();

        if (stMessages.length >= 500) {
            stMessages.splice(0, 200);

            fs.writeFile('log.txt', stMessages.join('\r\n') + '\r\n', function() { console.log('removelogdone') });
        }

        io.emit('firstconn', stMessages, username);
    });
    socket.on('chat message', function(msg) {
        var today = new Date();
        var date = today.getFullYear() + '.' +
            ((today.getMonth() + 1) < 10 ? ('0' + (today.getMonth() + 1)) : (today.getMonth() + 1)) + '.' +
            (today.getDate() < 10 ? ('0' + today.getDate()) : today.getDate());
        var time = ((today.getHours()+timezone) < 10 ? ('0' + (today.getHours()+timezone)) : (today.getHours()+timezone)) + ":" +
            (today.getMinutes() < 10 ? ('0' + today.getMinutes()) : today.getMinutes()) + ":" +
            (today.getSeconds() < 10 ? ('0' + today.getSeconds()) : today.getSeconds());
        var dateTime = date + ' ' + time;

        logger.write(msg + '|' + dateTime + '\r\n');

        io.emit('chat message', msg, dateTime);
    });
});

http.listen(process.env.PORT || 3000, function() {
    console.log('listening on *:' + process.env.PORT);

    logger = fs.createWriteStream('log.txt', {
        flags: 'a' // 'a' means appending (old data will be preserved)
    });
});
