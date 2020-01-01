import os, shutil
from datetime import timedelta, datetime
import math
from flask import Blueprint, render_template, request, jsonify, json, abort
from werkzeug.utils import secure_filename
from proj.model import *

bp_student = Blueprint('bp_student', __name__)


@bp_student.route('/list_student/<pagenum>', methods=['GET'])
def list_student(pagenum):
    student_name = request.args["student_name"]
    student_ic = request.args["student_ic"]
    student_intake = request.args["student_intake"]

    pagenum = json.loads(pagenum)

    codeSql = Student.query.filter_by(is_deleted=0)

    if student_name:
        codeSql = codeSql.filter(Student.name.like('%' + student_name + '%'))

    if student_ic:
        codeSql = codeSql.filter(Student.ic_no.like('%' + student_ic + '%'))
    if student_intake:
        codeSql = codeSql.filter(Student.intake.like('%' + student_intake + '%'))

    count_result = codeSql.order_by(Student.date_created.desc()).count()
    if count_result:
        totalpagenum = math.ceil(count_result / 10)

    else:
        totalpagenum = 0

    if totalpagenum >= int(pagenum):
        report = codeSql.order_by(Student.date_created.desc()).paginate(int(pagenum), 10)
    else:
        pagenum = int(pagenum)
        pagenum = pagenum - (pagenum - totalpagenum)
        if pagenum == 0:
            pagenum = 1
        report = codeSql.order_by(Student.date_created.desc()).paginate(int(pagenum), 10)

    # report = codeSql.order_by(Student.date_created.desc()).paginate(int(pagenum), 10)
    # count_result = codeSql.order_by(Student.date_created.desc()).count()

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

            list['data'].append(dict1)
        # totalpagenum = math.ceil(count_result / 10)
        list['totalpagenum'] = int(totalpagenum)
        list['count_result'] = str(count_result)
        return jsonify(list)


@bp_student.route('/get_student_detail', methods=['GET'])
def get_student_detail():
    id = request.args.get("id")
    x = Student.query.filter_by(is_deleted=0, ic_no=id).first()
    if x:
        dictV = dict()
        dictV["id"] = x.id
        dictV['student_ic'] = x.ic_no
        dictV['student_name'] = x.name
        dictV['student_intake'] = x.intake
        dictV['student_address'] = x.address
        # dictV['student_picture'] = x.picture
        get_father = Parent.query.filter_by(student_id=x.id, type="father").first()
        if get_father:
            dictV['father_name'] = get_father.name
            dictV['father_email'] = get_father.email
            dictV['father_phone'] = get_father.phone

        get_mother = Parent.query.filter_by(student_id=x.id, type="mother").first()
        if get_mother:
            dictV['mother_name'] = get_mother.name
            dictV['mother_email'] = get_mother.email
            dictV['mother_phone'] = get_mother.phone
        if x.picture:
            dictV["picture"] = "../static/uploads/" + x.id + "/" + x.picture
        else:
            dictV["picture"] = "../static/assets/img/theme/student.png"
        # data.append(dictV)
        return jsonify(dictV)
    return "no data"


# $scope.picture = '../static/uploads' + '/' + $scope.id + '/' + $scope.student_picture;

@bp_student.route('/add', methods=['POST'])
def add():
    data = json.loads(request.form["data"])

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

    student = Student.query.filter_by(ic_no=student_ic).first()
    if student:
        student.is_deleted = 0
        student.date_created = datetime.now()

    else:
        student = Student(name=student_name, ic_no=student_ic, intake=intake, address=student_address,
                          password=student_ic)
        db.session.add(student)
        father = Parent(type="father", name=father_name, phone=father_contact, email=father_email)
        father.student_id = student.id
        db.session.add(father)

        mother = Parent(type="mother", name=mother_name, phone=mother_contact, email=mother_email)
        mother.student_id = student.id
        db.session.add(mother)
    folder = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], student.id)
    if os.path.exists(folder):
        pass
    else:
        try:
            os.mkdir(folder)

        except Exception as e:
            print(e)
    if student.picture:
        check = os.path.join(folder, student.picture)
        exists = os.path.isfile(check)
        if exists:
            os.remove(os.path.join(folder, student.picture))

    if 'file' in request.files:
        file = request.files['file']
        if 'image' in file.content_type:
            filename = secure_filename(file.filename)
            fullfilename = os.path.join(folder, filename)
            file.save(fullfilename)
            student.picture = filename
    db.session.add(student)

    try:
        db.session.commit()
        response['status'] = 'OK'
    except Exception as e:
        print(e)
        response['status'] = 'Failed=' + str(e)

    return jsonify(response)


@bp_student.route('/update_student', methods=['POST'])
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

    Student.query.filter_by(id=id).update(dict(name=student_name, ic_no=student_ic, intake=intake,
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
            if student.picture:
                check = os.path.join(folder, student.picture)
                exists = os.path.isfile(check)
                if exists:
                    os.remove(os.path.join(folder, student.picture))
            student.picture = filename
            file.save(fullfilename)
            # db.session.commit()

    try:
        db.session.commit()
        response['status'] = 'OK'
    except Exception as e:
        print(e)
        response['status'] = 'Failed=' + str(e)

    return jsonify(response)


@bp_student.route('/delete_student', methods=['POST'])
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
            i.is_deleted = 1
        try:

            db.session.commit()
            response['status'] = 'OK'
        except Exception as e:
            response['status'] = 'FAILED'

    return jsonify(response)


@bp_student.route('/get_student_list', methods=['GET'])
def get_student_list():
    get_student = Student.query.filter_by(is_deleted=0).all()
    data = []
    for x in get_student:
        dictV = dict()
        dictV["id"] = x.id
        dictV["ic_no"] = x.ic_no
        dictV["name"] = x.name
        # dictV["path"] = "../static/uploads/" + x.id + "/" + x.picture
        data.append(dictV)
    return jsonify(data)


################################### BAHAGIAN EVENT ############################################;


@bp_student.route('/add_event', methods=['POST'])
def add_event():
    data = json.loads(request.form["data"])

    ic_no = data["student_detail"]
    date_event = data["date_event"]
    desc = data["desc"]
    response = dict()

    student = Student.query.filter_by(ic_no=ic_no["ic_no"]).first()

    if student:
        if not desc:
            desc = "None"
        date_report = datetime.strptime(date_event, '%d %B %Y')
        add_event = StudentEvent(remark=desc, date=date_report)
        add_event.student_id = student.id
        db.session.add(add_event)
        folder = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], student.id)
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
                t = StudentEventAttachment(name=filename)
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
                t.event_id = add_event.id
                db.session.add(t)
                # db.session.commit()
    try:
        db.session.commit()
        response['status'] = 'OK'
    except Exception as e:
        print(e)
        response['status'] = 'Failed=' + str(e)

    return jsonify(response)


@bp_student.route('/list_event/<pagenum>', methods=['GET'])
def list_event(pagenum):
    student_name = request.args["student_name"]
    student_ic = request.args["student_ic"]
    desc = request.args["desc"]
    date_selected = request.args["date_selected"]

    pagenum = json.loads(pagenum)

    codeSql = StudentEvent.query

    if student_name:
        codeSql = codeSql.filter(Student.name.like('%' + student_name + '%')).join(Student,
                                                                                   Student.id == StudentEvent.student_id)

    if student_ic:
        codeSql = codeSql.filter(Student.ic_no.like('%' + student_ic + '%')).join(Student,
                                                                                  Student.id == StudentEvent.student_id)

    if desc:
        codeSql = codeSql.filter(StudentEvent.remark.like('%' + desc + '%'))

    if date_selected:
        date_selected = datetime.strptime(date_selected, '%d %B %Y')
        date_report_from = str(date_selected.strftime("%Y-%m-%d ")) + "00:00"
        date_report_to = str(date_selected.strftime("%Y-%m-%d ")) + "23:59"
        codeSql = codeSql.filter(StudentEvent.date.between(date_report_from, date_report_to))

    count_result = codeSql.order_by(StudentEvent.date.desc()).count()
    if count_result:
        totalpagenum = math.ceil(count_result / 10)

    else:
        totalpagenum = 0

    if totalpagenum >= int(pagenum):
        report = codeSql.order_by(StudentEvent.date.desc()).paginate(int(pagenum), 10)
    else:
        pagenum = int(pagenum)
        pagenum = pagenum - (pagenum - totalpagenum)
        if pagenum == 0:
            pagenum = 1
        report = codeSql.order_by(StudentEvent.date.desc()).paginate(int(pagenum), 10)

    if not report:
        return "Report does not exist"
    else:
        list = dict()
        list['data'] = []
        for x in report.items:
            dict1 = dict()
            dict1['id'] = x.id
            dict1['student_ic'] = x.student.ic_no
            dict1['student_name'] = x.student.name
            dict1['desc'] = x.remark
            dict1['date_selected'] = x.date.strftime("%a,%d %b %Y")

            list['data'].append(dict1)
        # totalpagenum = math.ceil(count_result / 10)
        list['totalpagenum'] = int(totalpagenum)
        list['count_result'] = str(count_result)
        return jsonify(list)


@bp_student.route('/get_event_detail', methods=['GET'])
def get_event_detail():
    id = request.args.get("id")
    x = StudentEvent.query.filter_by(id=id).first()
    if x:
        dictV = dict()
        dictV["id"] = x.id
        dictV['student_ic'] = x.student.ic_no
        dictV['student_name'] = x.student.name
        dictV['date_event'] = x.date.strftime("%d %B %Y")
        dictV['desc'] = x.remark
        dictV['attachment'] = []
        get_file = StudentEventAttachment.query.filter_by(event_id=x.id).all()
        if get_file:
            for f in get_file:
                dictV1 = dict()
                dictV1["id"] = f.id
                dictV1["name"] = f.name
                dictV1["path"] = "../static/uploads/" + x.student.id + "/" + f.id + "/" + f.name
                dictV['attachment'].append(dictV1)

        return jsonify(dictV)
    return "no data"


@bp_student.route('/update_event', methods=['POST'])
def update_event():
    # response = dict()
    id = request.args.get("id")
    data = json.loads(request.form['data'])
    attachment_deleted = data["attachment_deleted"]

    if not id:
        return "need id"  #
    if not data["student_ic"]:
        return "need ic"
    check = StudentEvent.query.filter_by(id=id).first()
    if check:
        update_event = StudentEvent.query.filter_by(id=id)
        date = datetime.strptime(data["date_event"], '%d %B %Y')
        update_event.update(dict(remark=data["desc"], date=date))

        folder = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], check.student.id)
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
                t = StudentEventAttachment(name=filename)
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
                t.event_id = check.id
                db.session.add(t)
                db.session.commit()
        #
        if attachment_deleted:
            bb = StudentEventAttachment.query.filter(StudentEventAttachment.id.in_(attachment_deleted))
            for x in bb:
                db.session.delete(x)
                db.session.commit()
                try:
                    shutil.rmtree(os.path.join(folder, x.id))  # delete folder
                except Exception as e:
                    # response = {"status": "Failed"}
                    print(e)
        response = {"status": "OK"}
        db.session.commit()
        return jsonify(response)
    return "no data"


@bp_student.route('/delete_event/<data>', methods=['DELETE'])
def delete_event(data):
    data = json.loads(data)
    get_list = StudentEvent.query.filter(StudentEvent.id.in_(data))
    for x in get_list:
        folder = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], x.student.id)
        get_att = StudentEventAttachment.query.filter_by(event_id=x.id).all()
        for f in get_att:
            shutil.rmtree(os.path.join(folder, f.id))
        db.session.delete(x)
    try:
        db.session.commit()
        response = {"status": "OK"}
    except Exception as e:
        print(e)
        response = {"status": "Failed"}

    return jsonify(response)


############################# mobile area ################################################

@bp_student.route('/mobile_get_student_detail', methods=['GET'])
def mobile_get_student_detail():
    id = request.args.get("id")
    x = Student.query.filter_by(is_deleted=0, ic_no=id).first()
    if x:
        dictV = dict()
        dictV["id"] = x.id
        dictV['student_ic'] = x.ic_no
        dictV['student_name'] = x.name
        dictV['student_intake'] = x.intake
        dictV['student_address'] = x.address
        # dictV['student_picture'] = x.picture
        get_father = Parent.query.filter_by(student_id=x.id, type="father").first()
        if get_father:
            dictV['father_name'] = get_father.name
            dictV['father_email'] = get_father.email
            dictV['father_phone'] = get_father.phone

        get_mother = Parent.query.filter_by(student_id=x.id, type="mother").first()
        if get_mother:
            dictV['mother_name'] = get_mother.name
            dictV['mother_email'] = get_mother.email
            dictV['mother_phone'] = get_mother.phone
        if x.picture:
            dictV["picture"] = "../static/uploads/" + x.id + "/" + x.picture
        else:
            dictV["picture"] = "../static/assets/img/theme/student.png"
        # data.append(dictV)
        return jsonify(dictV)
    return "no data"
