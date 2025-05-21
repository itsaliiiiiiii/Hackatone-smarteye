from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


from .Agency import Agency
from .User import User
from .AgencyProblemType import AgencyProblemType
from .City import City
from .Report import Report


