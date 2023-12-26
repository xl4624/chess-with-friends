from extensions import db

players = db.Table(
        "players",
        db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
        db.Column("game_id", db.String(36), db.ForeignKey("game.id"), primary_key=True)
        )

class Game(db.Model):
    id = db.Column(db.String(36), primary_key=True) # UUID
    players = db.relationship("User", secondary=players, lazy="subquery",
            backref=db.backref("games", lazy=True))

    def __init__(self, id):
        self.id = id
