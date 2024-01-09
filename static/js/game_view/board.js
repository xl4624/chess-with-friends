import { Chess } from 'chess.js';

import { socket } from '../base.js';
import { gameId } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
    socket.on('joined', function(data) {
        game.loadPgn(data.pgn);
        if (data.invert) {
            board.orientation('black');
        }
        board.position(game.fen());
    });

    socket.on('move made', function(data) {
        game.move(data.move);
        board.position(game.fen());
    });

    var game = new Chess();
    var board = null;

    function onDragStart(source, piece, position, orientation) {
        // do not pick up pieces if the game is over
        if (game.isGameOver()) return false;

        if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
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
            socket.emit('move made', {
                move: move.san,
                room: gameId,
            });
            game.undo();
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
