from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO


# Extensions are instantiated outside the app file to avoid circular imports
# Search for all instances of "from extensions import" to see examples of this.
db = SQLAlchemy()
socketio = SocketIO()
