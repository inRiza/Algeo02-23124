from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Register both blueprints
    from app.routes import audio_routes, image_routes
    app.register_blueprint(audio_routes.bp, url_prefix='/api/audio')
    app.register_blueprint(image_routes.bp, url_prefix='/api/image')
    
    return app