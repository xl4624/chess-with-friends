from flask import (
    Blueprint,
    jsonify,
    url_for,
    redirect,
    session,
    request,
    render_template,
)
from flask_socketio import emit, join_room

from extensions import db, socketio
from models import Game, User

games = Blueprint("games", __name__)


@games.route("/create/", methods=["POST"])
def create():
    new_game = Game()
    db.session.add(new_game)

    db.session.commit()
    return jsonify({"redirect": url_for("games.view", game_id=new_game.id)})


@games.route("/<uuid:game_id>/")
def view(game_id):
    """
    If the game linked doesn't exist, 404.
    If the game has two players, just spectate the game.
    If the game exists and has less than two players, the user joins the game. 
    """
    game = db.session.get(Game, str(game_id))
    if not game:
        return "Game not found", 404
    
    if game.is_full():
        return render_template("game_view.html")

    user_id = session.get("user_id")
    if not user_id:
        return redirect(url_for("users.create", prev=request.url))

    user = db.session.get(User, user_id)
    if not user:
        return redirect(url_for("users.create", prev=request.url))

    if game.contains_player(user_id):
        if game.is_full():
            return render_template("game_view.html")
        else:
            return render_template("waiting_room.html", username=user.username)

    game.add_player(user_id)

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
        emit("join", {"pgn": game.pgn(), "invert": True}, to=room)
    else:
        emit("join", {"pgn": game.pgn()}, to=room)


@socketio.on("move_made")
def move_made(data):
    user_id = session.get("user_id")
    if not user_id:
        emit("message", {"message": "Not logged in"})
        return

    room = data.get("room")
    move = data.get("move")
    if not room or not move:
        emit("message", {"message": "Invalid data"})
        return

    game = db.session.get(Game, room)
    if not game:
        emit("message", {"message": "Game not found"})
        return
    
    if not game.contains_player(user_id):
        emit("message", {"message": "You are not in this game"})
        return

    if not game.is_turn(user_id):
        emit("message", {"message": "Not your turn"})
        return

    game.make_move(move)
    db.session.commit()

    emit("move_made", {"move": move}, to=room)


@socketio.on("chat")
def chat(data):
    user_id = session.get("user_id")
    if not user_id:
        emit("message", {"message": "Not logged in"})
        return

    user = db.session.get(User, user_id)
    if not user:
        emit("message", {"message": "User not found"})
        return

    room = data.get("room")
    if not room:
        emit("message", {"message": "No room specified"})
        return

    game = db.session.get(Game,room)
    if not game:
        emit("message", {"message": "Game not found"})
        return

    message = data.get("message")
    if game.contains_player(user_id):
        emit("chat", {"username": user.username, "message": message}, to=room)

