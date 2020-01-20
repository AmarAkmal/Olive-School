import os
from flask import Blueprint, render_template, request, jsonify, session

from proj.model import *

bp_main = Blueprint('bp_main', __name__)


@bp_main.before_request
def before_request():
    # login = session.get("logged_in")

    if session.get('logged_in') != True:
        return render_template('auth.html')


@bp_main.route('/')
def index():
    user = User.query.filter_by(id=request.args.get('id')).first()
    if user:
        return render_template('index.html', id=user.id, user_name=user.name, role=user.role)
    else:
        return render_template('error.html')
