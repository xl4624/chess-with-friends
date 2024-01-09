// If you need to access the socket object, import it from the base.js file, since this
// file will always be loaded for every page.
export const socket = io();

export function showMessage(type, message) {
    const element = document.getElementById(type);
    element.textContent = message;
    element.style.opacity = '1'
    setTimeout(function() {
        element.style.opacity = '0';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {

    socket.on('info', function(data) {
        if (data.message) {
            showMessage('info', data.message);
        }
    });

    socket.on('warning', function(data) {
        if (data.message) {
            showMessage('warning', data.message);
        }
    });

    socket.on('error', function(data) {
        if (data.message) {
            showMessage('error', data.message);
        }
    });
});
