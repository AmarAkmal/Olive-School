import os
from datetime import timedelta, datetime
import math
from flask import Blueprint, render_template, request, jsonify, json, abort
from werkzeug.utils import secure_filename
from proj.model import *

bp_student = Blueprint('bp_student', __name__)


@bp_student.route('/list_student/<pagenum>', methods=['GET'])
def list_student(pagenum):
    # print(keyword)
    # print(pagenum)

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


@bp_student.route('/add', methods=['POST'])
def add():
    data = json.loads(request.form["data"])
    print(data)

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


@bp_student.route('/delete', methods=['POST'])
def delete():
    response = dict()
    try:
        data = json.loads(request.form['data'])

        users = User.query.filter(User.id.in_(data['id'])).all()
    except Exception as e:
        print(e)
        response['status'] = 'PARAM_VIOLATION'
        return jsonify(response)

    if len(users) == 0:
        return "User does not exist"
    else:

        for i in users:
            i.is_deleted = 1
            i.email += '#Software#' + datetime.now().strftime('%Y%m%d%H%M%S')
            i.phone += '#Software#' + datetime.now().strftime('%Y%m%d%H%M%S')
            i.staff_id += '#Software#' + datetime.now().strftime('%Y%m%d%H%M%S')
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


@bp_student.route('/list', methods=['GET', 'POST'])
def list():
    response = dict()
    # try:
    name = request.form['name']
    email = request.form['email']
    staff_id = request.form['staff_id']
    phone = request.form['phone']
    department = request.form['department']
    designation = request.form['designation']
    pagenum = request.form['pagenum']

    codeSql = User.query.filter_by(is_deleted=0)
    if staff_id:
        codeSql = codeSql.filter(User.staff_id.like('%' + staff_id + '%'))
    if name:
        codeSql = codeSql.filter(User.name.like('%' + name + '%'))
    if email:
        codeSql = codeSql.filter(User.email.like('%' + email + '%'))
    if phone:
        codeSql = codeSql.filter(User.phone.like('%' + phone + '%'))
    if department and department != 'All':
        print("SS2")
        codeSql = codeSql.filter(Department.name.like('%' + department + '%')).join(Department,
                                                                                    Department.id == User.department_id)
    if designation and designation != 'All':
        print("SS")
        codeSql = codeSql.filter(Designation.name.like('%' + designation + '%')).join(Designation,
                                                                                      Designation.id == User.designation_id)

    # if role_id:
    #     codeSql = codeSql.filter(Role.name.like('%' + role_id + '%')).join(Role, Role.id == User.role_id)

    user = codeSql.order_by(User.staff_id).paginate(int(pagenum), 10)
    userCount = codeSql.order_by(User.staff_id).count()
    print(userCount)

    data1 = dict()
    data1['data'] = []

    for i in user.items:
        dictV = dict()
        dictV['id'] = i.id
        dictV['id2'] = i.id
        dictV['name'] = i.name
        dictV['email'] = i.email
        dictV['phone'] = i.phone
        dictV['staff_id'] = i.staff_id
        if i.department:
            dictV['department'] = i.department.name
        else:
            dictV['department'] = "None"
        dictV['designation'] = i.designation.name
        # dictV['role_id'] = i.role.name
        data1['data'].append(dictV)
    userCount = math.ceil(userCount / 10)
    data1['count'] = str(userCount)
    return jsonify(data1)

    # except Exception as e:
    #     print(e)
    #     return "FAILED"


@bp_student.route('/update', methods=['POST', 'GET'])
def update():
    response = dict()

    try:
        id = request.args.get("userid")

    except Exception as e:
        print(e)
        response['status'] = 'PARAM_VIOLATION'
        return jsonify(response)

    if request.method == 'POST':
        try:
            data = request.form["data"]
            data = json.loads(data)

            check_role = Role.query.filter_by(id=data['role_user']).first()
            check_lead = Department.query.filter_by(id=data['dept']).all()

            check = {}
            dept = {}
            for x in check_lead:
                check = x.leader_id
                dept = x.name

            if check_role.name == 'Leader':
                if check is None:
                    dep = Department.query.filter_by(leader_id=data['id']).first()

                    if dep:
                        if dep.id != data["dept"]:
                            Department.query.filter_by(id=dep.id).update(
                                dict(leader_id=None))
                            Department.query.filter_by(id=data["dept"]).update(
                                dict(leader_id=id))
                    else:
                        Department.query.filter_by(id=data["dept"]).update(
                            dict(leader_id=id))

                elif check == data['id']:
                    pass
                else:
                    output = {"status": 'Exist', "dept": dept}
                    return jsonify(output)
            elif check == data['id']:
                if check_role.name != 'Leader':
                    Department.query.filter_by(id=data["dept"]).update(
                        dict(leader_id=None))

            if 'role_user' in data:
                role = Role.query.filter_by(id=data["role_user"]).first()
            else:
                role = None

            dept = Department.query.get(data["dept"])
            designation = Designation.query.get(data["designation"])

            counter_staffid = 0
            counter_email = 0
            counter_phone = 0

            user = User.query.filter_by(id=id).first()
            alluser = User.query.all()

            for x in alluser:
                if x.id != data['id']:
                    if x.staff_id == data['staff_id']:
                        counter_staffid = 1
                    if x.email == data['email']:
                        counter_email = 1
                    if x.phone == data['phone']:
                        counter_phone = 1

            if counter_staffid == 1:
                result = "Staff Id Already Exist"

            elif counter_phone == 1:
                result = "Phone Already Exist"

            elif counter_email == 1:
                result = "Email Already Exist"
            else:
                date_convert = datetime.strptime(data["date_joined"], '%d-%m-%Y')

                if data['access_feature'] != []:
                    User.query.filter_by(id=id).update(
                        dict(name=data['name'], phone=data['phone'], staff_id=data["staff_id"], email=data["email"],
                             date_joined=date_convert, access_feature=data["access_feature"]))
                else:
                    User.query.filter_by(id=id).update(
                        dict(name=data['name'], phone=data['phone'], staff_id=data["staff_id"], email=data["email"],
                             date_joined=date_convert, access_feature=''))

                # if 'password' in data and user.password != data['password']:
                #     user.password = data['password']

                if role:
                    role.role_user.append(user)

                if dept:
                    dept.department_user.append(user)

                if designation:
                    designation.designation_user.append(user)

                user.date_modified = datetime.now()

                folder = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], user.id)

                if os.path.exists(folder):
                    if 'file' in request.files:
                        file = request.files['file']
                        filename = secure_filename(file.filename)
                        fullfilename = os.path.join(folder, filename)
                        file.save(fullfilename)
                        user.picture = filename
                else:
                    try:
                        os.mkdir(folder)
                        if 'file' in request.files:
                            file = request.files['file']
                            filename = secure_filename(file.filename)
                            fullfilename = os.path.join(folder, filename)
                            file.save(fullfilename)
                            user.picture = filename
                    except Exception as e:
                        print(e)

                try:
                    db.session.commit()
                    result = 'OK'
                except Exception as e:
                    print(e)
                    result = 'Failed'
                return jsonify({'status': result})

            # userV = User.query.get(id)

            output = {"status": result}
            return jsonify(output)
        except Exception as e:
            print(e)
            response['status'] = 'PARAM_VIOLATION'
            return jsonify(response)


@bp_student.route('/update_profile', methods=['POST'])
def update_profile():
    response = dict()

    id = request.args.get("id")
    data = json.loads(request.form['data'])
    response['status'] = 'PARAM_VIOLATION'
    user = User.query.get(id)

    if not user:
        return jsonify({'status': 'User not exist'})

    # if 'password' in data and data['password'] != '' and user.password != data['password']:
    #     user.password = data['password']

    if 'phone' in data:
        user.phone = data['phone']

    folder = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], user.id)

    if not os.path.exists(folder):
        try:
            os.mkdir(folder)
        except Exception as e:
            print(e)

    if 'file' in request.files:
        file = request.files['file']
        if 'image' in file.content_type:
            filename = secure_filename(file.filename)
            fullfilename = os.path.join(folder, filename)
            file.save(fullfilename)
            user.picture = filename

    response = {}
    try:
        db.session.commit()

        try:

            db.session.commit()

        except Exception as e:
            print(e)
            response['status'] = 'Failed'
            return jsonify(response)

        response['status'] = 'OK'

    except Exception as e:
        print(e)
        response['status'] = 'Failed'

    return jsonify(response)


@bp_student.route('/view', methods=['POST', 'GET'])
def view():
    id = request.args.get('id')

    if not id:  # check jika id ini wujud ke tak
        return "Need ID"
    else:
        user = User.query.get(id)
        if not user:
            return jsonify({'status': "User does not exist"})
        else:

            dictV = dict()
            dictV['id'] = user.id
            dictV['staff_id'] = user.staff_id
            dictV['name'] = user.name
            dictV['phone'] = user.phone
            dictV['email'] = user.email
            dictV['role'] = user.role.name
            dictV['date_joined'] = user.date_joined.strftime("%d-%m-%Y")
            dictV['department'] = user.department.name
            dictV['designation'] = user.designation.name
            if user.picture:
                dictV['picture'] = user.picture

                # if user.role_id:
                #     dictV['role_user'] = user.role.name
        # if user.picture:
        #     dictV['picture'] = user.picture.name

        return jsonify(dictV)


@bp_student.route('/search_email', methods=['POST', 'GET'])
def search_email():
    response = dict()

    try:
        status = User.query.filter_by(email=request.args.get("email")).first()
    except Exception as e:
        print(e)
        response['status'] = 'PARAM_VIOLATION'
        # auditTrail(request.args.get('id'), 'PARAM_VIOLATION')
        return jsonify(response)

    if status:
        email = {"email": 'Ok'}
    else:
        email = {"email": 'failed'}

    return jsonify(email)


@bp_student.route('/search_user_id', methods=['POST', 'GET'])
def search_user_id():
    response = dict()

    try:
        status = User.query.filter_by(staff_id=request.args.get("staff_id")).first()
    except Exception as e:
        print(e)
        response['status'] = 'PARAM_VIOLATION'
        # auditTrail(request.args.get('id'), 'PARAM_VIOLATION')
        return jsonify(response)

    if status:
        staff_id = {"staff_id": 'Ok'}
    else:
        staff_id = {"staff_id": 'failed'}

    return jsonify(staff_id)


@bp_student.route('/search_phone', methods=['POST', 'GET'])
def search_phone():
    response = dict()
    try:
        status = User.query.filter_by(phone=request.args.get("phone")).first()
    except Exception as e:
        print(e)
        response['status'] = 'PARAM_VIOLATION'
        # auditTrail(request.args.get('id'), 'PARAM_VIOLATION')
        return jsonify(response)

    if status:
        phone = {"phone": 'Ok'}
    else:
        phone = {"phone": 'failed'}

    return jsonify(phone)


@bp_student.route('/search_role')
def search_role():
    status = Role.query.all()
    role_user = []

    for i in status:
        dictV = dict()
        dictV['id'] = i.id
        dictV['name'] = i.name

        role_user.append(dictV)

    return jsonify(role_user)


@bp_student.route('/search_department')
def search_department():
    status = Department.query.filter_by(is_deleted=0).order_by(Department.name.asc())
    dept = []

    for i in status:
        dictV = dict()
        dictV['id'] = i.id
        dictV['name'] = i.name

        dept.append(dictV)

    return jsonify(dept)


@bp_student.route('/search_designation')
def search_designation():
    status = Designation.query.filter_by(is_deleted=0).order_by(Designation.name.asc())
    desig = []

    for i in status:
        dictV = dict()
        dictV['id'] = i.id
        dictV['name'] = i.name

        desig.append(dictV)

    return jsonify(desig)


@bp_student.route('/view_temp', methods=['POST', 'GET'])
def view_temp():
    # response = dict()

    staff_id = request.args.get('id_item')
    if not staff_id:
        return "Need ID"
    else:
        user = User.query.get(staff_id)
        if not user:
            return jsonify({'status': "User does not exist"})
        else:

            dictV = dict()
            dictV['id'] = user.id
            dictV['staff_id'] = user.staff_id
            dictV['name'] = user.name
            dictV['phone'] = user.phone
            dictV['email'] = user.email
            dictV['date_joined'] = user.date_joined.strftime("%d-%m-%Y")
            dictV['access_feature'] = user.access_feature

            if user.department_id:
                dictV['dept'] = {'id': user.department.id, 'name': user.department.name}

            if user.designation_id:
                dictV['designation'] = {'id': user.designation.id, 'name': user.designation.name}

            if user.role_id:
                dictV['role_user'] = {'id': user.role.id, 'name': user.role.name}

        if user.picture:
            dictV['picture'] = user.picture

    return jsonify(dictV)


@bp_student.route('/search_user')
def search_user():
    user = User.query.filter_by(is_deleted=0)
    desig = []
    for i in user:
        desig.append(i.as_dict())
    return jsonify(desig)


@bp_student.route('/search_team_member')
def search_team_member():
    project_id = request.args.get('project_id')
    team = TeamMember.query.filter_by(project_id=project_id).all()
    desig = []
    for i in team:
        desig.append(i.as_dict())
    return jsonify(desig)


@bp_student.route('/get_name')
def get_name():
    user = User.query.get(request.args.get('id'))
    if not user:
        return "No User"
    else:
        return user.name


@bp_student.route('/list_log', methods=['POST', 'GET'])
def list_log():
    # name = request.form['name']
    email = request.form['email']
    ip = request.form['ip']
    desc = request.form['desc']
    date_time = request.form['date_time']
    pagenum = request.form['pagenum']

    codeSql = Log.query
    # if staff_id:
    #     codeSql = codeSql.filter(Log.staff_id.like('%' + staff_id + '%'))
    if ip:
        codeSql = codeSql.filter(Log.ip.like('%' + ip + '%'))
    if email:
        codeSql = codeSql.filter(Log.user_email.like('%' + email + '%'))

    if desc:
        codeSql = codeSql.filter(Log.description.like('%' + desc + '%'))

    if date_time:
        codeSql = codeSql.filter(Log.dipartment_name.like('%' + date_time + '%'))

    user = codeSql.order_by(Log.date_time.desc()).paginate(int(pagenum), 20)
    userCount = codeSql.order_by(Log.date_time.desc()).count()

    data = dict()
    data['data'] = []

    for i in user.items:
        dictV = dict()
        dictV['ip'] = i.ip
        dictV['name'] = i.user_name
        dictV['email'] = i.user_email
        dictV['staff_id'] = i.staff_id
        dictV['department'] = i.dipartment_name
        dictV['description'] = i.description
        dictV['date_time'] = i.date_time
        data['data'].append(dictV)
    userCount = math.ceil(userCount / 20)
    data['count'] = str(userCount)

    return jsonify(data)
