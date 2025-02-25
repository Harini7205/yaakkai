from flask import Blueprint,jsonify,request
from app.models.user import User
from app.database.db import db
from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity

auth_routes=Blueprint('auth_routes',__name__)

@auth_routes.route('/')
def home():
    return jsonify({"message":"Welcome"})

@auth_routes.route('/signup',methods=['POST'])
def signup():
    data=request.get_json()
    firstname=data.get('firstname')
    lastname=data.get('lastname')
    email=data.get('email')
    password=data.get('password')
    gender=data.get('gender')
    age=data.get('age')

    if not firstname or not email or not password or not gender or not age:
        return jsonify({"message":"Missing fields"}),400
    
    existing_user=User.query.filter((User.email==email)).first()
    if existing_user:
        return jsonify({"message":"User already exists"}),400

    new_user=User(firstname=firstname,lastname=lastname,email=email,gender=gender,age=age)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message":"User created successfully"}),201

@auth_routes.route('/login',methods=['POST'])
def login():
    data=request.get_json()
    email=data.get('email')
    password=data.get('password')

    if not email or not password:
        return jsonify({"message":"Missing details"}),400
    
    user=User.query.filter((User.email==email)).first()
    if not user or not user.check_password(password):
        return jsonify({"message":"Invalid credentials"}),400

    return jsonify({"message":"User login successfully"}),200