from . import db
from datetime import datetime

class Report(db.Model):
    __tablename__ = 'Reports'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    problemType = db.Column(db.String(255))
    image = db.Column(db.Text(length=4294967295), nullable=True)
    image_annoter = db.Column(db.Text(length=4294967295), nullable=True)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.Enum('pending', 'in_progress', 'resolved', name='report_status'), default='pending')
    priority = db.Column(db.Enum('low', 'medium', 'high', name='report_priority'), default='medium')
    UserId = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=True)
    CityId = db.Column(db.Integer, db.ForeignKey('Cities.id'), nullable=True)
    AgencyId = db.Column(db.Integer, db.ForeignKey('Agencies.id'), nullable=True)
