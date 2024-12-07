from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    from app.routes import image_routes
    app.register_blueprint(image_routes.bp)
    
    return app
