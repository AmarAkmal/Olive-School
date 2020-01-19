import math
from flask import Blueprint, request, jsonify, json
from proj.model import *

bp_aideed = Blueprint('bp_aideed', __name__)


@bp_aideed.route('get_subject', methods=['GET'])
def get_subject():
    get_subject = Subject.query.all()
    data = []
    for x in get_subject:
        dictV = dict()
        dictV["id"] = x.id
        dictV["name"] = x.name
        data.append(dictV)
    return jsonify(data)


@bp_aideed.route('get_skill/band', methods=['GET'])
def get_skill():
    subject_id = request.args.get('subject_id')
    get_skill = Skill.query.filter_by(subject_id=subject_id).order_by(Skill.sort.asc()).all()
    data = []
    dictDD = dict()
    dictDD['skill'] = []
    dictDD['band'] = []
    for x in get_skill:
        dictV = dict()
        dictV["id"] = x.id
        dictV["name"] = x.name
        dictDD['skill'].append(dictV)

    get_band = Band.query.filter_by(subj_id=subject_id).order_by(Band.band.asc()).all()
    for x in get_band:
        dictV = dict()
        dictV["id"] = x.id
        dictV["comment"] = x.comment
        dictV["band"] = x.band
        dictDD['band'].append(dictV)
    data.append(dictDD)
    return jsonify(data)


@bp_aideed.route('add', methods=['GET', 'POST'])
def add():
    data = json.loads(request.form["data"])
    second = json.loads(request.form["second"])

    ai = Aideed(classB=second['class'], code=second['code'])
    db.session.add(ai)

    student = Student.query.get(second['student_ic'])
    if student:
        ai.student_id = student.id

    ai.body = data
    db.session.commit()
    # print(data)
    # print(second)
    return jsonify({'status': 'OK'})


@bp_aideed.route('/list/<pagenum>', methods=['GET'])
def list_aideed(pagenum):
    code = request.args["code"]
    classB = request.args["class"]
    student_ic = request.args["student_ic"]
    student_name = request.args["student_name"]

    pagenum = json.loads(pagenum)

    # status = keyword["status"]

    codeSql = Aideed.query.filter_by(is_deleted=0)

    if classB:
        codeSql = codeSql.filter(Aideed.classB.like('%' + classB + '%'))

    if code:
        codeSql = codeSql.filter(Aideed.code.like('%' + code + '%'))

    if student_name:
        codeSql = codeSql.filter(Student.name.like('%' + student_name + '%')).join(Student,
                                                                                   Aideed.student_id == Student.id)

    if student_ic:
        codeSql = codeSql.filter(Student.ic_no.like('%' + student_ic + '%')).join(Student,
                                                                                   Aideed.student_id == Student.id)

    count_result = codeSql.order_by(Aideed.date_created.desc()).count()
    if count_result:
        totalpagenum = math.ceil(count_result / 10)

    else:
        totalpagenum = 0

    if totalpagenum >= int(pagenum):
        report = codeSql.order_by(Aideed.date_created.desc()).paginate(int(pagenum), 10)
    else:
        pagenum = int(pagenum)
        pagenum = pagenum - (pagenum - totalpagenum)
        if pagenum == 0:
            pagenum = 1
        report = codeSql.order_by(Aideed.date_created.desc()).paginate(int(pagenum), 10)

    if not report:
        return "Report does not exist"
    else:
        list = dict()
        list['data'] = []
        for x in report.items:
            dict1 = dict()
            dict1['id'] = x.id
            # dict1['receipt_no'] = x.receipt_no
            dict1['student_name'] = x.student.name
            dict1['student_ic'] = x.student.ic_no
            dict1['class'] = x.classB
            dict1['code'] = x.code
            dict1['body'] = x.body

            list['data'].append(dict1)

        list['totalpagenum'] = int(totalpagenum)
        list['count_result'] = str(count_result)
        return jsonify(list)


@bp_aideed.route('/list_mobile', methods=['GET'])
def list_mobile():
    student_id = request.args.get("student_id")
    student = Student.query.filter_by(id=student_id).first()
    ai = Aideed.query.filter_by(student_id=student.id).order_by(Aideed.date_created.desc()).all()
    dataList = []
    for x in ai:
        dict1 = dict()
        dict1['id'] = x.id
        dict1['class'] = x.classB
        dict1['code'] = x.code
        dataList.append(dict1)
    return jsonify(dataList)


@bp_aideed.route('/delete', methods=['POST'])
def delete():
    data = json.loads(request.form["data"])
    data = data["item_id"]

    get_list = Aideed.query.filter(Aideed.id.in_(data))
    for x in get_list:
        x.is_deleted = 1
    try:
        db.session.commit()
        response = {"status": "OK"}
    except Exception as e:
        print(e)
        response = {"status": "Failed"}

    return jsonify(response)

