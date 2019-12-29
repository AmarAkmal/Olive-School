import os, shutil
from datetime import timedelta, datetime
import math
from flask import Blueprint, render_template, request, jsonify, json, abort
from werkzeug.utils import secure_filename
from proj.model import *
from sqlalchemy import or_

bp_academic = Blueprint('bp_academic', __name__)


@bp_academic.route('/list/<pagenum>', methods=['GET'])
def list_student(pagenum):
    student_name = request.args["student_name"]
    student_ic = request.args["student_ic"]
    year = request.args["year"]
    sem = request.args["sem"]

    pagenum = json.loads(pagenum)

    codeSql = Academic.query.filter_by(is_deleted=0)

    if student_name:
        codeSql = codeSql.filter(Student.name.like('%' + student_name + '%'))

    if student_ic:
        codeSql = codeSql.filter(Student.ic_no.like('%' + student_ic + '%')).join(Student,
                                                                                  Academic.student_id == Student.id)

    if year:
        codeSql = codeSql.filter(Academic.year.like('%' + year + '%'))

    if sem != "All":
        codeSql = codeSql.filter(Academic.sem.like('%' + sem + '%'))

    count_result = codeSql.order_by(Academic.date_created.desc()).count()
    if count_result:
        totalpagenum = math.ceil(count_result / 10)

    else:
        totalpagenum = 0

    if totalpagenum >= int(pagenum):
        report = codeSql.order_by(Academic.date_created.desc()).paginate(int(pagenum), 10)
    else:
        pagenum = int(pagenum)
        pagenum = pagenum - (pagenum - totalpagenum)
        if pagenum == 0:
            pagenum = 1
        report = codeSql.order_by(Academic.date_created.desc()).paginate(int(pagenum), 10)

    # report = codeSql.order_by(Academic.date_created.desc()).paginate(int(pagenum), 10)
    # count_result = codeSql.order_by(Academic.date_created.desc()).count()

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
            dict1['sem'] = x.sem
            # get_detail = AcademicDetail.query.filter_by(academic_id=x.id, is_deleted=0).all()
            # dict1['academic_detail'] = []

            # if get_detail:
            #
            #     for j in get_detail:
            #         list_1 = dict()
            #         list_1['code'] = j.code
            #         list_1['subject'] = j.subject
            #         list_1['score'] = j.score
            #         list_1['old'] = True
            #         dict1['academic_detail'].append(list_1)

            list['data'].append(dict1)
        # totalpagenum = math.ceil(count_result / 10)
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
            sem = data["sem"]

            if "desc" in data:
                desc = data["desc"]
            else:
                desc = ""
            items = data["items"]

            get_student = Student.query.filter_by(id=student_id).first()
            if student_id:

                student_academic = Academic(desc=desc, year=year, sem=sem)

                if "desc" in data:
                    student_academic.desc = data["desc"]
                student_academic.student_id = get_student.id
                db.session.add(student_academic)

                for x in items:
                    code = x["code"]
                    subject = x["subject"]
                    score = x["score"]
                    academic_detail = AcademicDetail(code=code, subject=subject, score=score)
                    academic_detail.academic_id = student_academic.id
                    db.session.add(academic_detail)
                    # db.session.commit()

            db.session.commit()
            response = {"status": "OK"}
        else:
            response = {"status": "No Student ID"}
    except Exception as e:
        print(e)
        response = {"status": "Failed"}
    return jsonify(response)


# Inter mobile
@bp_academic.route('/get_academic', methods=['GET'])
def get_academic():
    id = request.args.get("id")
    if not id:
        return "invoice does not exist"

    get_detail = Academic.query.get(id)
    dictV = dict()
    dictV["student_name"] = get_detail.student.name
    dictV["student_ic"] = get_detail.student.ic_no
    dictV["student_name"] = get_detail.student.name
    dictV["year"] = get_detail.year
    dictV["sem"] = get_detail.sem
    dictV["desc"] = get_detail.desc
    # dictV["is_pay"] = float(get_detail.is_pay)
    dictV['items'] = []
    get_detail_items = AcademicDetail.query.filter_by(academic_id=get_detail.id, is_deleted=0).order_by(
        AcademicDetail.code.asc()).all()

    if get_detail_items:

        for j in get_detail_items:
            list_1 = dict()

            list_1['id'] = j.id
            list_1['code'] = j.code
            list_1['subject'] = j.subject
            list_1['score'] = j.score
            list_1['check'] = "old"
            dictV['items'].append(list_1)

    return jsonify(dictV)


@bp_academic.route('/update', methods=['POST'])
def update():
    response = dict()
    data = json.loads(request.form['data'])
    id = request.args.get("id")

    if not id:
        return "need invoice no."

    check = Academic.query.filter_by(id=id, is_deleted=0).first()
    if check:

        update_academic_detail = Academic.query.filter_by(id=id, is_deleted=0)

        if update_academic_detail:

            year = data['year']
            sem = data['sem']
            items = data['items']
            deleted_items = data['deleted_items']

            if "desc" in data:
                desc = data["desc"]
            else:
                desc = ""

            update_academic_detail.update(dict(year=year, sem=sem, desc=desc))

            for x in items:
                if x["check"] == "new":  # Check kalau new bru add
                    academic_detail = AcademicDetail(code=x["code"], subject=x["subject"], score=x["score"])
                    academic_detail.academic_id = id
                    db.session.add(academic_detail)

                if x["check"] == "old":
                    AcademicDetail.query.filter_by(id=x["id"]).update(
                        dict(code=x["code"], subject=x["subject"], score=x["score"]))

            if deleted_items:
                aa = AcademicDetail.query.filter(AcademicDetail.id.in_(deleted_items))
                for x in aa:
                    db.session.delete(x)

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

    get_list = Academic.query.filter(Academic.id.in_(data))
    for x in get_list:
        x.is_deleted = 1
    try:
        db.session.commit()
        response = {"status": "OK"}
    except Exception as e:
        print(e)
        response = {"status": "Failed"}

    return jsonify(response)
