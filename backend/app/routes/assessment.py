from flask import Blueprint, request, jsonify
from app.database.db import db
from app.models.assessment_results import AssessmentResult
from flask_jwt_extended import jwt_required,get_jwt_identity

assessment_routes=Blueprint('assessment_routes',__name__)

@assessment_routes.route('/assessments',methods=['GET'])
@jwt_required()
def get_assessments():
    user_id=get_jwt_identity()
    if not user_id:
        print("No token found")
    print(user_id)
    assessments=AssessmentResult.query.filter_by(user_id=user_id).all()
    print(assessments)
    return jsonify([assessment.serialize() for assessment in assessments])