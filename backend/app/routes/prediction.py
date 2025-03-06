from flask import Blueprint, request, jsonify
import joblib
import pandas as pd
import xgboost as xgb
from app.database.db import db
from app.models.assessment_results import AssessmentResult

predict_routes=Blueprint('predict_routes',__name__)
model=joblib.load('app/model.joblib')

@predict_routes.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print(data)
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        userid=data['user_id']

        df = pd.DataFrame([data])
        df.drop(columns=['user_id'],inplace=True)

        mapping = {'male':1,'female':0,'Yes': 1, 'No': 0, 'Low': 0, 'Moderate': 1, 'High': 2, 'Low stress': 0, 'Moderate stress': 1, 'High stress': 2}
        for col in df.columns:
            if df[col].dtype == 'object':  
                df[col] = df[col].map(mapping).fillna(df[col])  

        expected_order=['Age', 'Gender', 'Smoking', 'Alcohol_Consumption', 'Physical_Activity_Level', 'Hypertension', 'Family_History', 'Stress_Level']
        df=df[expected_order]        
        df = df.apply(pd.to_numeric, errors='coerce')
        
        prediction = model.predict(df)[0]
        result = AssessmentResult(
            age=data['Age'],
            gender=data['Gender'],
            smoking=data['Smoking'],
            alcohol_consumption=data['Alcohol_Consumption'],
            physical_activity_level=data['Physical_Activity_Level'],
            hypertension=data['Hypertension'],
            family_history=data['Family_History'],
            stress_level=data['Stress_Level'],
            prediction=str(prediction),
            user_id=userid
        )
        db.session.add(result)
        db.session.commit()

        return jsonify({'prediction': str(prediction)})
    
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500