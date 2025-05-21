from . import db 
from datetime import datetime

class User(db.Model):
    __tablename__ = 'Users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cin = db.Column(db.String(255), nullable=False, unique=True)
    fullName = db.Column(db.String(255), nullable=False)
    phoneNumber = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    
    CityId = db.Column(db.Integer, db.ForeignKey('Cities.id'), nullable=True)
    reports = db.relationship('Report', backref='user', lazy=True)