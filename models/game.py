from sqlalchemy.dialects.postgresql import ARRAY
import uuid
import random

from extensions import db

class Game(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    white_player_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    black_player_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    player_count = db.Column(db.Integer, default=0)
    moves = db.Column(ARRAY(db.String(7)))

    def __repr__(self):
        return f"<Game {self.id}>"

    def to_dict(self):
        return {
            "id": self.id,
            "white_player_id": self.white_player_id,
            "black_player_id": self.black_player_id,
            "player_count": self.player_count,
            "moves": self.moves
        }

    def is_full(self):
        return self.player_count == 2

    def contains_player(self, user_id):
        return user_id == self.white_player_id or user_id == self.black_player_id

    def add_player(self, user_id):
        if self.is_full():
            return
        if self.player_count == 0:
            self.white_player_id = user_id
        else:
            self.black_player_id = user_id
        self.player_count += 1
        db.session.commit()

    def randomize_players(self):
        players = [self.white_player_id, self.black_player_id]
        random.shuffle(players)
        self.white_player_id, self.black_player_id = players
        db.session.commit()
    
