from flask import Blueprint, request, jsonify, send_file
from werkzeug.utils import secure_filename
from ..services.image_services import ImageService
import os
import json

bp = Blueprint('image', __name__)
image_service = ImageService()

@bp.route('/dataset', methods=['GET'])
def get_dataset():
    """Get all images in dataset with their mapped audio files"""
    try:
        files = image_service.get_dataset_files()
        # Include mapper information
        result = [{
            'filename': filename,
            'audioFile': image_service.mapper.get(filename)
        } for filename in files]
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/dataset', methods=['POST'])
def upload_dataset():
    """Upload multiple images to dataset"""
    if 'files[]' not in request.files:
        return jsonify({'error': 'No files uploaded'}), 400
    
    files = request.files.getlist('files[]')
    uploaded_files = []
    
    try:
        for file in files:
            if file and file.filename:
                filename = secure_filename(file.filename)
                uploaded_files.append(filename)
                image_service.save_dataset_image(file, filename)
        
        # Reload dataset after new files added
        image_service.load_dataset()
        
        return jsonify({
            'message': f'Successfully uploaded {len(uploaded_files)} files',
            'files': uploaded_files
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/mapper', methods=['GET'])
def get_mapper():
    """Get current image-to-audio mapping"""
    try:
        mapper = image_service.get_mapper()
        return jsonify(mapper)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/mapper', methods=['POST'])
def upload_mapper():
    """Upload new image-to-audio mapping file"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
        
    file = request.files['file']
    if not file:
        return jsonify({'error': 'Empty file'}), 400
        
    try:
        if file.filename.endswith('.json'):
            mapping = json.load(file)
            image_service.update_mapper(mapping)
        elif file.filename.endswith('.txt'):
            # Parse text file format
            mapping = {}
            content = file.read().decode('utf-8')
            lines = content.strip().split('\n')
            for line in lines[1:]:  # Skip header
                parts = line.strip().split()
                if len(parts) >= 2:
                    audio_file, pic_name = parts[:2]
                    mapping[pic_name] = audio_file
            image_service.update_mapper(mapping)
        else:
            return jsonify({'error': 'Invalid file format'}), 400
        try:
            image_service.load_dataset()
            image_service.load_mapper()
            message = f'Successfully uploaded files and reloaded dataset'
        except Exception as e:
            message = f'Uploaded files, but failed to reload dataset: {str(e)}'
            
        return jsonify({'message': 'Mapper updated successfully'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/upload', methods=['POST'])
def upload_query():
    """Process query image and find matches"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
        
    file = request.files['file']
    if not file:
        return jsonify({'error': 'Empty file'}), 400
        
    try:
        matches = image_service.find_matches(file)
        return jsonify({
            'matches': matches,
            'executionTime': image_service.last_execution_time
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/view/<filename>')
def view_image(filename):
    """Serve an image from the dataset"""
    try:
        # Get the full path from the image service to ensure proper security
        image_path = image_service.get_image_path(filename)
        if not image_path:
            return jsonify({'error': 'Image not found'}), 404
        
        # Send the file with the appropriate mimetype
        return send_file(
            image_path,
            mimetype='image/*',  # Let the browser detect the specific image type
            as_attachment=False
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500