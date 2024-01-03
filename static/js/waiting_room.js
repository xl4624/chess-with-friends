var socket;
const gameId = window.location.pathname.split('/')[2];
document.addEventListener('DOMContentLoaded', () => {
    socket = io.connect(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port);

    socket.on('connect', function() {
        socket.emit('join', {
            room: gameId,
        });
    });

    socket.on('start', function() {
        // Refresh the page to trigger the active game view.
        window.location.reload();
    });
});

