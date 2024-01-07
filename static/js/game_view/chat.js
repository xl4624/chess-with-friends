import socket from '../socket.js';


document.addEventListener('DOMContentLoaded', () => {
    socket.on('chat', function(data) {
        let ul = document.getElementById('chatMessage');
        let li = document.createElement('li');
        li.appendChild(document.createTextNode(data.username + ': ' + data.message));
        ul.appendChild(li);
        ul.scrollTop = ul.scrollHeight;
    });

    document.getElementById('message').addEventListener('keyup', function(event) {
        if (event.key == 'Enter') {
            let message = document.getElementById('message').value;
            socket.emit('chat', {
                message: message,
                room: gameId,
            });
            document.getElementById('message').value = '';
        }
    });
});
