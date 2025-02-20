from database.session import Base
from sqlalchemy import Column, Integer, String, Text

class User(Base):
    __tablename__='users'
    user_id=Column(String(50),primary_key=True)
    email=Column(String(100),nullable=False)
    password=Column(Text,nullable=False)
    firstname=Column(String(100))
    lastname=Column(String(100))
    gender=Column(String(20))
    age=Column(Integer)