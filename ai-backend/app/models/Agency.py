from . import db
from datetime import datetime

class Agency(db.Model):
    __tablename__ = 'Agencies'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255))

    workDomain = db.Column(db.String(255))
    username = db.Column(db.String(255),unique=True)
    password = db.Column(db.String(255))
  
    address = db.Column(db.String(255))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(255))
    problem_types = db.Column(db.String(255))
    CityId = db.Column(db.Integer, db.ForeignKey('Cities.id'), nullable=True)
    
    #problem_types = db.relationship('AgencyProblemType', backref='agency', lazy=True)
    reports = db.relationship('Report', backref='agency', lazy=True)