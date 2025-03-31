from app.database.db import db
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(50))
    systolic = db.Column(db.Integer)
    diastolic = db.Column(db.Integer)
    heartrate = db.Column(db.Integer)
    bmi = db.Column(db.Float)
    height = db.Column(db.Float)  # Storing height in cm
    weight = db.Column(db.Float)  # Storing weight in kg

    def set_password(self, password):
        """Hashes and sets the user's password."""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """Checks if the provided password matches the hashed password."""
        return bcrypt.check_password_hash(self.password_hash, password)
