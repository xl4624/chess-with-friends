import { Chess } from 'chess.js';

import { socket } from '../base.js';
import { gameId } from './main.js';


const game = new Chess();
let board = null;
let gameEnded = false;

document.addEventListener('DOMContentLoaded', () => {
    socket.on('joined', (data) => {
        game.loadPgn(data.pgn);
        if (data.ended) {
            gameEnded = true;
        }
        if (data.invert) {
            board.orientation('black');
        }
        board.position(game.fen());
        populateMoveHistory();
    });

    socket.on('move made', (data) => {
        const moveMade = game.move(data.move);
        board.position(game.fen());
        addMoveToHistory(moveMade);
    });

    socket.on('victory', () => {
        gameEnded = true;
    });

    socket.on('draw', () => {
        gameEnded = true;
    });

    const config = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
    };

    board = new Chessboard('board', config);
});

function populateMoveHistory() {
    const moves = game.history();
    const movesHtml = [];

    for (let i = 0; i < moves.length; i += 2) {
        movesHtml.push(`<tr>
            <td>${Math.floor(i / 2) + 1}</td>
            <td>${moves[i]}</td>
            <td>${moves[i + 1] ? moves[i + 1] : ''}</td>
        </tr>`);
    }

    document.querySelector('.move-history-wrapper tbody').innerHTML = movesHtml.join('');
}

function addMoveToHistory(move) {
    const tbody = document.querySelector('.move-history-wrapper tbody');

    // This condition is inverted because the move is made before this function is called
    // so if the game's turn is white, then black just made a move that needs to be
    // added to the move history and vice versa.
    if (game.turn() === 'w') {
        // Find the last row and update it with Black's move
        tbody.lastElementChild.cells[2].textContent = move.san;
    } else {
        // Add a new row to the move history table and add White's move
        const moveNumber = Math.floor(game.history().length / 2) + 1;
        const row = `<tr>
            <td>${moveNumber}</td>
            <td>${move.san}</td>
            <td></td>
        </tr>`;
        tbody.innerHTML += row;
    }
}

function onDragStart(source, piece, position, orientation) {
    // Do not pick up pieces if the game is over
    if (game.isGameOver() || gameEnded) return false;

    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
}

function onDrop(source, target) {
    try {
        let promotion = null;
        if (isPawnPromotion(source, target)) {
            promotion = choosePromotion();
            if (!promotion) return 'snapback';
        }
        const move = game.move({
            from: source,
            to: target,
            promotion: promotion,
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

function isPawnPromotion(source, target) {
    const piece = game.get(source);
    const sourceRank = source[1];
    const targetRank = target[1];
    return piece.type === 'p' && (
        (piece.color === 'w' && sourceRank === '7' && targetRank === '8') ||
        (piece.color === 'b' && sourceRank === '2' && targetRank === '1')
    );
}

// For now, just ask the user in alert box
function choosePromotion() {
    const promotion = prompt('Choose a piece to promote to: Q, R, B, or N');
    if (!promotion) return null;
    if (promotion !== 'Q' && promotion !== 'R' && promotion !== 'B' && promotion !== 'N') {
        return null;
    }
    return promotion.toLowerCase();
}
