'use client';

import React, { useState, useEffect } from 'react';
import { audioApi, AudioMatch } from '../lib/api-client';
import { FaMusic } from 'react-icons/fa';
import MidiPlayer from '../components/midiplayer';
import { RiSearchLine } from "react-icons/ri";

const ITEMS_PER_PAGE = 12;

interface MusicItem {
  filename: string;
  similarity?: number;
}

export default function MusicPage() {
  const [audioFiles, setAudioFiles] = useState<MusicItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<MusicItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Load initial dataset
  useEffect(() => {
    const loadInitialDataset = async () => {
      try {
        setIsLoading(true);
        const files = await audioApi.getDataset();
        const musicItems = files.map(filename => ({ filename }));
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

  const handleQueryResult = (matches: AudioMatch[], time: number) => {
    if (matches.length === 0) {
      setFilteredFiles([]);
      return;
    }

    const matchedFiles = matches.map(m => ({
      filename: m.filename,
      similarity: m.similarity
    }));

    const otherFiles = audioFiles
      .filter(f => !matches.find(m => m.filename === f.filename))
      .map(f => ({ filename: f.filename }));

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
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative flex flex-row items-center">
          <RiSearchLine className="absolute left-4 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#282828] text-white rounded-full py-2 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
          />
        </div>
      </div>

      {/* Execution Time Display */}
      {executionTime && (
        <div className="mb-4 text-[#B3B3B3]">
          Query executed in {executionTime.toFixed(2)}ms
        </div>
      )}

      {/* No Results Message */}
      {filteredFiles.length === 0 && (
        <div className="text-center text-[#B3B3B3] py-8">
          No matches found
        </div>
      )}

      {/* Audio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedFiles.map((file) => (
          <div
            key={file.filename}
            className="bg-[#282828] p-4 rounded-lg group hover:bg-[#282828]/80 transition-colors"
          >
            <div className="relative bg-[#3E3E3E] w-full aspect-video rounded-md mb-4 flex items-center justify-center">
              <FaMusic className="text-4xl text-[#1DB954]" />
              {file.similarity && (
                <span className="text-[#1DB954] absolute top-2 right-2 bg-[#282828] px-2 py-1 rounded-full text-sm">
                  {file.similarity.toFixed(1)}% Match
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#B3B3B3] group-hover:text-white transition-colors truncate flex-1">
                {file.filename}
              </span>
              <MidiPlayer midiUrl={`/api/audio/play/${file.filename}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {filteredFiles.length > 0 && (
        <div className="mt-6 flex items-center justify-center gap-4">
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