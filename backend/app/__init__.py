from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .config import Config
from app.database.db import db
from .routes import register_routes
from flask_bcrypt import Bcrypt
from flask_cors import CORS 

bcrypt=Bcrypt()

def create_app():
    app=Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    print("Database connected")
    bcrypt.init_app(app)
    CORS(app)
    Migrate(app,db)
    register_routes(app)
    return app