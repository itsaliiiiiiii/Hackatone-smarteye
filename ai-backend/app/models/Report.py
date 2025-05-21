from . import db
from datetime import datetime

class Report(db.Model):
    __tablename__ = 'Reports'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    dangerType = db.Column(db.String(255))
    problemType = db.Column(db.String(255), nullable=False)
    image = db.Column(db.Text, nullable=True)
    image_annoter = db.Column(db.Text, nullable=True)
    description = db.Column(db.Text, nullable=True)
    location = db.Column(db.JSON, nullable=False)
    status = db.Column(db.Enum('pending', 'in_progress', 'resolved', name='report_status'), default='pending')
    priority = db.Column(db.Enum('low', 'medium', 'high', name='report_priority'), default='medium')
    UserId = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=True)
    CityId = db.Column(db.Integer, db.ForeignKey('Cities.id'), nullable=True)
    AgencyId = db.Column(db.Integer, db.ForeignKey('Agencies.id'), nullable=True)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)