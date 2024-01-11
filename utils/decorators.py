from flask import session, redirect, url_for, render_template, request
from flask_socketio import emit
from functools import wraps
from inspect import signature

from extensions import db
from models import Game, User


########################
### Route Decorators ###
########################

"""
signature(function).parameters is an OrderedDict of the function's arguments, so we can check
if a function has a certain argument and then pass it to the function only if it does.
"""

def login_required(function):
    """
    Decorator to ensure that a user is logged in before accessing a route.
    """
    @wraps(function)
    def wrapper(*args, **kwargs):
        user_id = session.get("user_id")
        if not user_id:
            return redirect(url_for("users.create", prev=request.url))
        if 'user_id' in signature(function).parameters:
            kwargs["user_id"] = user_id
        user = db.session.get(User, user_id)
        if not user:
            return redirect(url_for("users.create", prev=request.url))
        if 'user' in signature(function).parameters:
            kwargs["user"] = user
        return function(*args, **kwargs)
    return wrapper


def game_exists(function):
    """
    Decorator to ensure that a game exists before accessing a route.
    """
    @wraps(function)
    def wrapper(*args, **kwargs):
        game_id = str(kwargs.get("game_id"))  # Convert UUID to string
        game = db.session.get(Game, game_id)
        if not game:
            return "Game not found", 404
        if 'game' in signature(function).parameters:
            kwargs["game"] = game
        return function(*args, **kwargs)
    return wrapper


def game_not_full(function):
    """
    Decorator to ensure that a game is not full before accessing a route
    (used by game_view only, but it's here as a decorator so that the correct
    order of checks occur, since this check should happen after checking that
    the game exists, but before checking that the user is logged in, as spectators
    don't need to login).
    """
    @wraps(function)
    def wrapper(*args, **kwargs):
        game = kwargs.get("game")
        if not game:
            return "Game not found", 404
        if game.is_full():
            return render_template("game_view.html")
        return function(*args, **kwargs)
    return wrapper


#########################
### Socket Decorators ###
#########################

def socket_login_required(function):
    """
    Decorator to ensure that the user is logged in before being able to access the socket.
    """
    @wraps(function)
    def wrapper(*args, **kwargs):
        user_id = session.get("user_id")
        if not user_id:
            emit("error", {"message": "You must be logged in to do that."})
            return
        user = db.session.get(User, user_id)
        if not user:
            emit("error", {"message": "You must be logged in to do that."})
            return
        if 'user' in signature(function).parameters:
            kwargs["user"] = user
        return function(*args, **kwargs)
    return wrapper


# TODO: Implement
def socket_room_required(function):
    """
    Decorator to ensure that the room exists before joining it
    """
    @wraps(function)
    def wrapper(*args, **kwargs):
        data = args[0]
        room = data.get("room")
        if not room:
            emit("message", {"message": "No room specified"})
            return
        if 'room' in signature(function).parameters:
            kwargs["room"] = room
        return function(*args, **kwargs)
    return wrapper
# def socket_game_exists(function):
