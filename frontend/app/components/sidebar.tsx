"use client"
import React, { useRef, useState } from 'react';
import { audioApi } from '../lib/api-client';
import { FaMusic, FaUpload } from 'react-icons/fa';

const SideBar = () => {
  const [selectedAudio, setSelectedAudio] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
 
  const audioInputRef = useRef<HTMLInputElement>(null);
  const datasetInputRef = useRef<HTMLInputElement>(null);

// app/components/sidebar.tsx
const handleAudioSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    try {
      setSelectedAudio(file.name);
      setIsUploading(true);
      setUploadStatus('Processing query...');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      console.log('Server response:', result); // Debug log

      if (response.ok) {
        if (result.matches && result.matches.length > 0) {
          setUploadStatus(
            `Found ${result.matches.length} matches in ${result.executionTime?.toFixed(2) || 0}ms`
          );
        } else {
          setUploadStatus('No matches found');
        }
      } else {
        throw new Error(result.error || 'Failed to process query');
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`Error: ${error}`);
    } finally {
      setIsUploading(false);
    }
  }
};

  const handleDatasetUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    setUploadStatus('Uploading dataset...');

    try {
      const uploadedFiles = await audioApi.uploadDataset(files);
      setUploadStatus(`Successfully uploaded ${uploadedFiles.length} files`);
    } catch (error) {
      setUploadStatus('Failed to upload dataset');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-64 space-y-4">
      {/* Audio Query Upload */}
      <div className="bg-[#282828] rounded-lg p-4">
        <p className="text-gray-300 mb-2">
          {selectedAudio || 'Select MIDI file to query'}
        </p>
        <input
          type="file"
          ref={audioInputRef}
          onChange={handleAudioSelect}
          accept=".mid,.midi"
          className="hidden"
        />
        <button
          className="bg-[#1DB954] text-white px-4 py-2 rounded-full w-full hover:bg-opacity-80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          onClick={() => audioInputRef.current?.click()}
          disabled={isUploading}
        >
          <FaMusic /> Upload Query
        </button>
      </div>

      {/* Dataset Controls */}
      <div className="space-y-2">
        <input
          type="file"
          ref={datasetInputRef}
          onChange={handleDatasetUpload}
          accept=".mid,.midi"
          multiple
          className="hidden"
        />
        <button
          className={`w-full text-left py-2 px-4 rounded hover:bg-[#282828] transition-colors flex items-center gap-2 ${isUploading ? 'opacity-50' : ''}`}
          onClick={() => datasetInputRef.current?.click()}
          disabled={isUploading}
        >
          <FaUpload /> Upload Dataset
        </button>
      </div>

      {/* Status Display */}
      <div className="text-[#1DB954] space-y-1 text-sm p-4 bg-[#282828] rounded-lg">
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>
    </div>
  );
};

export default SideBar;