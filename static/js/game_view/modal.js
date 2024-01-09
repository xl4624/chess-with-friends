import { socket } from '../base.js';
import { gameId } from './main.js';


document.addEventListener('DOMContentLoaded', () => {
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
        } else {
            modalContent.textContent = 'Draw! Rematch?'
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

    function closeEnding(modal) {
        modal.classList.remove('active')
        overlay.classList.remove('active')
    }

    socket.on('draw', function() {
        const modal = document.querySelector('.modal')
        openEnding(modal, 'draw');
    })

    document.getElementById("draw").addEventListener("click", function() {
        socket.emit('draw', { room: gameId });
    });

    document.getElementById("resign").addEventListener("click", function() {
        socket.emit('resign', { room: gameId });
    });
});

