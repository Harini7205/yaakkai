from pydantic import BaseModel

class UserSchema(BaseModel):
    email:str
    password:str
    firstname:str
    lastname:str
    gender:str
    age:int

class UserLoginInput(BaseModel):
    email:str
    password:str