from flask import Flask, request, redirect, jsonify, session
from flask_cors import CORS
import requests
import google.oauth2.id_token
import google.auth.transport.requests
from flask import Blueprint,jsonify,request
import jwt

signup_google_routes = Blueprint('signup_google_routes', __name__)

# Google OAuth Config
CLIENT_ID = "371699386242-t86ge7tkcmg07cc13ni7ek6ltab29rbu.apps.googleusercontent.com"
CLIENT_SECRET = "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"
REDIRECT_URI = "https://ad71-2401-4900-1ce0-7d42-c962-ff23-742f-aab1.ngrok-free.app/auth/google/callback"

@signup_google_routes.route('/auth/google')
def google_login():
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/auth"
        "?response_type=code"
        f"&client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        "&scope=email%20profile"
        "&access_type=offline"
    )
    return redirect(google_auth_url)

@signup_google_routes.route('/auth/google/callback')
def google_callback():
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "Missing authorization code"}), 400

    # Exchange authorization code for access token
    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,  # REQUIRED
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
        "code": code
    }
    token_response = requests.post(token_url, data=token_data)
    token_json = token_response.json()

    if "id_token" not in token_json:
        return jsonify({"error": "Failed to retrieve token", "details": token_json}), 400

    # Verify ID token
    try:
        print(token_json["id_token"])
        id_token = token_json["id_token"]
        decoded_token = jwt.decode(id_token, options={"verify_signature": False})
        print("🔍 Decoded Token:", decoded_token)  # ✅ Debug step

        # Check audience (aud) field
        if decoded_token.get("aud") != CLIENT_ID:
            return jsonify({"error": "Token audience mismatch"}), 400
        user_info = {
            "name": decoded_token.get("name"),
            "email": decoded_token.get("email"),
            "picture": decoded_token.get("picture"),
            "access_token": token_json.get("access_token"),
            "id_token": id_token  # Send ID token to frontend if needed
        }

        return jsonify(user_info)

    except ValueError:
        return jsonify({"error": "Invalid token"}), 400

@signup_google_routes.route('/auth/user-info')
def get_user_info():
    if "user" in session:
        return jsonify({"user": session["user"]})
    return jsonify({"error": "No user logged in"}), 400