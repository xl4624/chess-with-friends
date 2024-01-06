from flask import (
    Blueprint,
    jsonify,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from flask_socketio import emit, join_room

from extensions import db, socketio
from models import Game, User
from utils.decorators import (
    game_exists,
    game_not_full,
    login_required,
    socket_login_required,
)

games = Blueprint("games", __name__)


@games.route("/create/", methods=["POST"])
def create():
    new_game = Game()
    db.session.add(new_game)

    db.session.commit()
    return jsonify({"redirect": url_for("games.view", game_id=new_game.id)})


@games.route("/<uuid:game_id>/")
@game_exists
@game_not_full
@login_required
def view(game_id, game, user):
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
def join(data):
    room = data.get("room")
    if not room:
        emit("message", {"message": "No room specified"})
        return

    game = db.session.get(Game, room)
    if not game:
        emit("message", {"message": "Game not found"})
        return

    join_room(room)

    user_id = session.get("user_id")
    
    if user_id == game.black_player_id:
        emit("join", {"pgn": game.pgn(), "invert": True})
    else:
        emit("join", {"pgn": game.pgn()})


@socketio.on("move_made")
@socket_login_required
def move_made(data, user):
    room = data.get("room")
    move = data.get("move")
    if not room or not move:
        emit("message", {"message": "Invalid data"})
        return

    game = db.session.get(Game, room)
    if not game:
        emit("message", {"message": "Game not found"})
        return
    
    if not game.contains_player(user.id):
        emit("message", {"message": "You are not in this game"})
        return

    if not game.is_turn(user.id):
        emit("message", {"message": "Not your turn"})
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

    emit("move_made", {"move": move}, to=room)


@socketio.on("chat")
@socket_login_required
def chat(data, user):
    """
    Handle chat messages sent from the client and broadcast them to all users in the room.

    :param data: Dictionary containing the message and room to send the message to.
    :param user: User object provided by the @socket_login_required decorator.
                 Represents the currently logged-in user.
    """
    room = data.get("room")
    if not room:
        emit("message", {"message": "No room specified"})
        return

    game = db.session.get(Game,room)
    if not game:
        emit("message", {"message": "Game not found"})
        return

    message = data.get("message")
    if game.contains_player(user.id):
        emit("chat", {"username": user.username, "message": message}, to=room)

@socketio.on("draw")
@socket_login_required
def draw(data):
    """
    Handle draw requests sent from the client and broadcast them to all users in the room.

    :param data: Dictionary containing the room to send the message to.
    """
    room = data.get("room")
    if not room:
        emit("message", {"message": "No room specified"})
        return

    game = db.session.get(Game,room)
    if not game:
        emit("message", {"message": "Game not found"})
        return

    emit("draw", to=room)
    

@socketio.on("resign")
@socket_login_required
def resign(data, user):
    """
    Handle resign requests sent from the client and broadcast them to all users in the room.

    :param data: Dictionary containing the room to send the message to.
    :param user: User object provided by the @socket_login_required decorator.
                 Represents the currently logged-in user.
    """
    room = data.get("room")
    if not room:
        emit("message", {"message": "No room specified"})
        return

    game = db.session.get(Game,room)
    if not game:
        emit("message", {"message": "Game not found"})
        return
    
    # after all checks, check to see which side resigns

    

    if user.id == game.black_player_id:
        emit("victory", {"winner": "white"}, to=room)

    else:
        emit("victory", {"winner": "black"}, to=room)
    
