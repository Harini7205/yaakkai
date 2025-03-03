from flask import Blueprint, request, jsonify
import joblib
import pandas as pd
import xgboost as xgb

predict_routes=Blueprint('predict_routes',__name__)
model=joblib.load('app/model.joblib')

@predict_routes.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse incoming JSON data
        data = request.json
        print(data)
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Convert received data into a Pandas DataFrame
        df = pd.DataFrame([data])

        # Convert categorical responses to numerical values if needed
        mapping = {'male':1,'female':0,'Yes': 1, 'No': 0, 'Low': 0, 'Moderate': 1, 'High': 2, 'Low stress': 0, 'Moderate stress': 1, 'High stress': 2}
        for col in df.columns:
            if df[col].dtype == 'object':  # Check for categorical columns
                df[col] = df[col].map(mapping).fillna(df[col])  # Map and fill unknown values
        
        expected_columns = ['Age', 'Gender', 'Smoking', 'Alcohol_Consumption', 'Physical_Activity_Level', 'Hypertension', 'Family_History', 'Stress_Level', ]
        df = df[expected_columns]  # Reorder the columns to match the expected order
        print("Processed DataFrame:")
        print(df)
        # Ensure the data is numeric
        df = df.apply(pd.to_numeric, errors='coerce')
        # Make prediction
        prediction = model.predict(df)[0]
        print(prediction)

        return jsonify({'prediction': str(prediction)})
    
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500