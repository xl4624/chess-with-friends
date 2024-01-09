from flask import Flask, render_template
from flask_migrate import Migrate
from flask_uuid import FlaskUUID
import secrets

from extensions import db, socketio
from views import games, users
from config import Config


app = Flask(__name__)

app.secret_key = secrets.token_urlsafe(16)

app.config.from_object(Config)

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


if __name__ == "__main__":
    socketio.run(app, debug=True, use_reloader=True, log_output=True, host="localhost", port=3000)


# TODO: Implement different configs for different environments
# load_dotenv()
# if os.getenv("FLASK_ENV") == "DEVELOPMENT":
#     app.config.from_object("DevelopmentConfig")
# elif os.getenv("FLASK_ENV") == "PRODUCTION":
#     app.config.from_object("ProductionConfig")
# elif os.getenv("FLASK_ENV") == "TESTING":
#     app.config.from_object("TestingConfig")
