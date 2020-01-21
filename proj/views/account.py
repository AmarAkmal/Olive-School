import os, shutil
from datetime import timedelta, datetime
import math
from flask import Blueprint, render_template, request, jsonify, json, abort
from werkzeug.utils import secure_filename
from proj.model import *
from sqlalchemy import or_
import requests

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

    codeSql = Invoice.query.filter_by(is_deleted=0)

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
        codeSql = codeSql.filter(Invoice.is_pay == int(status))

    count_result = codeSql.order_by(Invoice.date_created.desc()).count()
    if count_result:
        totalpagenum = math.ceil(count_result / 10)

    else:
        totalpagenum = 0

    if totalpagenum >= int(pagenum):
        report = codeSql.order_by(Invoice.date_created.desc()).paginate(int(pagenum), 10)
    else:
        pagenum = int(pagenum)
        pagenum = pagenum - (pagenum - totalpagenum)
        if pagenum == 0:
            pagenum = 1
        report = codeSql.order_by(Invoice.date_created.desc()).paginate(int(pagenum), 10)

    # report = codeSql.order_by(Invoice.date_created.desc()).paginate(int(pagenum), 10)
    # count_result = codeSql.order_by(Invoice.date_created.desc()).count()
    # call_bank_toyyib()
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
            dict1['invoice_no'] = x.receipt_no
            dict1['code'] = x.year + "-" + x.month

            if x.billcode_toyyib:
                dict1['bill_code'] = x.billcode_toyyib
            else:
                dict1['bill_code'] = "None"

            if x.is_pay == 1:
                dict1['status'] = "Done"
            else:
                dict1['status'] = "Pending"

            dict1['total'] = "%.2f" % float(x.total_pay)
            get_detail = InvoiceDetail.query.filter_by(payment_id=x.id, is_deleted=0).all()
            dict1['invoice_detail'] = []

            if get_detail:

                for j in get_detail:
                    list_1 = dict()
                    list_1['desc'] = j.desc
                    list_1['price'] = float(j.price)
                    list_1['old'] = True
                    # calculation = calculation + float(j.price)
                    dict1['invoice_detail'].append(list_1)

            list['data'].append(dict1)
        # totalpagenum = math.ceil(count_result / 10)
        list['totalpagenum'] = int(totalpagenum)
        list['count_result'] = str(count_result)
        return jsonify(list)


@bp_account.route('/add_invoice', methods=['POST'])
def add_invoice():
    data = json.loads(request.form["data"])

    student_id = data["student_id"]

    user_id = data["user_id"]
    year = data["year"]
    month = data["month"]
    items = data["items"]
    total_pay = data["total_pay"]
    response = dict()

    get_student = Student.query.filter_by(id=student_id).first()
    try:
        if student_id:
            receipt_no = datetime.now().strftime("%Y-%d%m%H%M-%f")
            check_len = Invoice.query.filter_by(receipt_no=receipt_no).count()

            receipt_no = datetime.now().strftime("%Y-%d%m%H%M-%f") + str(check_len + 1)

            student_payment = Invoice(receipt_no=receipt_no, year=year, month='%.2f' % month, total_pay=total_pay)
            student_payment.created_by = user_id

            if "desc" in data:
                student_payment.desc = data["desc"]
            else:
                student_payment.desc = ""

            # student_payment.date_pay = datetime.now()
            student_payment.student_id = get_student.id
            db.session.add(student_payment)
            # db.session.commit()

            for x in items:
                price = '%.2f' % x["amount"]
                payment_detail = InvoiceDetail(price=price, desc=x["desc"])
                payment_detail.payment_id = student_payment.id
                db.session.add(payment_detail)
                # db.session.commit()

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
                    t = PaymentAttachment(name=filename)
                    fullfilename = os.path.join(folder, t.id)
                    if os.path.exists(fullfilename):
                        pass
                    else:
                        try:
                            os.mkdir(fullfilename)

                        except Exception as e:
                            print(e)
                    fullfilename = os.path.join(folder, t.id, filename)
                    j.save(fullfilename)

                    t.student_id = student_payment.id
                    db.session.add(t)

            description = "Yuran yang dikenekan atas pelajar " + get_student.ic_no + " BerJumlah : RM " + total_pay

            inv = Invoice.query.filter_by(receipt_no=receipt_no).first()
            parent = Parent.query.filter_by(student_id=get_student.id, type='father').first()
            if parent.email:
                email = parent.email
            else:
                email = 'theolivetreesit@gmail.com'

            if parent.phone:
                phone = parent.phone
            else:
                phone = '01156568441'

            response = create_invoice_toyyib(receipt_no, description, str(total_pay).replace('.', ''), inv.id, email,
                                             parent.name, phone)
            inv.billcode_toyyib = response

        db.session.commit()
        response = {"status": "OK"}
    except Exception as e:
        print(e)
        response = {"status": "Failed"}

    return jsonify(response)


# Inter mobile
@bp_account.route('/get_invoice', methods=['GET'])
def get_invoice():
    invoice_id = request.args.get("invoice_id")
    if not invoice_id:
        return "invoice does not exist"

    get_detail = Invoice.query.get(invoice_id)
    dictV = dict()
    dictV["invoice_no"] = get_detail.receipt_no
    dictV["student_id"] = get_detail.id
    dictV["student_ic"] = get_detail.student.ic_no
    dictV["student_name"] = get_detail.student.name
    dictV["year"] = get_detail.year
    dictV["month"] = get_detail.month
    dictV["desc"] = get_detail.desc
    dictV["is_pay"] = float(get_detail.is_pay)

    if get_detail.billcode_toyyib:
        dictV['bill_code'] = get_detail.billcode_toyyib
    else:
        dictV['bill_code'] = "None"

    get_att = PaymentAttachment.query.filter_by(student_id=get_detail.id, is_deleted=0).all()
    dictV['attachment'] = []
    if get_att:
        for k in get_att:
            list_1 = dict()
            list_1['id'] = k.id
            list_1['name'] = k.name
            dictV['attachment'].append(list_1)

    dictV['total'] = "%.2f" % float(get_detail.total_pay)
    get_detail_items = InvoiceDetail.query.filter_by(payment_id=invoice_id, is_deleted=0).all()
    dictV['invoice_detail'] = []

    if get_detail_items:

        for j in get_detail_items:
            list_1 = dict()

            list_1['id'] = j.id
            list_1['desc'] = j.desc
            list_1['check'] = "old"
            list_1['amount'] = float(j.price)
            list_1['old'] = True
            # calculation = calculation + float(j.price)
            dictV['invoice_detail'].append(list_1)
    # dictV["invoice_no"] = get_detail.receipt_no

    return jsonify(dictV)


@bp_account.route('/update_invoice', methods=['POST'])
def update_invoice():
    response = dict()
    data = json.loads(request.form['data'])
    invoice_no = request.args.get("invoice_id")

    if not invoice_no:
        return "need invoice no."

    check = Invoice.query.filter_by(id=invoice_no, is_deleted=0, is_pay=1).first()
    if check:
        return "Already pay"
    else:

        update_invoice_detail = Invoice.query.filter_by(id=invoice_no, is_deleted=0, is_pay=0)

        if update_invoice_detail:

            user_id = data['user_id']
            year = data['year']
            month = data['month']

            items = data['items']
            attachment_deleted = data['attachment_deleted']
            deleted_items = data['deleted_items']

            if "desc" in data:
                desc = data['desc']
            else:
                desc = ""

            total_pay = float(data['total_pay'])
            update_invoice_detail.update(
                dict(year=year, month=month, total_pay=total_pay, desc=desc, update_by=user_id,
                     last_update=datetime.now()))
            # db.session.commit()

            for x in items:
                if x["check"] == "new":  # Check kalau new bru add

                    payment_detail = InvoiceDetail(price=str('%.2f' % x["amount"]), desc=x["desc"])
                    payment_detail.payment_id = invoice_no
                    db.session.add(payment_detail)
                if x["check"] == "old":
                    InvoiceDetail.query.filter_by(id=x["id"]).update(
                        dict(price=str('%.2f' % x["amount"]), desc=x["desc"]))

                    # db.session.commit()
            if deleted_items:
                aa = InvoiceDetail.query.filter(InvoiceDetail.id.in_(deleted_items))
                for x in aa:
                    db.session.delete(x)
                    # db.session.commit()

            folder = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], invoice_no)
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
                    t = PaymentAttachment(name=filename)

                    fullfilename = os.path.join(folder, t.id)
                    if os.path.exists(fullfilename):
                        pass
                    else:
                        try:
                            os.mkdir(fullfilename)

                        except Exception as e:
                            print(e)
                    fullfilename = os.path.join(folder, t.id, filename)
                    j.save(fullfilename)
                    t.student_id = invoice_no
                    db.session.add(t)

            if attachment_deleted:
                bb = PaymentAttachment.query.filter(PaymentAttachment.id.in_(attachment_deleted))
                for x in bb:

                    db.session.delete(x)
                    db.session.commit()
                    try:
                        shutil.rmtree(os.path.join(folder, x.id))  # delete folder
                    except Exception as e:
                        response = {"status": "Failed"}
                        print(e)
                        return jsonify(response)
            try:
                db.session.commit()
                response = {"status": "OK"}
            except Exception as e:
                print(e)
                response = {"status": "Failed"}

        return jsonify(response)


@bp_account.route('/deleted_account/<data>', methods=['DELETE'])
def deleted_account(data):
    data = json.loads(data)
    get_list = Invoice.query.filter(Invoice.id.in_(data))
    for x in get_list:
        x.is_deleted = 1
    try:
        db.session.commit()
        response = {"status": "OK"}
    except Exception as e:
        print(e)
        response = {"status": "Failed"}

    return jsonify(response)


#########################3# TOYYIB PAY #################################################
def call_bank_toyyib():
    response = requests.get('https://toyyibpay.com/index.php/api/getBank')
    data = response.json()
    return "OK"


def create_invoice_toyyib(billName, billDesc, billAmount, billExtId, billEmail, billIC, billPhone):
    data = {
        'userSecretKey': '1wi1kc9b-8njp-w4tu-k7i3-ttftidpvbiqq',
        'categoryCode': 'amt3vw1j',
        'billName': billName,
        'billDescription': billDesc,
        'billPriceSetting': 0,
        'billPayorInfo': 0,
        'billAmount': int(billAmount),  # 100 = RM 1
        'billReturnUrl': 'https://theolivetrees.edu.my/management/login/payment_made_olive',
        'billCallbackUrl': 'https://theolivetrees.edu.my/management/login/payment_made_olive',
        'billExternalReferenceNo': billExtId,
        'billTo': billIC,
        'billEmail': billEmail,
        'billPhone': billPhone,
        'billSplitPayment': 0,
        'billSplitPaymentArgs': '',
        'billPaymentChannel': 0,
    }
    response = requests.post('https://toyyibpay.com/index.php/api/createBill', data)
    result = response.json()

    if 'BillCode' in result[0]:
        return result[0]['BillCode']
    else:
        return "Failed"


############################# mobile area ##############################################

# Inter mobile
@bp_account.route('/mobile_get_invoice', methods=['GET'])
def mobile_get_invoice():
    student_id = request.args.get("student_id")
    student = Student.query.filter_by(id=student_id).first()
    if not student:
        return "invoice does not exist"

    get_detail = Invoice.query.filter_by(student_id=student.id, is_pay=0).first()
    dictV = dict()
    if get_detail:

        dictV["invoice_no"] = get_detail.receipt_no
        # dictV["student_id"] = get_detail.id
        dictV["student_ic"] = get_detail.student.ic_no
        dictV["student_name"] = get_detail.student.name
        dictV["year"] = get_detail.year
        dictV["month"] = get_detail.month
        dictV["desc"] = get_detail.desc
        dictV["billCode"] = get_detail.billcode_toyyib
        # dictV["is_pay"] = float(get_detail.is_pay)

        get_att = PaymentAttachment.query.filter_by(student_id=get_detail.id, is_deleted=0).first()
        dictV['attachment'] = []
        if get_att:
            dictV["attachment"] = app.config[
                                      'HOSTNAME'] + "static/uploads/" + get_detail.id + '/' + get_att.id + '/' + get_att.name

        #
        dictV['total'] = "%.2f" % float(get_detail.total_pay)
        get_detail_items = InvoiceDetail.query.filter_by(payment_id=get_detail.id, is_deleted=0).all()
        dictV['invoice_detail'] = []

        if get_detail_items:

            for j in get_detail_items:
                list_1 = dict()

                # list_1['id'] = j.id
                list_1['desc'] = j.desc
                # list_1['check'] = "old"
                list_1['amount'] = "%.2f" % float(j.price)
                # list_1['old'] = True
                dictV['invoice_detail'].append(list_1)
    # dictV["invoice_no"] = get_detail.receipt_no

    return jsonify(dictV)


@bp_account.route('/mobile_get_amount', methods=['GET'])
def mobile_get_amount():
    student_id = request.args.get("student_id")
    student = Student.query.filter_by(id=student_id).first()
    if not student:
        return "invoice does not exist"

    get_detail = Invoice.query.filter_by(student_id=student.id, is_pay=0,is_deleted=0).first()
    if get_detail :
        return jsonify({'total': "%.2f" % float(get_detail.total_pay),
                    'invoice_no': get_detail.receipt_no,
                    'status': 'success'})
    else:
        return jsonify({'total': "0.00",
                    'invoice_no': 'No invoice available.',
                    'status': 'no-pending'})



@bp_account.route('/update_payment')
def update_payment():
    inv = Invoice.query.filter_by(billcode_toyyib=request.args.get("billCode")).first()
    if request.args.get("statusId") == '1':
        inv.is_pay = True
    else:
        inv.is_pay = False
     # request.args.get("statusId")
    inv.orderid_toyyib = request.args.get("orderId")
    inv.date_pay = datetime.now()
    db.session.commit()
    return "OK"


@bp_account.route('/mobile_history_payment')
def mobile_history_payment():
    student_id = request.args.get("student_id")
    student = Student.query.filter_by(id=student_id).first()
    if not student:
        return "invoice does not exist"

    get_detail = Invoice.query.filter_by(student_id=student.id, is_pay=1,is_deleted=0).order_by(Invoice.date_pay.desc()).all()
    list = dict()
    list['data'] = []
    if get_detail:
        for x in get_detail:
            dict1 = dict()
            dict1['id'] = x.id
            dict1['inv_no'] = x.receipt_no
            dict1['date_pay'] = x.date_pay.strftime("%d/%m/%Y")
            dict1['paid'] = x.total_pay
            list['data'].append(dict1)
        return jsonify({'data': list['data']})
    else:
        return jsonify({'data': list['data']})