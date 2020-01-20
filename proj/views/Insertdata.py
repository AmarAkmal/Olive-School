from flask import Blueprint
from proj.model import *

bp_insertdata = Blueprint('bp_insertdata', __name__)


@bp_insertdata.route('/')
def index():
    arr1 = []
    arr1.extend(
        (User(name='Teacher', email='admin@mail.com', role='Principle', password=111111),
         User(name='MOHAMMAD NURZAKUAN', email='mohammadnurzakuan.olivetrees@gmail.com', role="Principle",
              password=111111),
         User(name='AZHAR BIN MOHAMED NOR', email='azharmohamednor@gmail.com', role="Principle", password=111111),
         User(name='NUR ZAHIDAH BINTI ABD TALIB', email='nurzahidahtalib@gmail.com', role="Special Teacher",
              password=111111),
         User(name='NAZIRA ALIS', email='nazira_alis@yahoo.com', role="Teacher", password=111111),
         User(name='SITI NORAINI BINTI SALLEH ZAABAR', email='ainie9111@yahoo.com', role="Teacher", password=111111),
         User(name='BETTY INTAN SAHURA', email='bettyintan79@gmail.com', role="Teacher", password=111111),
         User(name='SYUHADA BINTI MOHD RABI', email='syuhadamohdrabi@gmail.com', role="Teacher", password=111111),
         User(name='tOts Teachers', email='theolivetrees2016@gmasil.com', role="tOts Teacher", password=111111),
         User(name='tOts Account', email='receipt.theolivetrees@gmail.com', role="Account", password=111111),
         User(name='Principle', email='principle1@mail.com', role="Principle", password=111111),
         User(name='Account', email='account@mail.com', role="Account", password=111111)
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

    arr3 = [{'skill': 'Mendengar', 'subject': 'Bahasa Melayu', 'sort': 1},
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

        check = Subject.query.filter_by(name=i['subject']).first()
        if check:
            da = Skill.query.filter_by(name=i['skill']).first()
            if not da:
                das = Skill(name=i['skill'], sort=i['sort'])
                das.subject_id = check.id
                db.session.add(das)
                db.session.commit()
    # return "OK"

    arr4 = [
        {'comment': 'Mengetahui asas mendengar-bertutur, membaca dan menulis', 'subject': 'Bahasa Melayu', 'sort': 1},
        {'comment': 'Mengetahui dan memahami perkara yang didengar-ditutur, dibaca dan ditulis dengan bantuan.',
         'subject': 'Bahasa Melayu', 'sort': 2},
        {
            'comment': 'Mengetahui, memahami dan memberikan respons terhadap perkara yang didengar-ditutur, dibaca dan ditulis tanpa bantuan.',
            'subject': 'Bahasa Melayu', 'sort': 3},
        {
            'comment': 'Mengetahui, memahami dan memberikan respons terhadap maklumat yang didengar-ditutur, dibaca dan ditulis dalam pelbagai situasi dengan betul',
            'subject': 'Bahasa Melayu', 'sort': 4},
        {
            'comment': 'Memahami, menaakul dan memberikan respons/menyampaikan sesuatu perkara yang didengar- ditutur, dibaca dan ditulis dalam pelbagai situasi dengan betul dan tepat.',
            'subject': 'Bahasa Melayu', 'sort': 5},
        {
            'comment': 'Memahami, menaakul dan menilai tentang sesuatu perkara daripada pelbagai sumber yang didengar-ditutur, dibaca dan ditulis dengan bertatasusila',
            'subject': 'Bahasa Melayu', 'sort': 6},

        {'comment': 'Know basic skills in listening, speaking, reading and writing.', 'subject': 'English', 'sort': 1},
        {'comment': 'Know and understand words, phrases and sentences heard,spoken, read and written.',
         'subject': 'English', 'sort': 2},
        {
            'comment': 'Know, understand and apply knowledge obtained through listening, speaking, reading and writing.',
            'subject': 'English', 'sort': 3},
        {
            'comment': 'Apply knowledge obtained through listening, speaking, reading and writing in various situations using good manners.',
            'subject': 'English', 'sort': 4},
        {
            'comment': 'Demonstrate well the ability to apply knowledge of listening,speaking, reading and writing for various purposes using admirable manners.',
            'subject': 'English', 'sort': 5},
        {
            'comment': 'Appreciate literary works by performing and presenting ideas using exemplary manners.',
            'subject': 'English', 'sort': 6},
        {
            'comment': 'Know basic knowledge of mathematics.',
            'subject': 'Mathematics', 'sort': 1},
        {
            'comment': 'Know and understand the basic knowledge of mathematics.',
            'subject': 'Mathematics', 'sort': 2},
        {
            'comment': 'Know and understand basic knowledge of mathematics to perform basic operations of mathematics and basic conversion.',
            'subject': 'Mathematics', 'sort': 3},
        {
            'comment': 'Know and understand the basic knowledge of mathematics to perform calculation steps in solving daily routine problems.',
            'subject': 'Mathematics', 'sort': 4},
        {
            'comment': 'Master and apply knowledge and skills of mathematics in solving daily routine problems using various strategies.',
            'subject': 'Mathematics', 'sort': 5},
        {
            'comment': 'Master and apply knowledge and skills of mathematics in solving daily non routine problems creatively and innovatively.',
            'subject': 'Mathematics', 'sort': 6},

        {
            'comment': 'Recall the basic knowledge and skills in science.',
            'subject': 'Science', 'sort': 1},
        {
            'comment': 'Understand the science knowledge and skills as well as explain their understanding.',
            'subject': 'Science', 'sort': 2},
        {
            'comment': 'Apply science knowledge and skills to perform simple task.',
            'subject': 'Science', 'sort': 3},
        {
            'comment': 'Analyse science knowledge and skills in the context of problem solving.',
            'subject': 'Science', 'sort': 4},
        {
            'comment': 'Evaluate the science knowledge and skills in the context of problem solving and making decision to perform a task.',
            'subject': 'Science', 'sort': 5},
        {
            'comment': 'Inventing by using science knowledge and skills in the context of problem solving and making decision or in performing the tasks in a new situation creatively and innovatively.',
            'subject': 'Science', 'sort': 6},

        {
            'comment': 'Tahu.',
            'subject': 'Pendidikan Agama Islam', 'sort': 1},
        {
            'comment': 'Tahu dan faham.',
            'subject': 'Pendidikan Agama Islam', 'sort': 2},
        {
            'comment': 'Tahu, faham dan boleh ingat.',
            'subject': 'Pendidikan Agama Islam', 'sort': 3},
        {
            'comment': 'Tahu, faham, ingat dan boleh buat mengikut turutan.',
            'subject': 'Pendidikan Agama Islam', 'sort': 4},
        {
            'comment': 'Tahu, faham, ingat dan boleh buat mengikut turutan dengan baik.',
            'subject': 'Pendidikan Agama Islam', 'sort': 5},
        {
            'comment': 'Tahu, faham, ingat dan boleh buat dengan keputusan sendiri.',
            'subject': 'Pendidikan Agama Islam', 'sort': 6},
        {
            'comment': 'Mempunyai pengetahuan tentang asas kesihatan fizikal, mental, emosi, sosial dan persekitaran',
            'subject': 'Health', 'sort': 1},
        {
            'comment': 'Memahami aspek kesihatan fizikal, mental, emosi, sosial dan persekitaran',
            'subject': 'Health', 'sort': 2},
        {
            'comment': 'Memahami kepentingan dan boleh mengurus penjagaan diri,pengurusan mental, emosi dan sosial serta kesihatan dan keselamatan diri',
            'subject': 'Health', 'sort': 3},
        {
            'comment': 'Boleh memperkembangan aspek penjagaan diri serta pengurusan mental, emosi dan sosial terhadap keluarga dan masyarakat serta memainkan peranan mengawal aspek kesihatan dan keselamatan persekitaran',
            'subject': 'Health', 'sort': 4},
        {
            'comment': 'Mempunyai kemahiran berkomunikasi, empati dengan orang lain dan berupaya mengendalikan emosi dalam mengurus hidup secara positif dan sihat',
            'subject': 'Health', 'sort': 5},
        {
            'comment': 'Mempunyai keupayaan membuat keputusan untuk mengadaptasi permintaan serta cabaran kehidupan seharian, meningkatkan literasi kesihatan dan mengamalkan gaya hidup sihat',
            'subject': 'Health', 'sort': 6},
        {
            'comment': 'Tahu melakukan kemahiran pergerakan dan aktiviti fizikal.',
            'subject': 'Pendidikan Jasmani', 'sort': 1},
        {
            'comment': 'Tahu dan faham melakukan kemahiran pergerakan dan aktiviti fizikal berkaitan kecergasan.',
            'subject': 'Pendidikan Jasmani', 'sort': 2},
        {
            'comment': 'Tahu, faham dan boleh mengembangkan pengetahuan dan kebolehan dalam kemahiran pergerakan dan kecergasan mengikut konsep pergerakan dan konsep kecergasan.',
            'subject': 'Pendidikan Jasmani', 'sort': 3},
        {
            'comment': 'Tahu, faham dan boleh mengaplikasi pengetahuan dan kebolehan untuk melakukan pergerakan dan aktiviti yang dapat mengekalkan dan meningkatkan kemahiran dan kecergasan.',
            'subject': 'Pendidikan Jasmani', 'sort': 4},
        {
            'comment': 'Menguasai dan mengaplikasi pengetahuan dan kebolehan atas kesedaran kepentingan melakukan pergerakan dan aktiviti fizikal untuk meningkatkan kemahiran dan kecergasan dan melakukannya secara seronok, mengamalkan langkah- langkah keselamatan dan mempamerkan tanggungjawab kendiri.',
            'subject': 'Pendidikan Jasmani', 'sort': 5},
        {
            'comment': 'Memperkembangkan pengetahuan dan kemahiran secara sistematik dan berterusan serta menjana kreativiti minda menjurus kepada gaya hidup sihat untuk kesejahteraan.',
            'subject': 'Pendidikan Jasmani', 'sort': 6},
    ]
    for i in arr4:
        check = Subject.query.filter_by(name=i['subject']).first()
        if check:
            da = Band.query.filter_by(comment=i['comment']).first()
            if not da:
                das = Band(comment=i['comment'], band=i['sort'])
                das.subj_id = check.id
                db.session.add(das)
                db.session.commit()
    return "OK"
