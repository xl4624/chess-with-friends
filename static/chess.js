import { Chess } from 'chess.js';

var socket = io.connect('http://' + document.domain + ':' + location.port);
socket.on('connect', function() {
    socket.emit('join', {'room': window.location.pathname.split('/')[2] });
});

var board = Chessboard('board', 'start')
const game = new Chess()

