import shap
import joblib
import pandas as pd
import os
from flask import request, jsonify, Blueprint, send_from_directory
from app.database.db import db
from app.models.assessment_results import AssessmentResult
from app.models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timezone

assessment_routes = Blueprint('assessment_routes', __name__)

# Load the pre-trained model (assuming 'tuned_lightgbm.pkl' is used for prediction)
model = joblib.load('app/tuned_lgbm_model.pkl')

# Load SHAP explainer for LightGBM model
explainer = shap.TreeExplainer(model)

@assessment_routes.route('/assessments', methods=['POST'])
@jwt_required()
def create_assessment():
    try:
        # Get the user ID from the JWT token
        user_email = get_jwt_identity()
        user = User.query.filter(User.email == user_email).first()
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Parse the form data from the request
        form_data = request.get_json()

        # Retrieve user details from the database if not in form_data
        age = int(user.age)
        print(age)
        gender = user.gender 
        bmi = user.bmi
        height=user.height
        weight=user.weight

        gender_map={'Male':0,'Female':1}
        gender=gender_map[gender]
        print(gender)
        # Update user table if new data is provided

        # Categorical field mappings (same as before)
        hypertension_map = {'No': 0, 'Mild': 1, 'Moderate': 2, 'Severe': 3, 'no': 0}
        diabetes_map = {'No': 0, 'Co': 1, 'Un': 2, 'Yes': 1}
        chest_pain_map = {'Yes': 1, 'No': 0}
        shortness_of_breath_map = {'Yes': 1, 'No': 0}
        dizziness_map = {'Yes': 1, 'No': 0}
        swelling_map = {'Yes': 1, 'No': 0}
        irregular_heartbeat_map = {'Yes': 1, 'No': 0}
        smoking_status_map = {'Heavy Smoker': 3, 'Non-Smoker': 0, 'Light Smoker': 1, 'Regular Smoker': 2}

        # Convert categorical fields to numerical
        smoking_status_value = smoking_status_map.get(form_data.get('smoking_status'), 0)
        hypertension_value = hypertension_map.get(form_data.get('hypertension'), 0)
        diabetes_value = diabetes_map.get(form_data.get('diabetes'), 0)
        chest_pain_value = chest_pain_map.get(form_data.get('chest_pain'), 0)
        shortness_of_breath_value = shortness_of_breath_map.get(form_data.get('shortness_of_breath'), 0)
        dizziness_value = dizziness_map.get(form_data.get('dizziness'), 0)
        swelling_value = swelling_map.get(form_data.get('swelling'), 0)
        irregular_heartbeat_value = irregular_heartbeat_map.get(form_data.get('irregular_heartbeat'), 0)

        # Other fields (same as before)
        cigarettes_per_day = int(form_data.get('cigarettes_per_day', 0))
        sedentary_hours = int(form_data.get('sedentary_hours', 0))
        sleep_hours = int(form_data.get('sleep_hours', 0))
        social_connectedness = form_data.get('social_connectedness', 0)

        # Create a DataFrame for prediction (same as before)
        prediction_data = pd.DataFrame([{
            'Age': age,
            'Gender': gender,
            'Smoking_Status': smoking_status_value,
            'Cigarettes_Per_Day': cigarettes_per_day,
            'Sedentary_Hour': sedentary_hours,
            'Hypertension': hypertension_value,
            'Diabetes': diabetes_value,
            'Sleep_Hours': sleep_hours,
            'Social_Connectedness': social_connectedness,
            'Height_cm': height,
            'Weight_kg': weight,
            'BMI': bmi,
            'Chest_Pain': chest_pain_value,
            'Shortness_of_Breath': shortness_of_breath_value,
            'Dizziness': dizziness_value,
            'Swelling': swelling_value,
            'Irregular_Heartbeat': irregular_heartbeat_value
        }])
        print(prediction_data.to_json())

        # Predict risk level
        risk_level = int(model.predict(prediction_data)[0])

        # Generate SHAP values
        shap_values = explainer.shap_values(prediction_data)
        predicted_class_index = risk_level

        # Generate SHAP force plot
        shap.initjs()
        shap_plot_path = 'app/static/shap_force_plot.html'
        shap_force_plot = shap.force_plot(explainer.expected_value[0], shap_values[0][:, predicted_class_index],
                        prediction_data.iloc[0], feature_names=prediction_data.columns,
                        show=False)
        shap.save_html(shap_plot_path, plot=shap_force_plot)
        shap_plot_url = f"/static/shap_force_plot.html"

        # Map the risk level to a label
        risk_level_map = {0: 'Low', 1: 'Moderate', 2: 'High', 3: 'Very High'}
        risk_level_label = risk_level_map[risk_level]

        # Save the assessment result to the database
        assessment_result = AssessmentResult(
            hypertension=hypertension_value,
            diabetes=diabetes_value,
            cigarettes_per_day=cigarettes_per_day,
            sedentary_hours=sedentary_hours,
            sleep_hours=sleep_hours,
            social_connectedness=social_connectedness,
            chest_pain=chest_pain_value,
            shortness_of_breath=shortness_of_breath_value,
            dizziness=dizziness_value,
            swelling=swelling_value,
            irregular_heartbeat=irregular_heartbeat_value,
            risk_level=risk_level_label,
            user_id=user.id,
        )

        db.session.add(assessment_result)
        db.session.commit()

        return jsonify({
            "message": "Assessment result added successfully", 
            "predicted_risk_level": risk_level_label,
            "shap_plot_url": shap_plot_url
        }), 201

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"message": "Error adding assessment result"}), 500