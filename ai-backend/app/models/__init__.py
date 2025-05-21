from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


from .Agency import Agency
from .User import User
from .City import City
from .Report import Report


