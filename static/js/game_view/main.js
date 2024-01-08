export const socket = io();

socket.on('connect', function() {
    socket.emit('join', {
        room: gameId,
    });
});

// Only for debugging
socket.on('message', function(data) {
    console.log(data.message);
});

export const gameId = window.location.pathname.split('/')[2];

