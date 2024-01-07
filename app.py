from flask import Flask, render_template
from flask_migrate import Migrate
from flask_uuid import FlaskUUID
# import os
# from dotenv import load_dotenv
import secrets

from extensions import db, socketio
from views import games, users
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
socketio.init_app(app)

FlaskUUID(app)

app.register_blueprint(games, url_prefix="/games")
app.register_blueprint(users, url_prefix="/users")


@app.route("/todo/")
def todo():
    return render_template("todo.html")


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    socketio.run(app, use_reloader=True, log_output=True, host="localhost", port=3000)

