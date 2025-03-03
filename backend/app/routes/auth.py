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

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"message": "User logged in successfully", "access_token": access_token}), 200

@auth_routes.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()

    if not user_id:
        print("No token found")

    user = User.query.get(int(user_id))
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "name": f"{user.firstname} {user.lastname}",
        "email": user.email,
        "gender": user.gender,
        "age": user.age,
        "testsTaken":0,
        "latestTestResult":"None"
    }), 200

@auth_routes.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not current_password or not new_password:
        return jsonify({"message": "Missing fields"}), 400

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not user.check_password(current_password):
        return jsonify({"message": "Invalid current password"}), 400

    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Password updated successfully"}), 200

@auth_routes.route('/update-email', methods=['POST'])
@jwt_required()
def update_email():
    data = request.get_json()
    new_email = data.get('new_email')

    if not new_email:
        return jsonify({"message": "Missing email"}), 400

    existing_user = User.query.filter(User.email == new_email).first()
    if existing_user:
        return jsonify({"message": "Email already in use"}), 400

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    user.email = new_email
    db.session.commit()

    return jsonify({"message": "Email updated successfully"}), 200