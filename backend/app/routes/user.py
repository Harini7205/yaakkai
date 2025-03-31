from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.database.db import db
from app.models.user import User
from app.models.assessment_results import AssessmentResult

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/update-age', methods=['POST'])
@jwt_required()
def update_age():
    try:
        user_email = get_jwt_identity()  # Get user email from JWT
        print(user_email)
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return jsonify({"message": "User not found"}), 404
        

        data = request.get_json()
        new_age = data.get("age")
        if not new_age or not isinstance(new_age, int):
            return jsonify({"message": "Invalid age"}), 400

        user.age = new_age
        db.session.commit()

        return jsonify({"message": "Age updated successfully"}), 200
    except Exception as e:
        print(f"Error updating age: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

@user_routes.route('/gender-bmi', methods=['POST'])
@jwt_required()
def update_bmi():
    try:
        user_email = get_jwt_identity()  # Get user email from JWT
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return jsonify({"message": "User not found"}), 404

        data = request.get_json()
        gender = data.get("gender")
        bmi = data.get("bmi")
        height = data.get("height")
        weight = data.get("weight")

        # Validate gender
        if not gender or gender not in ["Male", "Female", "Other"]:
            return jsonify({"message": "Invalid gender"}), 400
        
        # Validate BMI
        if bmi is None or not isinstance(bmi, (int, float)):
            return jsonify({"message": "Invalid BMI value"}), 400

        # Validate height and weight
        if height is None or not isinstance(height, (int, float)) or height <= 0:
            return jsonify({"message": "Invalid height value"}), 400
        if weight is None or not isinstance(weight, (int, float)) or weight <= 0:
            return jsonify({"message": "Invalid weight value"}), 400

        # Update user data
        user.gender = gender
        user.bmi = bmi
        user.height = height
        user.weight = weight

        db.session.commit()

        return jsonify({"message": "User data updated successfully"}), 200
    except Exception as e:
        print(f"Error updating user data: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

@user_routes.route('/update-bp-hr', methods=['POST'])
@jwt_required()
def update_bp_hr():
    try:
        user_email = get_jwt_identity()  # Get user email from JWT
        user = User.query.filter_by(email=user_email).first()
        
        if not user:
            return jsonify({"message": "User not found"}), 404

        data = request.get_json()
        systolic = data.get("systolic")
        diastolic = data.get("diastolic")
        heart_rate = data.get("heart_rate")

        if systolic is None or not isinstance(systolic, int):
            return jsonify({"message": "Invalid systolic pressure"}), 400
        if diastolic is None or not isinstance(diastolic, int):
            return jsonify({"message": "Invalid diastolic pressure"}), 400
        if heart_rate is None or not isinstance(heart_rate, int):
            return jsonify({"message": "Invalid heart rate"}), 400

        user.systolic = systolic
        user.diastolic = diastolic
        user.heartrate = heart_rate
        db.session.commit()

        return jsonify({"message": "Blood pressure and heart rate updated successfully"}), 200
    except Exception as e:
        print(f"Error updating blood pressure and heart rate: {e}")
        return jsonify({"message": "Internal Server Error"}), 500
    
@user_routes.route('/latest-test-result', methods=['GET'])
@jwt_required()
def get_latest_test_result():
    try:
        user_email = get_jwt_identity()  # Extract email from JWT
        print(user_email)
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return jsonify({"message": "User not found"}), 404

        latest_result = AssessmentResult.query.filter_by(user_id=user.id)
        latest_result = latest_result.order_by(AssessmentResult.test_taken_at.desc()).first()
        
        if not latest_result:
            return jsonify({"message": "No test results found for the user"}), 404
        return jsonify({
            "test_result": latest_result.risk_level,
            "test_taken_at": latest_result.test_taken_at.date().isoformat(),
            "bloodpressure":f'{user.systolic}/{user.diastolic}',
            "heartrate":user.heartrate,
            "username":user.name
        }), 200
    except Exception as e:
        print(f"Error fetching latest test result: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

