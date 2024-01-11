import { socket } from './base.js';


const gameId = window.location.pathname.split('/')[2];

document.addEventListener('DOMContentLoaded', () => {
    socket.on('connect', () => {
        socket.emit('join', { room: gameId });
    });

    socket.on('start', () => {
        // Refresh the page to trigger the active game view.
        window.location.reload();
    });
});

