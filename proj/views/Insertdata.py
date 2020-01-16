from flask import Blueprint
from proj.model import *

bp_insertdata = Blueprint('bp_insertdata', __name__)


@bp_insertdata.route('/')
def index():
    arr1 = []
    arr1.extend(
        (User(name='Teacher', email='admin@mail.com', role='Principle', password=111111),
         User(name='MOHAMMAD NURZAKUAN', email='mohammadnurzakuan.olivetrees@gmail.com', role="Principle", password=111111),
         User(name='AZHAR BIN MOHAMED NOR', email='azharmohamednor@gmail.com', role="Principle", password=111111),
         User(name='NUR ZAHIDAH BINTI ABD TALIB', email='nurzahidahtalib@gmail.com', role="Principle", password=111111),
         User(name='AZHAR BIN MOHAMED NOR', email='azharmohamednor@gmail.com', role="Account", password=111111),
         User(name='NAZIRA ALIS', email='nazira_alis@yahoo.com', role="Teacher", password=111111),
         User(name='SITI NORAINI BINTI SALLEH ZAABAR', email='ainie9111@yahoo.com', role="Teacher", password=111111),
         User(name='BETTY INTAN SAHURA', email='bettyintan79@gmail.com', role="Teacher", password=111111),
         User(name='SYUHADA BINTI MOHD RABI', email='syuhadamohdrabi@gmail.com', role="Teacher", password=111111),
         User(name='tOts Teachers', email='theolivetrees2016@gmasil.com', role="Teacher", password=111111),
         User(name='tOts Account', email='receipt.theolivetrees@gmail.com', role="Teacher", password=111111),
         # User(name='Principle', email='principle1@mail.com', role="Principle", password=111111),
         # User(name='Account', email='account@mail.com', role="Account", password=111111)
         ))
    for i in arr1:
        check = User.query.filter_by(name=i.name).first()
        if not check:
            db.session.add(i)
            db.session.commit()

    return "OK"
