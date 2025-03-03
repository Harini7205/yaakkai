from flask import Flask
from .auth import auth_routes
from .prediction import predict_routes

def register_routes(app):
    app.register_blueprint(auth_routes,url_prefix="/auth")
    app.register_blueprint(predict_routes)