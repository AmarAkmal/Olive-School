from proj import app, db
from sqlalchemy.ext import mutable
from flask import json
import uuid
from sqlalchemy.dialects.mysql import MEDIUMTEXT


class JsonEncodedDict(db.TypeDecorator):
    """Enables JSON storage by encoding and decoding on the fly."""
    impl = db.Text

    def process_bind_param(self, value, dialect):
        if value is None:
            return '{}'
        else:
            return json.dumps(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return {}
        else:
            return json.loads(value)


class User(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    name = db.Column(db.String(250))
    phone = db.Column(db.String(100), unique=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    is_deleted = db.Column(db.Boolean, default=0)
    created_invoice = db.relationship("Invoice", backref="user1", foreign_keys="[Invoice.created_by]",
                                      cascade="all, delete-orphan")
    update_by = db.relationship("Invoice", backref="user2", foreign_keys="[Invoice.update_by]",
                                cascade="all, delete-orphan")

    created_result = db.relationship("ResultAcademic", backref="result_academic", cascade="all, delete-orphan")

    def __init__(self, name, email, role, password):
        self.id = uuid.uuid4().hex
        self.name = name
        self.email = email
        self.role = role
        self.password = password


class Student(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    ic_no = db.Column(db.String(32))
    name = db.Column(db.String(300))
    intake = db.Column(db.String(32))
    password = db.Column(db.String(100))
    address = db.Column(db.TEXT)
    picture = db.Column(db.String(300))
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    parent_detail = db.relationship("Parent", backref="student", cascade="all, delete-orphan")
    academic_iep = db.relationship("AcademicIep", backref="student", cascade="all, delete-orphan")
    aideed_id = db.relationship("Aideed", backref="student", cascade="all, delete-orphan")
    payment_detail = db.relationship("Invoice", backref="student", cascade="all, delete-orphan")
    event = db.relationship("StudentEvent", backref="student",
                            cascade="all, delete-orphan")

    is_deleted = db.Column(db.Boolean, default=0)

    def __init__(self, name, ic_no, intake, address, password):
        self.id = uuid.uuid4().hex
        self.ic_no = ic_no
        self.name = name
        self.intake = intake
        self.password = password
        self.address = address


class Parent(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    type = db.Column(db.String(32))
    name = db.Column(db.String(500))
    phone = db.Column(db.String(100))
    email = db.Column(db.String(500))
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    student_id = db.Column(db.ForeignKey('student.id', ondelete="CASCADE", onupdate="CASCADE"))
    is_deleted = db.Column(db.Boolean, default=1)

    def __init__(self, type, name, phone, email):
        self.id = uuid.uuid4().hex
        self.type = type
        self.name = name
        self.phone = phone
        self.email = email


class Invoice(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    receipt_no = db.Column(db.String(32))
    year = db.Column(db.String(32))
    month = db.Column(db.String(32))
    desc = db.Column(db.TEXT)
    payment_detail = db.relationship("InvoiceDetail", backref="invoice", cascade="all, delete-orphan")
    attchement_detail = db.relationship("PaymentAttachment", backref="invoice", cascade="all, delete-orphan")
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())

    student_id = db.Column(db.ForeignKey('student.id', ondelete="CASCADE", onupdate="CASCADE"))
    created_by = db.Column(db.ForeignKey('user.id', ondelete="CASCADE", onupdate="CASCADE"))
    last_update = db.Column(db.DateTime)
    update_by = db.Column(db.ForeignKey('user.id', ondelete="CASCADE", onupdate="CASCADE"))

    total_pay = db.Column(db.String(32))
    billcode_toyyib = db.Column(db.String(100))
    orderid_toyyib = db.Column(db.String(100))
    transactionid_toyyib = db.Column(db.String(100))
    date_pay = db.Column(db.DateTime)

    is_pay = db.Column(db.Boolean, default=0)
    is_deleted = db.Column(db.Boolean, default=0)

    def __init__(self, receipt_no, year, month, total_pay):
        self.id = uuid.uuid4().hex
        self.receipt_no = receipt_no
        self.year = year
        self.month = month
        self.total_pay = total_pay


class InvoiceDetail(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    type = db.Column(db.String(32))
    desc = db.Column(db.TEXT)
    price = db.Column(db.String(32))
    payment_id = db.Column(db.ForeignKey('invoice.id', ondelete="CASCADE", onupdate="CASCADE"))
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    is_deleted = db.Column(db.Boolean, default=0)

    def __init__(self, price, desc):
        self.id = uuid.uuid4().hex
        self.price = price
        self.desc = desc


class PaymentAttachment(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    name = db.Column(db.String(250))
    student_id = db.Column(db.ForeignKey('invoice.id', ondelete="CASCADE", onupdate="CASCADE"))
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    is_deleted = db.Column(db.Boolean, default=0)

    def __init__(self, name):
        self.id = uuid.uuid4().hex
        self.name = name


class AcademicIep(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    year = db.Column(db.String(32))
    desc = db.Column(MEDIUMTEXT)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    is_deleted = db.Column(db.Boolean, default=0)
    student_id = db.Column(db.ForeignKey('student.id', ondelete="CASCADE", onupdate="CASCADE"))

    def __init__(self, desc, year):
        self.id = uuid.uuid4().hex
        self.year = year
        self.desc = desc


class StudentEvent(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    remark = db.Column(db.TEXT)
    date = db.Column(db.DateTime)
    student_id = db.Column(db.ForeignKey('student.id', ondelete="CASCADE", onupdate="CASCADE"))
    attachment = db.relationship("StudentEventAttachment", backref="student_event_attachment",
                                 cascade="all, delete-orphan")
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __init__(self, remark, date):
        self.id = uuid.uuid4().hex
        self.remark = remark
        self.date = date


class StudentEventAttachment(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    name = db.Column(db.String(300))
    event_id = db.Column(db.ForeignKey('student_event.id', ondelete="CASCADE", onupdate="CASCADE"))
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __init__(self, name):
        self.id = uuid.uuid4().hex
        self.name = name


class ResultAcademic(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    subject = db.Column(db.String(100))
    band = db.Column(db.String(100))
    comment = db.Column(db.String(100))
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    created_by = db.Column(db.ForeignKey('user.id', ondelete="CASCADE", onupdate="CASCADE"))
    student_id = db.Column(db.ForeignKey('student.id', ondelete="CASCADE", onupdate="CASCADE"))
    result_detail_id = db.relationship("ResultDetail", backref="result_detail",
                                       cascade="all, delete-orphan")


class ResultDetail(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    skill = db.Column(db.String(100))
    band = db.Column(db.String(100))
    comment = db.Column(db.String(100))
    academic_id = db.Column(db.ForeignKey('result_academic.id', ondelete="CASCADE", onupdate="CASCADE"))


class Subject(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    name = db.Column(db.String(100))
    skill_id = db.relationship("Skill", backref="subject",
                               cascade="all, delete-orphan")
    payment_detail = db.relationship("Band", backref="subject", cascade="all, delete-orphan")

    # band_id = db.relationship("Band", backref="band",
    #                           cascade="all, delete-orphan")

    def __init__(self, name):
        self.id = uuid.uuid4().hex
        self.name = name


class Skill(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    name = db.Column(db.String(100))
    sort = db.Column(db.Integer)
    subject_id = db.Column(db.ForeignKey('subject.id', ondelete="CASCADE", onupdate="CASCADE"))

    def __init__(self, name, sort):
        self.id = uuid.uuid4().hex
        self.name = name
        self.sort = sort


class Band(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    comment = db.Column(db.String(500))
    band = db.Column(db.Integer)
    subj_id = db.Column(db.ForeignKey('subject.id', ondelete="CASCADE", onupdate="CASCADE"))

    def __init__(self, comment, band):
        self.id = uuid.uuid4().hex
        self.comment = comment
        self.band = band


class Aideed(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    classB = db.Column(db.String(200))
    code = db.Column(db.String(100))
    body = db.Column(JsonEncodedDict)
    is_deleted = db.Column(db.Boolean, default=0)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    student_id = db.Column(db.ForeignKey('student.id', ondelete="CASCADE", onupdate="CASCADE"))

    def __init__(self, classB, code):
        self.id = uuid.uuid4().hex
        self.classB = classB
        self.code = code
