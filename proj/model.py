from proj import app, db
from sqlalchemy.ext import mutable
import uuid


class User(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    name = db.Column(db.String(250))
    phone = db.Column(db.String(100), unique=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    is_deleted = db.Column(db.Boolean, default=0)

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
    academy_detail = db.relationship("Academy", backref="student", cascade="all, delete-orphan")
    payment_detail = db.relationship("Invoice", backref="student", cascade="all, delete-orphan")

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
        # self.email = phone


class Invoice(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    receipt_no = db.Column(db.String(32))
    year = db.Column(db.String(32))
    month = db.Column(db.String(32))
    desc = db.Column(db.TEXT)
    payment_detail = db.relationship("InvoiceDetail", backref="invoice", cascade="all, delete-orphan")
    attchement_detail = db.relationship("PaymentAttachment", backref="invoice", cascade="all, delete-orphan")
    student_id = db.Column(db.ForeignKey('student.id', ondelete="CASCADE", onupdate="CASCADE"))
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    total_pay = db.Column(db.Float)
    date_pay = db.Column(db.DateTime)
    is_pay = db.Column(db.Boolean, default=0)
    is_deleted = db.Column(db.Boolean, default=1)

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


class Academy(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    desc = db.Column(db.TEXT)
    amount = db.Column(db.TEXT)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    student_id = db.Column(db.ForeignKey('student.id', ondelete="CASCADE", onupdate="CASCADE"))
    is_deleted = db.Column(db.Boolean, default=0)

    def __init__(self, desc, amount):
        self.id = uuid.uuid4().hex
        self.desc = desc
        self.amount = amount


class AcademyDetail(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    name = db.Column(db.String(250))
    grade = db.Column(db.String(25))
    desc = db.Column(db.TEXT)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    is_deleted = db.Column(db.Boolean, default=0)

    def __init__(self, name, grade):
        self.id = uuid.uuid4().hex
        self.name = name
        self.grade = grade
