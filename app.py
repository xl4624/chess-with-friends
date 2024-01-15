from flask import Flask, render_template
from flask_migrate import Migrate
from flask_uuid import FlaskUUID
import os

from src.extensions import db, socketio
from src.views import games, users
from src.config import DevelopmentConfig, ProductionConfig, TestingConfig


app = Flask(__name__, template_folder="src/templates", static_folder="src/static")

match os.getenv("FLASK_ENV", "DEVELOPMENT"):
    case "DEVELOPMENT":
        app.config.from_object(DevelopmentConfig)
    case "PRODUCTION":
        app.config.from_object(ProductionConfig)
    case "TESTING":
        app.config.from_object(TestingConfig)

# Database and SocketIO initialization
db.init_app(app)
migrate = Migrate(app, db)
socketio.init_app(app)

# UUID support for game IDs (could remove this for strings instead of UUIDs)
FlaskUUID(app)

# Register blueprints
app.register_blueprint(games, url_prefix="/games")
app.register_blueprint(users, url_prefix="/users")


@app.route("/todo/")
def todo():
    return render_template("todo.html")


@app.route("/")
def index():
    return render_template("index.html")

