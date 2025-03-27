from flask import Blueprint, jsonify, request
from app.models.user import User
from app.models.assessment_results import AssessmentResult
from app.database.db import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token
import datetime
import random
import time
from flask_mail import Message

# Initialize Flask-Mail (initialized in app's create_app function)
from app.mail import mail  # Assuming mail is initialized in app's create_app function

auth_routes = Blueprint('auth_routes', __name__)

# Simulated OTP storage (In a real app, use a database or cache like Redis)
otp_storage = {}

def generate_otp():
    return random.randint(100000, 999999)

@auth_routes.route('/')
def home():
    return jsonify({"message": "Welcome"})

@auth_routes.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"message": "Missing fields"}), 400
    
    existing_user = User.query.filter((User.email == email)).first()
    if existing_user:
        return jsonify({"message": "User already exists"}), 400

    new_user = User(name=name, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    # Generate OTP and store it for the new user
    otp = generate_otp()
    otp_storage[email] = {'otp': otp, 'timestamp': time.time()}

    # Send OTP to user's email
    send_otp_email(email, otp)

    return jsonify({"message": "User created successfully, OTP sent to email"}), 201

def send_otp_email(email, otp):
    # Send OTP email using Flask-Mail
    msg = Message("Your OTP Code", recipients=[email])
    msg.body = f"Your OTP code is {otp}. It will expire in 5 minutes."
    
    try:
        mail.send(msg)
        print(f"OTP sent to {email}")  # Log to console or file
    except Exception as e:
        print(f"Error sending OTP to {email}: {str(e)}")
        # Log or print the error to help debug
        if 'socket' in str(e):
            print("Network/socket error - ensure you can reach the SMTP server.")
        else:
            print(f"Unexpected error: {str(e)}")

@auth_routes.route('/resend-otp', methods=['POST'])
def resend_otp():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"message": "Email is required"}), 400

    current_time = time.time()
    
    # Check if OTP exists for the user
    if email in otp_storage:
        last_otp_time = otp_storage[email]["timestamp"]
        
        # **Rate limiting**: Allow resend only after 30 seconds
        if current_time - last_otp_time < 30:
            return jsonify({"message": "Please wait before requesting a new OTP"}), 429
    
    # Generate a new OTP
    otp = generate_otp()
    otp_storage[email] = {"otp": otp, "timestamp": current_time}

    # Send the new OTP
    send_otp_email(email, otp)

    return jsonify({"message": "OTP resent successfully"}), 200

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
    
    # Check OTP expiration (e.g., expire after 5 minutes)
    if time.time() - otp_data['timestamp'] > 300:  # 5 minutes = 300 seconds
        return jsonify({"message": "OTP has expired. Please request a new one."}), 400
    
    # Validate OTP
    print(otp_data)
    try:
        otp = int(otp)  # Convert received OTP to integer
    except ValueError:
        return jsonify({"message": "Invalid OTP format!"}), 400
    
    if otp != otp_data['otp']:
        return jsonify({"message": "Invalid OTP!"}), 400
    
    # OTP is valid, remove OTP from storage (so it can't be reused)
    del otp_storage[email]
    
    return jsonify({"message": "OTP verified successfully!"}), 200

@auth_routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    remember_me = data.get('rememberMe', False)

    if not email or not password:
        return jsonify({"message": "Missing details"}), 400

    user = User.query.filter(User.email == email).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 400

    # Set token expiration (short for normal, long for remember me)
    expires_access = datetime.timedelta(hours=1)
    expires_refresh = datetime.timedelta(days=7 if remember_me else 1)

    access_token = create_access_token(identity=str(user.id), expires_delta=expires_access)
    refresh_token = create_refresh_token(identity=str(user.id), expires_delta=expires_refresh)

    return jsonify({
        "message": "User logged in successfully",
        "access_token": access_token,
        "refresh_token": refresh_token
    }), 200

@auth_routes.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify({"access_token": new_access_token}), 200

@auth_routes.route('/reset-password', methods=['POST'])
def change_password():
    data = request.get_json()
    email=data.get('email')
    new_password = data.get('new_password')

    if not new_password:
        return jsonify({"message": "Missing fields"}), 400
    
    user = User.query.filter(User.email == email).first()
    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Password updated successfully"}), 200
