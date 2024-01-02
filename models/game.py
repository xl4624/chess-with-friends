from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.mutable import MutableList
import uuid
import random

from extensions import db


class Game(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    white_player_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    black_player_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    player_count = db.Column(db.Integer, default=0)
    moves = db.Column(MutableList.as_mutable(ARRAY(db.String(7))), default=[])

    def __repr__(self):
        return f"<Game {self.id}>"

    def pgn(self) -> str:
        pgn = []
        move_number = 1

        for i, move in enumerate(self.moves):
            if i % 2 == 0:
                pgn.append(f"{move_number}.")
                move_number += 1

            pgn.append(move)

        return " ".join(pgn)

    def to_dict(self):
        return {
            "id": self.id,
            "white_player_id": self.white_player_id,
            "black_player_id": self.black_player_id,
            "player_count": self.player_count,
            "moves": self.moves,
        }

    def is_full(self):
        return self.player_count == 2

    def is_turn(self, user_id):
        if len(self.moves) % 2 == 0 and user_id != self.white_player_id:
            return False
        if len(self.moves) % 2 == 1 and user_id != self.black_player_id:
            return False

        return True

    def contains_player(self, user_id):
        return user_id is not None and (
            user_id == self.white_player_id or user_id == self.black_player_id
        )

    def add_player(self, user_id):
        if self.is_full(): return

        if self.player_count == 0:
            self.white_player_id = user_id
        else:
            self.black_player_id = user_id
        self.player_count += 1

    def randomize_players(self):
        players = [self.white_player_id, self.black_player_id]
        random.shuffle(players)
        self.white_player_id, self.black_player_id = players
    
    def make_move(self, move):
        self.moves.append(move)

