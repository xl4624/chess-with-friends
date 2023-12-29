document.getElementById("createGameButton").addEventListener("click", function() {
    fetch("games/create", {
        method: "POST",
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if (data.redirect) {
            window.location.href = data.redirect;
        }
    })
    .catch(error => {
        console.error(error);
    })
});


