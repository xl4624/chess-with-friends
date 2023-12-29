from extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(36), nullable=False, unique=False)

    def __init__(self, username):
        self.username = username

    def __repr__(self):
        return f"<User {self.id}> {self.username}"
