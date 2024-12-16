"use client"
import React, { useRef, useState } from 'react';
import { audioApi, imageApi } from '../lib/api-client';
import { FaMusic, FaUpload, FaImage } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

const SideBar = () => {
  const pathname = usePathname();
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  
  const queryInputRef = useRef<HTMLInputElement>(null);
  const datasetInputRef = useRef<HTMLInputElement>(null);
  const mapperInputRef = useRef<HTMLInputElement>(null);

  const isAlbumPage = pathname === '/album';

  const [matchDetails, setMatchDetails] = useState<{
    filename: string;
    similarity: number;
  } | null>(null);

  const handleQuerySelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSelectedFile(file.name);
      setIsUploading(true);
      setUploadStatus('Processing query...');
      setMatchDetails(null);

      const result = await audioApi.uploadQuery(file);

      if (result.matches && result.matches.length > 0) {
        const bestMatch = result.matches[0]; // Get the best match
        setMatchDetails(bestMatch);
        setUploadStatus(
          `Found match in ${result.executionTime?.toFixed(2) || 0}ms`
        );
      } else {
        setUploadStatus('No matches found above similarity threshold (65%)');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`Error: ${error}`);
      setMatchDetails(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDatasetUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    setUploadStatus('Uploading dataset...');

    try {
      const uploadedFiles = isAlbumPage
        ? await imageApi.uploadDataset(files)
        : await audioApi.uploadDataset(files);
      setUploadStatus(`Successfully uploaded ${uploadedFiles.length} files`);
    } catch (error) {
      setUploadStatus('Failed to upload dataset');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMapperUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('Uploading mapper...');

    try {
      await imageApi.uploadMapper(file);
      setUploadStatus('Successfully uploaded mapper file');
    } catch (error) {
      setUploadStatus('Failed to upload mapper');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-64 space-y-4">
      {/* Query Upload */}
      <div className="bg-[#282828] rounded-lg p-4">
        <p className="text-gray-300 mb-2">
          {selectedFile || (isAlbumPage ? 'Select image to query' : 'Select MIDI file to query')}
        </p>
        <input
          type="file"
          ref={queryInputRef}
          onChange={handleQuerySelect}
          accept={isAlbumPage ? ".jpg,.jpeg,.png" : ".mid,.midi"}
          className="hidden"
        />
        <button
          className="bg-[#1DB954] text-white px-4 py-2 rounded-full w-full hover:bg-opacity-80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          onClick={() => queryInputRef.current?.click()}
          disabled={isUploading}
        >
          {isAlbumPage ? <FaImage /> : <FaMusic />} Upload Query
        </button>
      </div>

      {/* Dataset Controls */}
      <div className="space-y-2">
        <input
          type="file"
          ref={datasetInputRef}
          onChange={handleDatasetUpload}
          accept={isAlbumPage ? ".jpg,.jpeg,.png" : ".mid,.midi"}
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

        {isAlbumPage && (
          <>
            <input
              type="file"
              ref={mapperInputRef}
              onChange={handleMapperUpload}
              accept=".txt,.json"
              className="hidden"
            />
            <button
              className="w-full text-left py-2 px-4 rounded hover:bg-[#282828] transition-colors flex items-center gap-2"
              onClick={() => mapperInputRef.current?.click()}
              disabled={isUploading}
            >
              <FaUpload /> Upload Mapper
            </button>
          </>
        )}
      </div>

      {/* Status Display */}
      <div className="text-[#1DB954] space-y-2 p-4 bg-[#282828] rounded-lg">
        {uploadStatus && <p>{uploadStatus}</p>}
        {matchDetails && (
          <div className="text-sm">
            <p className="font-medium">Best match:</p>
            <p>{matchDetails.filename}</p>
            <p className="text-[#B3B3B3]">
              {matchDetails.similarity.toFixed(1)}% similarity
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;