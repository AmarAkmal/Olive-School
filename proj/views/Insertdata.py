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

    arr2 = []
    arr2.extend(
        (Subject(name='Bahasa Melayu'),
         Subject(name='English'),
         Subject(name='Mathematics'),
         Subject(name='Science'),
         Subject(name='Pendidikan Agama Islam'),
         Subject(name='Health'),
         Subject(name='Pendidikan Jasmani')
         ))
    for i in arr2:
        check = Subject.query.filter_by(name=i.name).first()
        if not check:
            db.session.add(i)
            db.session.commit()

    arr3 = [{'skill':'Mendengar', 'subject': 'Bahasa Melayu','sort':1},
            {'skill': 'Bertutur', 'subject': 'Bahasa Melayu', 'sort': 2},
            {'skill': 'Membaca', 'subject': 'Bahasa Melayu', 'sort': 3},
            {'skill': 'Menulis', 'subject': 'Bahasa Melayu', 'sort': 4},
            {'skill': 'Listening', 'subject': 'English', 'sort': 1},
            {'skill': 'Speaking', 'subject': 'English', 'sort': 2},
            {'skill': 'Reading', 'subject': 'English', 'sort': 3},
            {'skill': 'Writing', 'subject': 'English', 'sort': 4},
            {'skill': 'Whole Number up to 1000', 'subject': 'Mathematics', 'sort': 1},
            {'skill': 'Basic Operation', 'subject': 'Mathematics', 'sort': 2},
            {'skill': 'Fractions and Decimals', 'subject': 'Mathematics', 'sort': 3},
            {'skill': 'Money', 'subject': 'Mathematics', 'sort': 4},
            {'skill': 'Scientific Skill', 'subject': 'Science', 'sort': 1},
            {'skill': 'Science Room Rules', 'subject': 'Science', 'sort': 2},
            {'skill': 'Human', 'subject': 'Science', 'sort': 3},
            {'skill': 'Animals', 'subject': 'Science', 'sort': 4},
            {'skill': 'Plants', 'subject': 'Science', 'sort': 5},
            {'skill': 'Modul Al-Quran', 'subject': 'Pendidikan Agama Islam', 'sort': 1},
            {'skill': 'Akidah', 'subject': 'Pendidikan Agama Islam', 'sort': 2},
            {'skill': 'Ibadah', 'subject': 'Pendidikan Agama Islam', 'sort': 3},
            {'skill': 'Sirah', 'subject': 'Pendidikan Agama Islam', 'sort': 4},
            {'skill': 'Adab', 'subject': 'Pendidikan Agama Islam', 'sort': 5},
            {'skill': 'Food', 'subject': 'Health', 'sort': 1},
            {'skill': 'Medicine', 'subject': 'Health', 'sort': 2},
            {'skill': 'Ke Dusun Datuk', 'subject': 'Pendidikan Jasmani', 'sort': 1},
            {'skill': 'Bola Monyet', 'subject': 'Pendidikan Jasmani', 'sort': 2},
            ]
    for i in arr3:
        # print(i['subject'])
        check = Subject.query.filter_by(name=i['subject']).first()
        if check:
            da = Skill.query.filter_by(name=i['skill']).first()
            if not da:
                das = Skill(name=i['skill'],sort=i['sort'])
                das.subject_id = check.id
                db.session.add(das)
                db.session.commit()
    return "OK"
