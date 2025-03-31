from app.database.db import db
import datetime

class AssessmentResult(db.Model):
    __tablename__ = "assessment_results"
    id = db.Column(db.Integer, primary_key=True)
    hypertension = db.Column(db.String(50))
    diabetes = db.Column(db.Boolean)
    cigarettes_per_day = db.Column(db.Integer)
    sedentary_hours = db.Column(db.Integer)
    sleep_hours = db.Column(db.Integer)
    social_connectedness = db.Column(db.String(100))
    chest_pain = db.Column(db.Boolean)
    shortness_of_breath = db.Column(db.Boolean)
    dizziness = db.Column(db.Boolean)
    swelling = db.Column(db.Boolean)
    irregular_heartbeat = db.Column(db.Boolean)
    risk_level = db.Column(db.String(50), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    test_taken_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    user = db.relationship('User', backref=db.backref('assessment_results', lazy=True))

    def __init__(self, hypertension, diabetes, cigarettes_per_day, sedentary_hours, sleep_hours, 
                 social_connectedness, chest_pain, shortness_of_breath, dizziness, swelling, 
                 irregular_heartbeat, risk_level, user_id):
        self.hypertension = hypertension
        self.diabetes = diabetes
        self.cigarettes_per_day = cigarettes_per_day
        self.sedentary_hours = sedentary_hours
        self.sleep_hours = sleep_hours
        self.social_connectedness = social_connectedness
        self.chest_pain = chest_pain
        self.shortness_of_breath = shortness_of_breath
        self.dizziness = dizziness
        self.swelling = swelling
        self.irregular_heartbeat = irregular_heartbeat
        self.risk_level = risk_level
        self.user_id = user_id
        self.test_taken_at = datetime.datetime.utcnow()

    def serialize(self):
        return {
            'id': self.id,
            'hypertension': self.hypertension,
            'diabetes': self.diabetes,
            'cigarettes_per_day': self.cigarettes_per_day,
            'sedentary_hours': self.sedentary_hours,
            'sleep_hours': self.sleep_hours,
            'social_connectedness': self.social_connectedness,
            'chest_pain': self.chest_pain,
            'shortness_of_breath': self.shortness_of_breath,
            'dizziness': self.dizziness,
            'swelling': self.swelling,
            'irregular_heartbeat': self.irregular_heartbeat,
            'risk_level': self.risk_level,
            'user_id': self.user_id,
            'test_taken_at': self.test_taken_at.isoformat()
        }
