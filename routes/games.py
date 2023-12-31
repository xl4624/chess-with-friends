from flask import Blueprint, jsonify, url_for, redirect, session, request, render_template
from flask_socketio import send, emit, join_room

from extensions import db, socketio
from models import Game

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
    If the game exists, is active, and has less than two players,
    the user joins the game. 
    If it doesn't exist or isn't active, 404.
    If it has two players, just spectate the game.
    """
    game = db.session.get(Game, str(game_id))
    if not game:
        return "Game not found", 404
    
    if game.is_full():
        return render_template("game_view.html")

    if not session.get("user_id"):
        return redirect(url_for("users.create", prev=request.url))

    user_id = session.get("user_id")

    if game.contains_player(user_id):
        return render_template("waiting.html")

    game.add_player(user_id)

    if game.is_full():
        game.randomize_players()
        socketio.emit("start", to=str(game_id))
    else:
        return render_template("waiting.html")

    return render_template("game_view.html")

@games.route("/")
def list():
    """
    For development purposes only.
    """
    games = Game.query.all()
    output = "<html><body>"
    for game in games:
        game_link = url_for("games.view", game_id=game.id, _external=True)
        output += f'<input type="text" value="{game_link}" id="game_{game.id}">'
        output += f'<button onclick="copyToClipboard(\'game_{game.id}\')">Copy</button><br>'
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
    if not session.get("user_id"):
        send("Not logged in")
        return
    if not data.get("room"):
        send("No room specified")
        return

    room = data["room"]
    print(f"User {session['user_id']} has joined room {data['room']}")
    join_room(room)
    send(f"User {session['user_id']} has joined room {data['room']}", to=room)

@socketio.on("move")
def move(data):
    if not session.get("user_id"):
        send("Not logged in")
        return
