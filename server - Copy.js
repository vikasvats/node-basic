var io = require('socket.io').listen(1337);

var connections = [];
var useridCounter = 0;

io.sockets.on('connection', function (socket) {
	var username = 'anon';
	var userid = useridCounter++;

	connections.push(socket);

	socket.on('frame', function (data) {
		console.log('frame received');
		for (var i=0; i < connections.length; i++) {
			connections[i].emit('frame', {username: username, userid: userid, frame: data});
		}
	});

    socket.on('text', function (data) {
        console.log('text received');
        //console.log(data.substr(0,20));
        for (var i=0; i < connections.length; i++) {
            connections[i].emit('text', {username: username, userid: userid, text: data});
        }
    });

	socket.on('setusername', function (data) {
		console.log('username received');
		//console.log(data.substr(0,20));
		username = data;
		for (var i=0; i < connections.length; i++) {
			connections[i].emit('text', {username: username, userid: userid, text: "[entered the room]"});
		}
	});

	socket.on('disconnect', function () {
		for (var i=0; i < connections.length; i++) {
			connections[i].emit('text',{username: username, userid: userid, text: "[left the room]"});
			connections[i].emit('disconnect', {username: username, userid: userid});
		}
	});
});



