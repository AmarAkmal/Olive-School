import os
from datetime import timedelta, datetime
import math
from flask import Blueprint, render_template, request, jsonify, json, abort
from werkzeug.utils import secure_filename
from proj.model import *
from sqlalchemy import or_

bp_account = Blueprint('bp_account', __name__)


@bp_account.route('/list/<pagenum>', methods=['GET'])
def list_student(pagenum):
    receipt_no = request.args["receipt_no"]
    code = request.args["code"]
    student_name = request.args["student_name"]
    total = request.args["total"]
    status = request.args["status"]

    pagenum = json.loads(pagenum)

    # status = keyword["status"]

    codeSql = Invoice.query.filter_by(is_deleted=1)

    if receipt_no:
        codeSql = codeSql.filter(Invoice.receipt_no.like('%' + receipt_no + '%'))

    if code:
        codeSql = codeSql.filter(or_(Invoice.year.like('%' + code + '%'), Invoice.month.like('%' + code + '%')))

    if student_name:
        codeSql = codeSql.filter(Student.name.like('%' + student_name + '%')).join(Student,
                                                                                   Invoice.student_id == Student.id)

    if total:
        codeSql = codeSql.filter(Invoice.total_pay.like('%' + total + '%'))

    if status != "All":
        print(status)
        codeSql = codeSql.filter(Invoice.is_pay == int(status))

    report = codeSql.order_by(Invoice.date_created.desc()).paginate(int(pagenum), 10)
    count_result = codeSql.order_by(Invoice.date_created.desc()).count()

    if not report:
        return "Report does not exist"
    else:
        list = dict()
        list['data'] = []
        for x in report.items:
            dict1 = dict()
            dict1['id'] = x.id
            dict1['receipt_no'] = x.receipt_no
            dict1['student_name'] = x.student.name
            # dict1['year'] = x.year
            dict1['code'] = x.year + "-" + x.month
            dict1['desc'] = x.desc
            dict1['date_pay'] = x.date_pay
            dict1['is_pay'] = x.is_pay
            if (x.is_pay == 1):
                dict1['status'] = "Done"
            else:
                dict1['status'] = "Pending"

            dict1['total'] = "%.2f" % x.total_pay
            get_detail = InvoiceDetail.query.filter_by(payment_id=x.id, ).all()
            dict1['invoice_detail'] = []

            if get_detail:
                # calculation = 0
                for j in get_detail:
                    list_1 = dict()
                    list_1['desc'] = j.desc
                    list_1['price'] = j.price
                    # calculation = calculation + float(j.price)
                    dict1['invoice_detail'].append(list_1)
                # total = round(calculation, 1)
                # dict1['total'] = "RM%.2f" % total
                # print("%.2f" % total)

            list['data'].append(dict1)
        totalpagenum = math.ceil(count_result / 10)
        list['totalpagenum'] = str(totalpagenum)
        list['count_result'] = str(count_result)
        return jsonify(list)


@bp_account.route('/add_invoice', methods=['POST'])
def add_invoice():
    data = json.loads(request.form["data"])
    student_id = data["student_id"]
    year = data["year"]
    month = data["month"]
    items = data["items"]
    total_pay = data["total_pay"]
    response = dict()

    get_student = Student.query.filter_by(id=student_id).first()

    if student_id:
        receipt_no = datetime.now().strftime("%Y-%d%m%H%M-%f")
        check_len = Invoice.query.filter_by(receipt_no=receipt_no).count()

        receipt_no = datetime.now().strftime("%Y-%d%m%H%M-%f") + str(check_len + 1)

        student_payment = Invoice(receipt_no=receipt_no, year=year, month=month, total_pay=total_pay)
        if "desc" in data:
            student_payment.desc = data["desc"]
        # student_payment.date_pay = datetime.now()
        student_payment.student_id = get_student.id
        db.session.add(student_payment)
        for x in items:
            payment_detail = InvoiceDetail(price=x["amount"], desc=x["desc"])
            payment_detail.payment_id = student_payment.id
            db.session.add(payment_detail)

        folder = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], student_payment.id)
        if os.path.exists(folder):
            pass
        else:
            try:
                os.mkdir(folder)

            except Exception as e:
                print(e)
        if 'attachment' in request.files:
            file = request.files.getlist('attachment')
            for j in file:
                filename = secure_filename(j.filename)
                fullfilename = os.path.join(folder, filename)
                j.save(fullfilename)
                t = PaymentAttachment(name=filename)
                t.student_id = student_payment.id
                db.session.add(t)
    db.session.commit()
    return jsonify(response)


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
