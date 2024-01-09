import { Chess } from 'chess.js';

import { socket } from '../base.js';
import { gameId } from './main.js';


var game = new Chess();
var board = null;

document.addEventListener('DOMContentLoaded', () => {
    socket.on('joined', function(data) {
        game.loadPgn(data.pgn);
        if (data.invert) {
            board.orientation('black');
        }
        board.position(game.fen());
        populateMoves();
    });

    socket.on('move made', function(data) {
        var move = game.move(data.move);
        board.position(game.fen());
        updateMoveHistory(move);
    });

    function populateMoves() {
        const moves = game.history({ verbose: true });
        let movesHtml = '';

        for (let i = 0; i < moves.length; i += 2) {
            movesHtml += `<tr>
                <td>${Math.floor(i / 2) + 1}</td>
                <td>${moves[i].san}</td>
                <td>${moves[i + 1] ? moves[i + 1].san : ''}</td>
            </tr>`;
        }

        document.querySelector('.move-history-wrapper tbody').innerHTML = moveHistoryHtml;
    }

    function updateMoveHistory(move) {
        const tbody = document.querySelector('.move-history-wrapper tbody');
        const moveNumber = Math.floor(game.history().length / 2);

        
        // This condition is inverted because the move is made before this function is called
        // So if the game's turn is white, then black just made a move that needs to be 
        // added to the mvoe history and vice versa.
        if (game.turn() === 'w') {
            // Find the last row and update it with Black's move
            tbody.lastElementChild.cells[2].textContent = move.san;
        } else {
            // Add a new row to the move history table and add White's move
            const row = document.createElement('tr');
            row.innerHTML = `<td>${moveNumber}</td><td>${move.san}</td><td></td>`;
            tbody.appendChild(row);
        }
    }


    function onDragStart(source, piece, position, orientation) {
        // Do not pick up pieces if the game is over
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
        onSnapEnd: onSnapEnd,
    };

    board = Chessboard('board', config);
});
