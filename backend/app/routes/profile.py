from flask import Blueprint,jsonify,request
from app.models.user import User
from app.models.assessment_results import AssessmentResult
from app.database.db import db
from flask_jwt_extended import jwt_required,get_jwt_identity

profile_routes=Blueprint('profile_routes',__name__)

@profile_routes.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()

    if not user_id:
        print("No token found")

    user = User.query.get(int(user_id))
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    assessments = AssessmentResult.query.filter(AssessmentResult.user_id == user_id).all()

    num_tests_taken = len(assessments)
    latest_test_result = 'None'
    if num_tests_taken > 0:
        latest_assessment = sorted(assessments, key=lambda x: x.created_at, reverse=True)[0]
        latest_test_result = latest_assessment.prediction
    
    mapping={0:"Low",1:"Moderate",2:"High"}
    if latest_test_result!='None':
        latest_test_result=mapping[int(latest_test_result)]

    return jsonify({
        "userid": user_id,
        "name": user.name,
        "email": user.email,
        "testsTaken":num_tests_taken,
        "latestTestResult":latest_test_result
    }), 200

@profile_routes.route('/change-password', methods=['POST'])
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

@profile_routes.route('/update-email', methods=['POST'])
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