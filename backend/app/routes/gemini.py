import google.generativeai as genai
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.database.db import db
from app.models.assessment_results import AssessmentResult
from app.models.user import User
import os
import re
import io
import matplotlib.pyplot as plt
import base64
from flask import Flask, jsonify, send_file, Response
from datetime import datetime
from collections import Counter
import io
import matplotlib.pyplot as plt
from flask import Flask, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from collections import deque

def extract_sections(text, section_title):
    """
    Extracts the bullet points under the given section title.
    """
    pattern = rf"{section_title}:\s*\n\((?:Reason|Tip) \d+\)\s(.*?)\n\((?:Reason|Tip) \d+\)\s(.*?)\n\((?:Reason|Tip) \d+\)\s(.*?)\n\((?:Reason|Tip) \d+\)\s(.*?)\n"
    match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
    
    if match:
        return [match.group(i).strip() for i in range(1, 5)]
    return []

analysis_routes = Blueprint("analysis_routes", __name__)

# Load and check Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") 
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set.")

# Configure Gemini API key
genai.configure(api_key=GEMINI_API_KEY)

@analysis_routes.route("/analyze-health", methods=["POST"])
@jwt_required()
def analyze_health():
    try:
        # Get the user email from JWT token
        user_email = get_jwt_identity()
        
        # Fetch the user from the database
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Fetch the latest assessment result for the user
        assessment = AssessmentResult.query.filter_by(user_id=user.id).order_by(AssessmentResult.id.desc()).first()
        if not assessment:
            return jsonify({"message": "No assessment found"}), 404

        # Prepare structured user data
        user_data = f"""
        Age: {user.age}
        Gender: {user.gender}
        BMI: {user.bmi}
        Test Result: {assessment.risk_level}
        Hypertension: {assessment.hypertension}
        Diabetes: {assessment.diabetes}
        Cigarettes Per Day: {assessment.cigarettes_per_day}
        Sedentary Hours: {assessment.sedentary_hours}
        Sleep Hours: {assessment.sleep_hours}
        Social Connectedness Score: {assessment.social_connectedness}
        Chest Pain: {assessment.chest_pain}
        Shortness of Breath: {assessment.shortness_of_breath}
        Dizziness: {assessment.dizziness}
        Swelling: {assessment.swelling}
        Irregular Heartbeat: {assessment.irregular_heartbeat}
        """

        predicted_risk=assessment.risk_level

        # Define a structured prompt
        prompt = f"""
        You are an AI healthcare assistant analyzing the results of a cardiovascular disease (CVD) risk assessment. This risk level has been predicted by a machine learning model based on the following patient data:
        Patient Data: {user_data} Predicted risk:{predicted_risk}
        Task: Identify Possible Reasons (4 points): Provide exactly four concise reasons why the model may have predicted this risk level. Focus on specific contributing factors from the given data.
        Provide Health Tips (4 points):If the predicted risk level is high or moderate, suggest 4 evidence-based recommendations to reduce cardiovascular risk.
        If the predicted risk level is low, provide 4 practical health tips to maintain or further improve cardiovascular health.
        Ensure the response is clear, personalized, and structured under the following headings:
        Possible Reasons:(Reason 1) (Reason 2) (Reason 3) (Reason 4)
        Health Tips: (Tip 1) (Tip 2) (Tip 3) (Tip 4)
        Give all points in maximum one sentence, short and crisp. Only follow my format and replace the reasons and tips placeholders. each reason/tip to be maximum one line. no unnecessary text needed. In reasons, do not blame the model at any cost. If you cannot find proper reasons, give only one/two reasons. but do not blame model.
        """

        # Generate response using Gemini AI (Using `gemini-1.5-flash` for free-tier compatibility)
        model = genai.GenerativeModel("gemini-1.5-flash")  # Changed model
        response = model.generate_content([prompt])  

        # Extract and return analysis
        analysis = response.text if response and hasattr(response, "text") else "No analysis available."
        print(analysis)
        reasons = extract_sections(analysis, "Possible Reasons")
        health_tips = extract_sections(analysis, "Health Tips")
        print(reasons)
        print(health_tips)

        return jsonify({"reasons": reasons, "tips":health_tips, "risk_level":predicted_risk})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": f"Error processing health analysis: {str(e)}"}), 500

# Use Agg backend to prevent GUI errors
plt.switch_backend("Agg")

@analysis_routes.route("/get-test-results", methods=["GET"])
@jwt_required()
def get_test_results():
    try:
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return jsonify({"message": "User not found"}), 404

        test_results = AssessmentResult.query.filter_by(user_id=user.id).order_by(
            AssessmentResult.test_taken_at.asc()
        ).all()

        if not test_results:
            return jsonify({"message": "No test results found"}), 404
        
        if len(test_results) < 2:
            return jsonify({"message": "Not enough data for trend analysis"}), 200

        risk_mapping = {"Low": 0, "Moderate": 1, "High": 2, "Very High": 3}

        # Extract datetime and risk scores
        x_values = [result.test_taken_at.strftime("%Y-%m-%d %H:%M") for result in test_results]
        risk_scores = [risk_mapping.get(result.risk_level, 0) for result in test_results]

        # Remove consecutive duplicates, keeping only the latest value
        filtered_x = deque()
        filtered_y = deque()

        for i in range(len(x_values)):
            if not filtered_y or risk_scores[i] != filtered_y[-1]:  # Only add if risk score changes
                filtered_x.append(x_values[i])
                filtered_y.append(risk_scores[i])
            else:
                # Update the latest timestamp if the risk score is the same
                filtered_x[-1] = x_values[i]

        plt.figure(figsize=(4,4))
        plt.plot(filtered_x, filtered_y, marker="o", linestyle="-", color="red", label="Risk Score")
        plt.xlabel("Date & Time")
        plt.ylim(-0.5, 3.5)  
        plt.yticks([0, 1, 2, 3])
        plt.xticks(rotation=45)
        plt.legend()

        img = io.BytesIO()
        plt.savefig(img, format="png", bbox_inches="tight")
        img.seek(0)
        plt.close()
        return jsonify({"image": base64.b64encode(img.getvalue()).decode("utf-8")})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": f"Error fetching test results: {str(e)}"}), 500