import { socket } from '../base.js';
export const gameId = window.location.pathname.split('/')[2];

socket.on('connect', function() {
    socket.emit('join', {
        room: gameId,
    });
});

// Only for debugging
socket.on('message', function(data) {
    console.log(data.message);
});

