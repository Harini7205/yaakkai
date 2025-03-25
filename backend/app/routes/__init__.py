from flask import Flask
from .auth import auth_routes
#from .prediction import predict_routes
from .assessment import assessment_routes

def register_routes(app):
    app.register_blueprint(auth_routes,url_prefix="/auth")
    #app.register_blueprint(predict_routes)
    app.register_blueprint(assessment_routes)