from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_uuid import FlaskUUID
from flask_migrate import Migrate
from flask_socketio import SocketIO
# import os
# from dotenv import load_dotenv
import secrets

from extensions import db
from models import Game, User
from config import Config

# load_dotenv()

app = Flask(__name__)

app.secret_key = secrets.token_urlsafe(16)

# if os.getenv("FLASK_ENV") == "DEVELOPMENT":
# elif os.getenv("FLASK_ENV") == "PRODUCTION":
# elif os.getenv("FLASK_ENV") == "TESTING":
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)

FlaskUUID(app)
socketio = SocketIO(app)


###################
### Game Routes ###
###################

@app.route("/games/create/", methods=["POST"])
def game_create():
    new_game = Game()
    db.session.add(new_game)
    db.session.commit()
    return jsonify({"redirect": url_for("game_view", game_id=new_game.id, _external=True)})

@app.route("/games/<uuid:game_id>/join/", methods=["POST"])
def game_join(game_id):
    return "Joining game " + str(game_id)

@app.route("/games/<uuid:game_id>/")
def game_view(game_id):
    """
    If the game exists, is active, and has less than two players,
    the user joins the game. 
    If it doesn't exist or isn't active, 404.
    If it has two players, just spectate the game.
    """
    game = db.session.get(Game, str(game_id))
    if not game:
        return "Game not found", 404
    if not session.get("user_id"):
        return redirect(url_for("user_create", _external=True, prev=request.url))

    if game.player_count < 2:
        game.player_count += 1
        db.session.commit()
        if game.player_count == 2:
            return "Joining game..."
        else:
            return "Waiting for another player..."

    return "Spectating game " + str(game_id)

@app.route("/games/")
def games_list():
    """
    For development purposes only.
    """
    games = Game.query.all()
    output = "<html><body>"
    for game in games:
        game_link = url_for("game_view", game_id=game.id, _external=True)
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


###################
### User Routes ###
###################

@app.route("/users/create/", methods=["GET", "POST"])
def user_create():
    if "url" not in session:
        session["url"] = request.args.get("prev") or url_for("index", _external=True)

    if request.method == "POST":
        username = request.form.get("username")
        if not username:
            return "Username required", 400
        
        new_user = User(username=username)
        db.session.add(new_user)
        db.session.commit()
        session["user_id"] = new_user.id

        return redirect(session.pop("url", url_for("index", _external=True)))

    return render_template("user_create.html")

@app.route("/users/")
def users_list():
    users = User.query.all()
    output = "<html><body>"
    for user in users:
        output += f'<p>{user.username}</p>'
    output += "</body></html>"

    return output


@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    socketio.run(app, use_reloader=True, log_output=True, host="localhost", port=3000)
