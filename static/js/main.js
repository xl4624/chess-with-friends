import { Chess } from 'chess.js';

var socket;
const gameId = window.location.pathname.split('/')[2];

document.addEventListener('DOMContentLoaded', () => {
    socket = io.connect(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port);


    socket.on('connect', function() {
        socket.emit('join', {
            room: gameId,
        });
    });

    // socket.on('join', function(data) {
    //     console.log("join", data.pgn);
    //     game.loadPgn('1. e4 e5');   // TODO: Make game.moves store the moves in pgn format, so you can just load the pgn by passing in game.moves
    //     board.position(game.fen());
    // })

    socket.on('message', function(data) {
        console.log(data.message);
    })

    socket.on('move_made', function(data) {
        game.move(data.move);
        board.position(game.fen());
    })

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
            socket.emit('move_made', { 
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
