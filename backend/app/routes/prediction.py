from flask import Blueprint, request, jsonify
import joblib
import pandas as pd
import lightgbm as lgb
from app.database.db import db
from app.models.assessment_results import AssessmentResult

predict_routes = Blueprint('predict_routes', __name__)

# Load the new model (tuned_lightgbm.pkl)
model = joblib.load('app/tuned_lgbm_model.pkl')

@predict_routes.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print(data)
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        user_id = data['user_id']

        # Prepare the data for prediction (drop user_id and other unnecessary columns)
        df = pd.DataFrame([data])
        df.drop(columns=['user_id'], inplace=True)

        # Define the mapping for categorical columns
        mapping = {'male': 1, 'female': 0, 'Yes': 1, 'No': 0, 'Low': 0, 'Moderate': 1, 'High': 2, 
                   'Low stress': 0, 'Moderate stress': 1, 'High stress': 2}
        
        # Map categorical columns based on the defined mapping
        for col in df.columns:
            if df[col].dtype == 'object':
                df[col] = df[col].map(mapping).fillna(df[col])

        # Ensure the columns are in the expected order
        expected_order = ['Age', 'Gender', 'Smoking', 'Alcohol_Consumption', 'Physical_Activity_Level', 
                          'Hypertension', 'Family_History', 'Stress_Level']
        df = df[expected_order]        

        # Convert columns to numeric values (if necessary)
        df = df.apply(pd.to_numeric, errors='coerce')

        # Use the model to make the prediction
        prediction = model.predict(df)[0]  # Get the first prediction (since we only have one input)

        # Store the result in the database
        result = AssessmentResult(
            age=data['Age'],
            gender=data['Gender'],
            smoking=data['Smoking'],
            alcohol_consumption=data['Alcohol_Consumption'],
            physical_activity_level=data['Physical_Activity_Level'],
            hypertension=data['Hypertension'],
            family_history=data['Family_History'],
            stress_level=data['Stress_Level'],
            risk_level=str(prediction),  # Store the predicted risk level
            user_id=user_id
        )

        # Commit to the database
        db.session.add(result)
        db.session.commit()

        # Return the prediction in the response
        return jsonify({'risk_level': str(prediction)})

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
