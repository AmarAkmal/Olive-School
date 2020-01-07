from flask import Blueprint, render_template, request, url_for, redirect, flash, session, jsonify, json
from proj.model import *
from datetime import datetime

bp_login = Blueprint('bp_login', __name__)


@bp_login.route('/error')
def error():
    return render_template('error.html')


@bp_login.route('/', methods=['GET', 'POST'])
def auth():
    if request.method == 'POST':

        email = request.form["inputEmail3"]
        password = request.form["inputPassword3"]
        user = User.query.filter_by(email=email).first()
        if user:
            if user.password == password:
                session['logged_in'] = True
                return redirect(url_for('bp_main.index', id=user.id))
        else:
            flash('wrong email or password', 'error')
    # host = request.host_url

    # if "login" not in host:
    #     return render_template('error.html')

    return render_template('auth.html')


@bp_login.route('/logout')
def logout():
    try:
        session.clear()
        flash('You were logged out')
    except Exception as e:
        print(e)
        flash('Failed')

    return redirect(url_for('bp_login.auth'))


@bp_login.route('/mobile_login', methods=['POST'])
def mobile_login():
    if request.method == 'POST':
        ic_no = request.form["ic_no"]
        user = Student.query.filter_by(ic_no=ic_no).first()
        if user:
            if user.ic_no == ic_no:
                return jsonify({"status": "success","id": user.id, "ic_no": user.ic_no})
        else:
            return jsonify({"status": "Identification No not match"})

    return jsonify({"status": "Failed"})
