from flask import (
    Blueprint,
    redirect,
    render_template,
    session,
    url_for,
)
from flask_socketio import emit, join_room

from extensions import db, socketio
from models import Game
from utils.decorators import *

games = Blueprint("games", __name__)


@games.route("/create/", methods=["POST"])
def create():
    new_game = Game()
    db.session.add(new_game)
    db.session.commit()
    return redirect(url_for("games.view", game_id=new_game.id))


@games.route("/<uuid:game_id>/")
@game_exists
@game_not_full
@login_required
def view(game_id, *, game, user):
    """
    Handle the view logic for a game based on how many players are currently in the game.

    :param game_id: UUID of the game passed in from the route
    :param game: Game object provided by the @game_exists decorator.
                 Represents the game corresponding to game_id.
    :param user: User object provided by the @login_required decorator.
                 Represents the currently logged-in user.
    """
    if game.contains_player(user.id):
        if game.is_full():
            return render_template("game_view.html")
        else:
            return render_template("waiting_room.html", username=user.username)

    game.add_player(user.id)

    if game.is_full():
        game.randomize_players()
        db.session.commit()

        socketio.emit("start", to=str(game_id))
        return render_template("game_view.html")
    else:
        db.session.commit()
        return render_template("waiting_room.html", username=user.username)


@games.route("/")
def list():
    """
    For development purposes only.
    """
    games = Game.query.all()
    output = "<html><body>"
    for game in games:
        game_link = url_for("games.view", game_id=game.id, _external=True)
        output += f"<input type='text' value='{game_link}' id='game_{game.id}'>"
        output += f"<button onclick=\"copyToClipboard('game_{game.id}')\">Copy</button><br>"
    output += """
        <script>
        function copyToClipboard(elementId) {
            var copyText = document.getElementById(elementId);
            copyText.select();
            document.execCommand('copy');
        }
        </script>
        </body></html>"""

    return output


@socketio.on("join")
@socket_room_required
@socket_game_exists
def join(data, *, room, game):
    """
    Handle join events sent from the client and broadcast them to all users in the room.

    :param data: Dictionary containing the room to send the message to.
    :param room: UUID of the room provided by the @socket_room_required decorator.
    """
    join_room(room)

    user_id = session.get("user_id")
    invert = (user_id == game.black_player_id)  # Only invert for black player

    emit("joined", {"pgn": game.pgn(), "invert": invert})


@socketio.on("move made")
@socket_login_required
@socket_room_required
@socket_game_exists
def move_made(data, *, user, room, game):
    """
    Handle move made events sent from the client and broadcast them to all users in the room.

    :param data: Dictionary containing the move to be made and the room to send the message to.
    :param user: User object provided by the @socket_login_required decorator.
    :param room: UUID of the room provided by the @socket_room_required decorator.
    :param game: Game object provided by the @socket_game_exists decorator.
    """
    move = data.get("move")
    if not move:
        emit("message", {"message": "Invalid data"})
        return

    if not game.contains_player(user.id):
        emit("error", {"message": "You are not in this game"})
        return

    if not game.is_turn(user.id):
        emit("error", {"message": "Not your turn"})
        return

    # if it is current player's turn, check to see if they are in checkmate

    # CURRENTLY NOT WORKING NOT SURE WHY

    # if game.in_checkmate():
    #     if user_id == game.black_player_id:
    #         emit("victory", {"white": True})
    #     else:
    #         emit("victory", {"white": False})

    game.make_move(move)
    db.session.commit()

    emit("move made", {"move": move}, to=room)


@socketio.on("chat")
@socket_login_required
@socket_room_required
@socket_game_exists
def chat(data, *, user, room, game):
    """
    Handle chat messages sent from the client and broadcast them to all users in the room.

    :param data: Dictionary containing the message and room to send the message to.
    :param user: User object provided by the @socket_login_required decorator.
    :param room: UUID of the room provided by the @socket_room_required decorator.
    :param game: Game object provided by the @socket_game_exists decorator.
    """
    message = data.get("message")
    if game.contains_player(user.id):
        emit("chat", {"username": user.username, "message": message}, to=room)


@socketio.on("draw")
@socket_login_required
@socket_room_required
@socket_game_exists
def draw(data, *, user, room, game):
    """
    Handle draw requests sent from the client and broadcast them to all users in the room.

    :param data: Dictionary containing the room to send the message to.
    :param user: User object provided by the @socket_login_required decorator.
    :param room: UUID of the room provided by the @socket_room_required decorator.
    :param game: Game object provided by the @socket_game_exists decorator.
    """
    if not game.contains_player(user.id):
        emit("error", {"message": "You are not in this game"})
        return

    emit("draw", to=room)


@socketio.on("resign")
@socket_login_required
@socket_room_required
@socket_game_exists
def resign(data, *, user, room, game):
    """
    Handle resign requests sent from the client and broadcast them to all users in the room.

    :param data: Dictionary containing the room to send the message to.
    :param user: User object provided by the @socket_login_required decorator.
    :param room: UUID of the room provided by the @socket_room_required decorator.
    :param game: Game object provided by the @socket_game_exists decorator.
    """
    if not game.contains_player(user.id):
        emit("error", {"message": "You are not in this game"})
        return

    winner = "white" if user.id == game.black_player_id else "black"
    emit("victory", {"winner": winner}, to=room)
