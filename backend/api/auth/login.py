from fastapi import HTTPException,status,Depends
from database.session import get_db
from sqlalchemy.orm import Session
from api.auth import auth_router
from models.userModel import User
from schemas.userSchema import UserLoginInput

@auth_router.post('/login')
def login_user(user:UserLoginInput,db:Session=Depends(get_db)):
    result=db.query(User).filter(User.email==user.email,User.password==user.password).first()
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User not found")
    return result

