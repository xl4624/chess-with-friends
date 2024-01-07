import { Chess } from 'chess.js';

var socket;
const gameId = window.location.pathname.split('/')[2];

document.addEventListener('DOMContentLoaded', () => {
    socket = io()

    socket.on('connect', function() {
        socket.emit('join', {
            room: gameId,
        });

        // Load game state (should only be called once when connecting to a game)
        // But if socket connection breaks, client will still automatically rejoin and update board.
        socket.once('joined', function(data) {
            game.loadPgn(data.pgn);
            board.position(game.fen());
            if (data.invert) {
                board.orientation('black');
            }
        })
    });

    // Only here for debugging 
    socket.on('message', function(data) {
        console.log(data.message);
    })

    socket.on('move_made', function(data) {
        game.move(data.move);
        board.position(game.fen());
    })

    socket.on('chat', function(data) {
        let ul = document.getElementById('chatMessage');
        let li = document.createElement('li');
        li.appendChild(document.createTextNode(data.username + ': ' + data.message));
        ul.appendChild(li);
        ul.scrollTop = ul.scrollHeight;
    })

    // used for when a player wins
    // opening overlay to cover screen kinda

    const overlay = document.getElementById('overlay')
    overlay.addEventListener('click', () => {
        const modals = document.querySelectorAll('.modal.active')
        modals.forEach(modal => {
            closeEnding(modal)
        })
    })

    socket.on('victory', function(data){
        const modal = document.querySelector('.modal')
        openEnding(modal, data.winner);

    })

    function openEnding(modal, winner){
        if (modal == null){
            return
        }

        const modalContent = modal.querySelector('.modal-text')
        if (winner == 'white') {
            modalContent.textContent = 'White wins! Rematch?'
        } else if (winner == 'black') {
            modalContent.textContent = 'Black wins! Rematch?'
        }
        modal.classList.add('active')
        overlay.classList.add('active')
    }

    // closing ending popup

    const closeModals = document.querySelectorAll('[data-close-button]')
    closeModals.forEach(button => {
        button.addEventListener('click', () => {

            const modal = button.closest('.modal')
            closeEnding(modal)
        })
    })
    function closeEnding(modal){
        modal.classList.remove('active')
        overlay.classList.remove('active')
    }

    socket.on('draw', function(data){

    })

    document.getElementById("draw").addEventListener("click", function() {
        socket.emit('draw')
    });

    document.getElementById("resign").addEventListener("click", function() {
        socket.emit('resign', {room: gameId})
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
            socket.emit('move_made', {
                move: move.san,
                room: gameId,
            });
        } catch (err) {
            return 'snapback';
        }
    }

    function onSnapEnd() {
        board.position(game.fen());
    }

    document.getElementById('message').addEventListener('keyup', function(event) {
        if (event.key == 'Enter') {
            let message = document.getElementById('message').value;
            socket.emit('chat', {
                message: message,
                room: gameId,
            });
            document.getElementById('message').value = '';
        }
    })

    var config = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };

    board = Chessboard('board', config);
});
