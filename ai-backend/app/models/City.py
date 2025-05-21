from . import db
from datetime import datetime


class City(db.Model):
    __tablename__ = 'Cities'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
   
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    users = db.relationship('User', backref='city', lazy=True)
    agencies = db.relationship('Agency', backref='city', lazy=True)
    reports = db.relationship('Report', backref='city', lazy=True)