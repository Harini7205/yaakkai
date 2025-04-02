from flask import Blueprint, jsonify, request
from app.models.user import User
from app.models.assessment_results import AssessmentResult
from app.database.db import db
from flask_jwt_extended import jwt_required, get_jwt_identity

profile_routes = Blueprint('profile_routes', __name__)

@profile_routes.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"message": "User not found"}), 404
    
    assessments = AssessmentResult.query.filter_by(user_id=user.id).all()
    num_tests_taken = len(assessments)
    latest_test_result = 'None'
    
    if num_tests_taken > 0:
        latest_assessment = sorted(assessments, key=lambda x: x.test_taken_at, reverse=True)[0]
        latest_test_result = latest_assessment.risk_level
    
    return jsonify({
        "userid": user.id,
        "name": user.name,
        "email": user.email,
        "age": user.age,
        "gender": user.gender,
        "testsTaken": num_tests_taken,
        "latestTestResult": latest_test_result
    }), 200

@profile_routes.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not current_password or not new_password:
        return jsonify({"message": "Missing fields"}), 400

    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user or not user.check_password(current_password):
        return jsonify({"message": "Invalid current password"}), 400

    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Password updated successfully"}), 200

@profile_routes.route('/update-email', methods=['POST'])
@jwt_required()
def update_email():
    data = request.get_json()
    new_email = data.get('new_email')

    if not new_email:
        return jsonify({"message": "Missing email"}), 400

    existing_user = User.query.filter_by(email=new_email).first()
    if existing_user:
        return jsonify({"message": "Email already in use"}), 400

    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    user.email = new_email
    db.session.commit()

    return jsonify({"message": "Email updated successfully"}), 200
