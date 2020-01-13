from flask import Flask, redirect, url_for, render_template, request
from flask_sqlalchemy import SQLAlchemy
import os
import proj.config
from flask_cors import CORS


# from celery import Celery

app = Flask(__name__, instance_relative_config=True)

CORS(app)
# load config
config_name = os.getenv('FLASK_CONFIGURATION', 'default')
app.config.from_object(config.config_setting[config_name])  # object-based default configuration
app.config.from_pyfile('flask.cfg', silent=True)  # instance-folders configuration
# ---
from flask_cors import CORS

# celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'], backend=app.config['CELERY_BACKEND'])
# celery.conf.task_default_queue = 'agency'

# create tables
db = SQLAlchemy(app)
from proj import model
# db.drop_all()
db.create_all()
# ---
from proj.views.login import bp_login

app.register_blueprint(bp_login, url_prefix='/login')

from proj.views.main import bp_main

app.register_blueprint(bp_main, url_prefix='/main')

from proj.views.student import bp_student

app.register_blueprint(bp_student, url_prefix='/student')

from proj.views.account import bp_account

app.register_blueprint(bp_account, url_prefix='/account')

from proj.views.academic import bp_academic

app.register_blueprint(bp_academic, url_prefix='/academic')

from proj.views.Insertdata import bp_insertdata

app.register_blueprint(bp_insertdata, url_prefix='/insert')


# ---

@app.errorhandler(404)
def page_not_found(e):
    # print(e)
    return render_template('404.html'), 404


@app.errorhandler(401)
def unauthorized(e):
    # print(e)
    return render_template('error.html'), 401


@app.route('/error.html')
def error():
    return render_template('error.html')



