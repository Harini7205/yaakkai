from app.database.db import db
from flask_bcrypt import Bcrypt

bcrypt=Bcrypt()

class User(db.Model):
    __tablename__='user'
    id=db.Column(db.Integer,primary_key=True)
    firstname=db.Column(db.String(100),nullable=False)
    lastname=db.Column(db.String(100))
    email=db.Column(db.String(120),unique=True,nullable=False)
    password_hash=(db.Column(db.String(128),nullable=False))
    gender=db.Column(db.String(20),nullable=False)
    age=db.Column(db.Integer,nullable=False)

    def set_password(self,password):
        self.password_hash=bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self,password):
        return bcrypt.check_password_hash(self.password_hash,password)
