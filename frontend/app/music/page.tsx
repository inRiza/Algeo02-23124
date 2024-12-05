"use client"
import React, { useState, useEffect } from 'react';
import { audioApi, AudioMatch } from '../lib/api-client';
import { FaPlay, FaMusic } from 'react-icons/fa';

const ITEMS_PER_PAGE = 12;

interface MusicItem {
  filename: string;
  similarity?: number;
}

export default function MusicPage() {
  const [audioFiles, setAudioFiles] = useState<MusicItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial dataset
  useEffect(() => {
    const loadInitialDataset = async () => {
      try {
        setIsLoading(true);
        const files = await audioApi.getDataset();
        setAudioFiles(files.map(filename => ({ filename })));
      } catch (error) {
        console.error('Failed to load dataset:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialDataset();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(audioFiles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedFiles = audioFiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleQueryResult = (matches: AudioMatch[], time: number) => {
    const matchedFiles = matches.map(m => ({ 
      filename: m.filename, 
      similarity: m.similarity 
    }));
    const otherFiles = audioFiles
      .filter(f => !matches.find(m => m.filename === f.filename))
      .map(f => ({ filename: f.filename }));
    
    setAudioFiles([...matchedFiles, ...otherFiles]);
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
    <>
      {/* Execution Time Display */}
      {executionTime && (
        <div className="mb-4 text-[#B3B3B3]">
          Query executed in {executionTime.toFixed(2)}ms
        </div>
      )}

      {/* Audio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedFiles.map((file) => (
          <div
            key={file.filename}
            className="bg-[#282828] p-4 rounded-lg group hover:bg-[#282828]/80 transition-colors"
          >
            <div className="bg-[#3E3E3E] w-full aspect-video rounded-md mb-4 flex items-center justify-center">
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
              <button className="text-[#1DB954] hover:text-white transition-colors ml-2">
                <FaPlay />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
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
    </>
  );
}