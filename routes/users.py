from flask import Blueprint, session, request, url_for, render_template, redirect

from extensions import db
from models import User

users = Blueprint("users", __name__)


@users.route("/create/", methods=["GET", "POST"])
def create():
    if not session.get("url"):
        session["url"] = request.args.get("prev") or url_for("index", _external=True)

    if request.method == "POST":
        username = request.form.get("username")
        if not username:
            return render_template("user_create.html", error="Username is required")

        new_user = User(username=username)
        db.session.add(new_user)
        db.session.commit()
        session["user_id"] = new_user.id
        return redirect(session.pop("url", url_for("index", _external=True)))

    return render_template("user_create.html")


# TODO: Delete this route before deploying
@users.route("/")
def list_all():
    users = User.query.all()
    output = "<html><body>"
    for user in users:
        output += f"<p>{user.username}</p>"
    output += "</body></html>"

    return output

