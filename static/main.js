import { Chess } from 'chess.js';

document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect('http://${document.domain}:${location.port}');
    socket.on('connect', function() {
        socket.emit('join', { 'room': window.location.pathname.split('/')[2] });
    });

    var game = new Chess();
    var board = null;

    function onDragStart(source, piece, position, orientation) {
        if (game.isGameOver() === true ||
            (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    }

    function onDrop(source, target) {
        try {
            var move = game.move({
                from: source,
                to: target,
                promotion: 'q'  // Default to queen promotion for simplicity
            });
        } catch (err) {
            return 'snapback';
        }
    }

    function onSnapEnd() {
        board.position(game.fen());
    }

    var config = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };

    board = Chessboard('board', config);
});
