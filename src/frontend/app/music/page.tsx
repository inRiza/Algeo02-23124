'use client';

import React, { useState, useEffect } from 'react';
import { audioApi, imageApi, AudioMatched } from '../lib/api-client';
import { FaMusic } from 'react-icons/fa';
import MidiPlayer from '../components/midiplayer';
import { RiSearchLine } from "react-icons/ri";

const ITEMS_PER_PAGE = 12;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface MusicItem {
  filename: string;
  similarity?: number;
  albumImage?: string;  // Name of the corresponding album image
}

export default function MusicPage() {
  const [audioFiles, setAudioFiles] = useState<MusicItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<MusicItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Load initial dataset with mapper information
  useEffect(() => {
    const loadInitialDataset = async () => {
      try {
        setIsLoading(true);
        // Get audio files
        const files = await audioApi.getDataset();
        
        // Get image mapper
        const mapper = await imageApi.getMapper();
        
        // Create MusicItems with album images
        const musicItems = files.map(filename => ({
          filename,
          albumImage: Object.entries(mapper).find(([image, audio]) => audio === filename)?.[0]
        }));
        
        setAudioFiles(musicItems);
        setFilteredFiles(musicItems);
      } catch (error) {
        console.error('Failed to load dataset:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialDataset();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = audioFiles.filter(file => 
      file.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFiles(filtered);
    setCurrentPage(1);
  }, [searchTerm, audioFiles]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredFiles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedFiles = filteredFiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleQueryResult = (matches: AudioMatched[], time: number) => {
    if (matches.length === 0) {
      setFilteredFiles([]);
      return;
    }

    const matchedFiles = matches.map(m => ({
      filename: m.filename,
      similarity: m.similarity,
      albumImage: audioFiles.find(f => f.filename === m.filename)?.albumImage
    }));

    const otherFiles = audioFiles
      .filter(f => !matches.find(m => m.filename === f.filename));

    setFilteredFiles([...matchedFiles, ...otherFiles]);
    setExecutionTime(time);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#1DB954]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <RiSearchLine className="absolute left-4 text-gray-400 text-xl top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#282828] text-white rounded-full py-2 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
        />
      </div>

      {/* Execution Time Display */}
      {executionTime && (
        <div className="text-[#B3B3B3]">
          Query executed in {executionTime.toFixed(2)}ms
        </div>
      )}

      {/* No Results Message */}
      {filteredFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#282828] rounded-lg">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold mb-2">No Music Found</h3>
          <p className="text-[#B3B3B3] text-center max-w-md">
            {audioFiles.length === 0 
              ? "Start by uploading some music to your dataset"
              : "No music matches your current search"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayedFiles.map((file) => (
            <div
              key={file.filename}
              className="bg-[#282828] p-4 rounded-lg group hover:bg-[#282828]/80 transition-colors"
            >
              <div className="relative bg-[#3E3E3E] w-full aspect-square rounded-md mb-4">
                {file.albumImage ? (
                  <img
                    src={`${API_URL}/api/image/view/${file.albumImage}`}
                    alt={`Album art for ${file.filename}`}
                    className="w-full h-full object-cover rounded-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMzRTNFM0UiLz48cGF0aCBkPSJNNDUgMzBMNjUgNTBMNDUgNzAiIHN0cm9rZT0iIzFEQjk1NCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaMusic className="text-3xl text-[#1DB954]" />
                  </div>
                )}
                {file.similarity && (
                  <span className="absolute top-2 right-2 bg-[#282828] px-2 py-1 rounded-full text-sm text-[#1DB954]">
                    {file.similarity.toFixed(1)}% Match
                  </span>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-sm text-[#B3B3B3] group-hover:text-white transition-colors truncate">
                  {file.filename}
                </span>
                <div className="flex items-center justify-between">
                  {file.albumImage && (
                    <span className="text-xs text-[#1DB954]">
                      Has album art
                    </span>
                  )}
                  <MidiPlayer midiUrl={`${API_URL}/api/audio/play/${file.filename}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredFiles.length > 0 && (
        <div className="flex items-center justify-center gap-4">
          <button
            className="text-[#B3B3B3] hover:text-white transition-colors disabled:opacity-50"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-[#B3B3B3]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="text-[#B3B3B3] hover:text-white transition-colors disabled:opacity-50"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}