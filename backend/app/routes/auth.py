from flask import Blueprint, jsonify, request, make_response
from app.models.user import User
from app.models.assessment_results import AssessmentResult
from app.database.db import db
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token, 
    jwt_required, 
    get_jwt_identity
)
import datetime
import random
import time
from flask_mail import Message
from app.mail import mail  # Importing initialized mail object

auth_routes = Blueprint('auth_routes', __name__)

# OTP storage (Consider using Redis for production)
otp_storage = {}

def generate_otp():
    return random.randint(100000, 999999)

@auth_routes.route('/')
def home():
    return jsonify({"message": "Welcome to Auth API"})

# ✅ SIGNUP (Creates Access + Refresh Tokens)
@auth_routes.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"message": "Missing fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    new_user = User(name=name, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    # Generate JWT tokens
    access_token = create_access_token(identity=email, expires_delta=datetime.timedelta(hours=1))
    refresh_token = create_refresh_token(identity=email)

    # Securely store refresh token in HTTP-only cookie
    response = make_response(jsonify({
        "message": "User created successfully, OTP sent to email",
        "access_token": access_token
    }), 201)
    response.set_cookie("refresh_token", refresh_token, httponly=True, secure=True, samesite="Strict")

    # Generate OTP & Send via Email
    otp = generate_otp()
    otp_storage[email] = {'otp': otp, 'timestamp': time.time()}
    send_otp_email(email, otp)

    return response

def send_otp_email(email, otp):
    msg = Message("Your OTP Code", recipients=[email])
    msg.body = f"Your OTP code is {otp}. It expires in 5 minutes."
    try:
        mail.send(msg)
        print(f"✅ OTP sent to {email}")
    except Exception as e:
        print(f"❌ Error sending OTP: {str(e)}")

# ✅ RESEND OTP
@auth_routes.route('/resend-otp', methods=['POST'])
def resend_otp():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"message": "Email is required"}), 400

    current_time = time.time()
    if email in otp_storage and current_time - otp_storage[email]["timestamp"] < 30:
        return jsonify({"message": "Please wait before requesting a new OTP"}), 429

    # Generate and Send OTP
    otp = generate_otp()
    otp_storage[email] = {"otp": otp, "timestamp": current_time}
    send_otp_email(email, otp)

    return jsonify({"message": "OTP resent successfully"}), 200

# ✅ VERIFY OTP
@auth_routes.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')

    if not email or not otp:
        return jsonify({"message": "Email and OTP are required!"}), 400
    
    if email not in otp_storage:
        return jsonify({"message": "OTP not generated for this email!"}), 400
    
    otp_data = otp_storage[email]
    if time.time() - otp_data['timestamp'] > 300:
        return jsonify({"message": "OTP has expired. Please request a new one."}), 400
    
    try:
        if int(otp) != otp_data['otp']:
            return jsonify({"message": "Invalid OTP!"}), 400
    except ValueError:
        return jsonify({"message": "Invalid OTP format!"}), 400

    del otp_storage[email]
    return jsonify({"message": "OTP verified successfully!"}), 200

# ✅ LOGIN (Generates Tokens)
@auth_routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    remember_me = data.get('rememberMe', False)

    if not email or not password:
        return jsonify({"message": "Missing details"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 400

    # Token expiration settings
    expires_access = datetime.timedelta(hours=1)
    expires_refresh = datetime.timedelta(days=7 if remember_me else 1)

    access_token = create_access_token(identity=user.email, expires_delta=expires_access)
    refresh_token = create_refresh_token(identity=user.email, expires_delta=expires_refresh)

    # Store refresh token securely in HTTP-only cookie
    response = make_response(jsonify({
        "message": "User logged in successfully",
        "access_token": access_token
    }), 200)
    response.set_cookie("refresh_token", refresh_token, httponly=True, secure=True, samesite="Strict")

    return response

# ✅ REFRESH TOKEN (Issues New Access Token)
@auth_routes.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify({"access_token": new_access_token}), 200

# ✅ LOGOUT (Clears Refresh Token)
@auth_routes.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({"message": "Logged out successfully"}), 200)
    response.set_cookie("refresh_token", "", httponly=True, expires=0)
    return response

# ✅ RESET PASSWORD
@auth_routes.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('new_password')

    if not email or not new_password:
        return jsonify({"message": "Missing fields"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Password updated successfully"}), 200
