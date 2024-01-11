import { socket } from '../base.js';
import { gameId } from './main.js';


document.addEventListener('DOMContentLoaded', () => {
    socket.on('chat', (data) => {
        const chatMessageList = document.getElementById('chatMessage');
        const chatMessage = document.createElement('li');
        chatMessage.textContent = `${data.username}: ${data.message}`;
        chatMessageList.appendChild(chatMessage);
        chatMessageList.scrollTop = chatMessageList.scrollHeight; // Scroll to bottom
    });

    const messageInput = document.getElementById('message');
    messageInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const message = messageInput.value.trim();
            if (message) {
                socket.emit('chat', {
                    message: messageInput.value,
                    room: gameId,
                });
                messageInput.value = '';
            }
        }
    });
});
