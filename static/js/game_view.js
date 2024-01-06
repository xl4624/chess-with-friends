import { Chess } from 'chess.js';

var socket;
const gameId = window.location.pathname.split('/')[2];

document.addEventListener('DOMContentLoaded', () => {
    socket = io()


    socket.on('connect', function() {
        socket.emit('join', {
            room: gameId,
        });
    });

    socket.on('join', function(data) {
        game.loadPgn(data.pgn);
        if (data.invert) {
            board.orientation('black');
        }
        board.position(game.fen());
    })

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
        console.log('victory ' + data.name)
        const modal = document.querySelector('.modal')
        console.log(modal)
        openEnding(modal, data.name);

    })

    function openEnding(modal, winner){
        if (modal == null){
            return
        }
        console.log('opening')
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
            game.undo();
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
