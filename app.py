from flask import Flask, render_template
from flask_uuid import FlaskUUID
from flask_migrate import Migrate
import uuid

from extensions import db
from models import Game, User

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite3"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
migrate = Migrate(app, db)
FlaskUUID(app)


###################
### Game Routes ###
###################

@app.route("/games/create", methods=["GET", "POST"])
def game_create():
    game_id = str(uuid.uuid4())
    new_game = Game(id=game_id)
    db.session.add(new_game)
    db.session.commit()
    return "Creating a game"

@app.route("/games/<uuid:game_id>")
def game_view(game_id):
    """
    If the game exists, is active, and has less than two players,
    the user joins the game. 
    If it doesn't exist or isn't active, 404.
    If it has two players, just spectate the game.
    """
    game = Game.query.filter_by(id=game_id).first()
    if not game:
        return "Game not found", 404
    return "Viewing game " + str(game_id)
    

@app.route("/games")
def games_list():
    """
    For development purposes only.
    """
    games = Game.query.all()
    return "Number of games: " + str(len(games))


@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
