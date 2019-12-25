import os
from datetime import timedelta, datetime
import math
from flask import Blueprint, render_template, request, jsonify, json, abort
from werkzeug.utils import secure_filename
from proj.model import *

bp_account = Blueprint('bp_account', __name__)


@bp_account.route('/list_student/<pagenum>', methods=['GET'])
def list_student(pagenum):
    student_name = request.args["student_name"]
    student_ic = request.args["student_ic"]
    student_intake = request.args["student_intake"]
    # return "ok"
    # keyword = json.loads(keyword)
    pagenum = json.loads(pagenum)

    # status = keyword["status"]

    codeSql = Student.query.filter_by(is_deleted=1)

    if student_name:
        codeSql = codeSql.filter(Student.name.like('%' + student_name + '%'))

    if student_ic:
        codeSql = codeSql.filter(Student.ic_no.like('%' + student_ic + '%'))
    if student_intake:
        codeSql = codeSql.filter(Student.intake.like('%' + student_intake + '%'))

    # if status and status != "All":
    #     codeSql = codeSql.filter(Report.status.like('%' + status + '%'))

    report = codeSql.order_by(Student.date_created.desc()).paginate(int(pagenum), 10)
    count_result = codeSql.order_by(Student.date_created.desc()).count()

    if not report:
        return "Report does not exist"
    else:
        list = dict()
        list['data'] = []
        for x in report.items:
            dict1 = dict()
            dict1['id'] = x.id
            dict1['student_ic'] = x.ic_no
            dict1['student_name'] = x.name
            dict1['student_intake'] = x.intake
            dict1['student_address'] = x.address
            dict1['student_picture'] = x.picture
            get_father = Parent.query.filter_by(student_id=x.id, type="father").first()
            if get_father:
                dict1['father_name'] = get_father.name
                dict1['father_email'] = get_father.email
                dict1['father_phone'] = get_father.phone

            get_mother = Parent.query.filter_by(student_id=x.id, type="mother").first()
            if get_mother:
                dict1['mother_name'] = get_mother.name
                dict1['mother_email'] = get_mother.email
                dict1['mother_phone'] = get_mother.phone

            list['data'].append(dict1)
        totalpagenum = math.ceil(count_result / 10)
        list['totalpagenum'] = str(totalpagenum)
        list['count_result'] = str(count_result)
        return jsonify(list)


@bp_account.route('/add_invoice', methods=['POST'])
def add_invoice():
    print(request.form)
    print(request.files)
    return "OK"
    # data = json.loads(request.form["data"])
    # print(data)
    #
    # student_name = data["student_name"]
    # student_ic = data["student_ic"]
    # student_address = data["student_address"]
    # intake = data["intake"]
    #
    # father_name = data["father_name"]
    # father_email = data["father_email"]
    # father_contact = data["father_contact"]
    #
    # mother_name = data["mother_name"]
    # mother_email = data["mother_email"]
    # mother_contact = data["mother_contact"]
    #
    # response = dict()
    #
    # student = Student(name=student_name, ic_no=student_ic, intake=intake, address=student_address,
    #                   password=student_ic)
    # db.session.add(student)
    # father = Parent(type="father", name=father_name, phone=father_contact, email=father_email)
    # father.student_id = student.id
    # db.session.add(father)
    #
    # mother = Parent(type="mother", name=mother_name, phone=mother_contact, email=mother_email)
    # mother.student_id = student.id
    # db.session.add(mother)
    # folder = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], student.id)
    # if os.path.exists(folder):
    #     pass
    # else:
    #     try:
    #         os.mkdir(folder)
    #
    #     except Exception as e:
    #         print(e)
    #
    # if 'file' in request.files:
    #     file = request.files['file']
    #     if 'image' in file.content_type:
    #         filename = secure_filename(file.filename)
    #         fullfilename = os.path.join(folder, filename)
    #         file.save(fullfilename)
    #         student.picture = filename
    # db.session.add(student)
    #
    # try:
    #     db.session.commit()
    #     response['status'] = 'OK'
    # except Exception as e:
    #     print(e)
    #     response['status'] = 'Failed=' + str(e)
    #
    # return jsonify(response)


@bp_account.route('/update_student', methods=['POST'])
def update_student():
    data = json.loads(request.form["data"])

    id = data["id"]
    student_name = data["student_name"]
    student_ic = data["student_ic"]
    student_address = data["student_address"]
    intake = data["intake"]

    father_name = data["father_name"]
    father_email = data["father_email"]
    father_contact = data["father_contact"]

    mother_name = data["mother_name"]
    mother_email = data["mother_email"]
    mother_contact = data["mother_contact"]

    response = dict()

    student = Student.query.filter_by(id=id).update(dict(name=student_name, ic_no=student_ic, intake=intake,
                                                         address=student_address,
                                                         password=student_ic))
    db.session.commit()
    Parent.query.filter_by(student_id=id, type="father").update(
        dict(name=father_name, phone=father_contact, email=father_email))

    db.session.commit()
    Parent.query.filter_by(student_id=id, type="mother").update(
        dict(name=mother_name, phone=mother_contact, email=mother_email))
    db.session.commit()
    folder = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], id)
    if os.path.exists(folder):
        pass
    else:
        try:
            os.mkdir(folder)

        except Exception as e:
            print(e)

    if 'file' in request.files:
        file = request.files['file']
        if 'image' in file.content_type:
            filename = secure_filename(file.filename)
            fullfilename = os.path.join(folder, filename)
            student = Student.query.filter_by(id=id).first()
            check = str(os.path.join(folder, student.picture))
            exists = os.path.isfile(check)
            if exists:
                os.remove(os.path.join(folder, student.picture))
            file.save(fullfilename)

            student.picture = filename
    # db.session.add(student)

    try:
        db.session.commit()
        response['status'] = 'OK'
    except Exception as e:
        print(e)
        response['status'] = 'Failed=' + str(e)

    return jsonify(response)


@bp_account.route('/delete_student', methods=['POST'])
def delete_student():
    response = dict()
    try:
        data = json.loads(request.form['data'])

        users = Student.query.filter(Student.id.in_(data['item_id'])).all()
    except Exception as e:
        print(e)
        response['status'] = 'PARAM_VIOLATION'
        return jsonify(response)

    if len(users) == 0:
        return "User does not exist"
    else:

        for i in users:
            i.is_deleted = 0
            # i.email += '#Software#' + datetime.now().strftime('%Y%m%d%H%M%S')
            # i.phone += '#Software#' + datetime.now().strftime('%Y%m%d%H%M%S')
            # i.staff_id += '#Software#' + datetime.now().strftime('%Y%m%d%H%M%S')
            # folder = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], i.id)
            #
            # if os.path.exists(folder):
            #     shutil.rmtree(folder)
            # db.session.delete(i)

        try:

            db.session.commit()
            response['status'] = 'OK'
        except Exception as e:
            response['status'] = 'FAILED'

    return jsonify(response)


@bp_account.route('/get_student', methods=['GET'])
def get_student():
    get_student = Student.query.filter_by(is_deleted=1).all()
    data = []
    for x in get_student:
        dictV = dict()
        dictV["id"] = x.id
        dictV["ic_no"] = x.ic_no
        dictV["name"] = x.name
        data.append(dictV)
    return jsonify(data)
