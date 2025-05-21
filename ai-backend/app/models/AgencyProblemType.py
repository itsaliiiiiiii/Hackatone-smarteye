from . import db

class AgencyProblemType(db.Model):
    __tablename__ = 'AgencyProblemTypes'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    AgencyId = db.Column(db.Integer, db.ForeignKey('Agencies.id'), nullable=False)
    problemType = db.Column(db.String(255), nullable=False)