from flask import Blueprint, request, jsonify
from app.services.image_services import ImageService
from werkzeug.utils import secure_filename
import os

bp = Blueprint('image', __name__)
image_service = ImageService()

@bp.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Save image temporarily
        temp_path = os.path.join('app/temp', secure_filename(file.filename))
        file.save(temp_path)

        # Process image and get matches
        matches = image_service.find_matches(temp_path)

        # Clean up
        os.remove(temp_path)

        return jsonify({
            'matches': matches,
            'executionTime': image_service.last_execution_time
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
