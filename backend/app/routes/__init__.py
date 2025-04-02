from flask import Flask
from .auth import auth_routes
#from .prediction import predict_routes
from .assessment import assessment_routes
from .profile import profile_routes
from .signupgoogle import signup_google_routes
from .resources import resources_bp
from .user import user_routes
from .gemini import analysis_routes
from .pastassessment import pastassessment_routes

def register_routes(app):
    app.register_blueprint(auth_routes,url_prefix="/auth")
    #app.register_blueprint(predict_routes)
    app.register_blueprint(assessment_routes)
    app.register_blueprint(profile_routes)
    app.register_blueprint(signup_google_routes)
    app.register_blueprint(resources_bp)
    app.register_blueprint(user_routes)
    app.register_blueprint(analysis_routes)
    app.register_blueprint(pastassessment_routes)