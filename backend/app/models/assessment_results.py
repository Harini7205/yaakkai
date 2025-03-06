from app.database.db import db
from datetime import datetime

class AssessmentResult(db.Model):
    __tablename__ = 'assessment_results'  # Table name in the database

    id = db.Column(db.Integer, primary_key=True)  # Primary key column
    age = db.Column(db.Integer, nullable=False)  # Age of the person
    gender = db.Column(db.String(50), nullable=False)  # Gender of the person
    smoking = db.Column(db.String(50), nullable=False)  # Smoking status
    alcohol_consumption = db.Column(db.String(50), nullable=False)  # Alcohol consumption status
    physical_activity_level = db.Column(db.String(50), nullable=False)  # Physical activity level
    hypertension = db.Column(db.String(50), nullable=False)  # Hypertension status
    family_history = db.Column(db.String(50), nullable=False)  # Family history of diseases
    stress_level = db.Column(db.String(50), nullable=False)  # Stress level (Low, Moderate, High)
    prediction = db.Column(db.String(50), nullable=False)  # Prediction result (numeric or categorical)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp of when the result is created

    # Foreign key to User table
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Define relationship with the User model
    user = db.relationship('User', backref=db.backref('assessment_results', lazy=True))

    def __init__(self, age, gender, smoking, alcohol_consumption, physical_activity_level, 
                 hypertension, family_history, stress_level, prediction, user_id):
        self.age = age
        self.gender = gender
        self.smoking = smoking
        self.alcohol_consumption = alcohol_consumption
        self.physical_activity_level = physical_activity_level
        self.hypertension = hypertension
        self.family_history = family_history
        self.stress_level = stress_level
        self.prediction = prediction
        self.user_id = user_id
    
    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'created_at':self.created_at,
            'prediction':self.prediction
        }
