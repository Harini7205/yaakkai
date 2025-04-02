from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.assessment_results import AssessmentResult
from ..models.user import User

pastassessment_routes = Blueprint('pastassessment_routes', __name__)

@pastassessment_routes.route('/assessments', methods=['GET'])
@jwt_required()
def get_assessments():
    try:
        # Get the current user from JWT token
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()

        if not user:
            return jsonify({"message": "User not found"}), 404

        # Fetch all assessments for the user
        assessments = AssessmentResult.query.filter_by(user_id=user.id).order_by(AssessmentResult.test_taken_at.desc()).all()

        # Serialize only required fields
        assessment_data = [
            {
                "id": assessment.id,
                "created_at": assessment.test_taken_at.strftime('%Y-%m-%d %H:%M:%S'),
                "prediction": str(assessment.risk_level)  # Ensure it's a string for React mapping
            }
            for assessment in assessments
        ]
        return jsonify(assessment_data), 200

    except Exception as e:
        print(f"Error fetching assessments: {e}")
        return jsonify({"message": "Error fetching assessments"}), 500
