from sqlalchemy.dialects.postgresql import ARRAY
import uuid

from extensions import db

class Game(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    white_player_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    black_player_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    white_player = db.relationship("User", foreign_keys=[white_player_id], uselist=False)
    black_player = db.relationship("User", foreign_keys=[black_player_id], uselist=False)
    player_count = db.Column(db.Integer, default=0)
    moves = db.Column(ARRAY(db.String(7)))

    def __repr__(self):
        return f"<Game {self.id}>"
    
