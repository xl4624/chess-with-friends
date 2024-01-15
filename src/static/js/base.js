// If you need to access the socket object, import it from the base.js file, since this
// file will always be loaded for every page.
export const socket = io();

export function showMessage(type, message) {
    const element = document.getElementById(type);
    element.textContent = message;
    element.style.opacity = '1';

    setTimeout(() => {
        element.style.opacity = '0';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    ['info', 'warning', 'error'].forEach((type) => {
        socket.on(type, (data) => {
            if (data.message) {
                showMessage(type, data.message);
            }
        });
    });
});
