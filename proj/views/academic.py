import math
from flask import Blueprint, request, jsonify, json
from proj.model import *


bp_academic = Blueprint('bp_academic', __name__)


@bp_academic.route('/list/<pagenum>', methods=['GET'])
def list(pagenum):
    student_name = request.args["student_name"]
    student_ic = request.args["student_ic"]
    year = request.args["year"]
    sem = request.args["sem"]

    pagenum = json.loads(pagenum)

    codeSql = AcademicIep.query.filter_by(is_deleted=0)

    if student_name:
        codeSql = codeSql.filter(Student.name.like('%' + student_name + '%'))

    if student_ic:
        codeSql = codeSql.filter(Student.ic_no.like('%' + student_ic + '%')).join(Student,
                                                                                  AcademicIep.student_id == Student.id)

    if year:
        codeSql = codeSql.filter(AcademicIep.year.like('%' + year + '%'))


    count_result = codeSql.order_by(AcademicIep.date_created.desc()).count()
    if count_result:
        totalpagenum = math.ceil(count_result / 10)

    else:
        totalpagenum = 0

    if totalpagenum >= int(pagenum):
        report = codeSql.order_by(AcademicIep.date_created.desc()).paginate(int(pagenum), 10)
    else:
        pagenum = int(pagenum)
        pagenum = pagenum - (pagenum - totalpagenum)
        if pagenum == 0:
            pagenum = 1
        report = codeSql.order_by(AcademicIep.date_created.desc()).paginate(int(pagenum), 10)

    if not report:
        return "Report does not exist"
    else:
        list = dict()
        list['data'] = []
        for x in report.items:
            dict1 = dict()
            dict1['id'] = x.id
            dict1['ic_no'] = x.student.ic_no
            dict1['student_name'] = x.student.name
            dict1['desc'] = x.desc
            dict1['year'] = x.year

            list['data'].append(dict1)
        list['totalpagenum'] = int(totalpagenum)
        list['count_result'] = str(count_result)
        return jsonify(list)


@bp_academic.route('/add', methods=['POST'])
def add():
    data = json.loads(request.form["data"])

    try:
        if "student_id" in data:
            student_id = data["student_id"]
            year = data["year"]
            desc = data["desc"]
            get_student = Student.query.filter_by(id=student_id).first()
            if student_id:
                student_desc = AcademicIep(desc=desc, year=year)
                student_desc.student_id = get_student.id
                db.session.add(student_desc)

            db.session.commit()
            response = {"status": "OK"}
        else:
            response = {"status": "No Student ID"}
    except Exception as e:
        print(e)
        response = {"status": "Failed"}
    return jsonify(response)


# Inter mobile
@bp_academic.route('/get_academic_iep', methods=['GET'])
def get_academic_iep():
    id = request.args.get("id")
    if not id:
        return "invoice does not exist"
    #
    get_detail = AcademicIep.query.get(id)
    dictV = dict()
    dictV["student_name"] = get_detail.student.name
    dictV["student_ic"] = get_detail.student.ic_no
    dictV["year"] = get_detail.year
    dictV["desc"] = get_detail.desc

    return jsonify(dictV)


@bp_academic.route('/update', methods=['POST'])
def update():
    response = dict()
    data = json.loads(request.form['data'])
    id = request.args.get("id")

    if not id:
        return "need invoice no."

    check = AcademicIep.query.filter_by(id=id, is_deleted=0).first()
    if check:
        update_academic_detail = AcademicIep.query.filter_by(id=id, is_deleted=0)
        if update_academic_detail:

            desc = data["desc"]

            update_academic_detail.update(dict(desc=desc))

            try:
                db.session.commit()
                response = {"status": "OK"}
            except Exception as e:
                print(e)
                response = {"status": "Failed"}

        return jsonify(response)


@bp_academic.route('/delete', methods=['POST'])
def delete():
    data = json.loads(request.form["data"])
    data = data["item_id"]

    get_list = AcademicIep.query.filter(AcademicIep.id.in_(data))
    for x in get_list:
        x.is_deleted = 1
    try:
        db.session.commit()
        response = {"status": "OK"}
    except Exception as e:
        print(e)
        response = {"status": "Failed"}

    return jsonify(response)


############################# mobile area #####################################

@bp_academic.route('/mobile_student_academic', methods=['GET'])  # mobile get academic detail
def mobile_student_academic():
    ic = json.loads(request.args.get("ic"))
    sem = json.loads(request.args.get("sem"))
    if not ic or not sem:
        return "no data"

    data = []
    get_student = Student.query.filter_by(ic_no=ic).first()

    if get_student:
         #
        get_academic = Academic.query.filter_by(student_id=get_student.id, is_deleted=0, sem=sem).first()
        # for x in get_academic:
        if get_academic:
            dictV = dict()
            dictV["student_ic"] = get_academic.student.ic_no
            dictV["student_name"] = get_academic.student.name
            dictV["sem"] = get_academic.year + "/" + get_academic.sem
            dictV["items"] = []
            get_academic_detail = AcademicDetail.query.filter_by(academic_id=get_academic.id, is_deleted=0).all()
            for x in get_academic_detail:
                dictV1 = dict()
                dictV1["code"] = x.code
                dictV1["subject"] = x.subject
                dictV1["score"] = x.score
                dictV["items"].append(dictV1)
            dictV["remark"] = get_academic.desc
            data.append(dictV)

    return jsonify(data)
