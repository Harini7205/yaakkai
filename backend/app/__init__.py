from flask import Flask
from flask_migrate import Migrate
from .config import Config
from app.database.db import db
from .routes import register_routes
from flask_bcrypt import Bcrypt
from flask_cors import CORS 
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from dotenv import load_dotenv
from app.mail import mail

# Initialize extensions
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    
    # Load environment variables from .env file
    load_dotenv()
    
    # App configuration from Config object
    app.config.from_object(Config)
    
    # Initialize Flask extensions
    db.init_app(app)
    print("Database connected")
    bcrypt.init_app(app)
    CORS(app)
    Migrate(app, db)
    jwt = JWTManager(app)
    mail.init_app(app)

    # Register routes
    register_routes(app)
    
    return app
