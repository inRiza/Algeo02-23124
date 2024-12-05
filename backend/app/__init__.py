from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    from app.routes import audio_routes
    app.register_blueprint(audio_routes.bp)
    
    return app