'use client';

import React, { useState, useEffect } from 'react';
import { imageApi, ImageMatch } from '../lib/api-client';
import { FaImage } from 'react-icons/fa';

const ITEMS_PER_PAGE = 12;

interface AlbumItem {
  filename: string;
  similarity?: number;
  audioFile?: string;  // For mapping to audio files
}

export default function AlbumPage() {
  const [albums, setAlbums] = useState<AlbumItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapper, setMapper] = useState<Record<string, string>>({});

  // Load initial dataset
  useEffect(() => {
    const loadInitialDataset = async () => {
      try {
        setIsLoading(true);
        const files = await imageApi.getDataset();
        const mappingData = await imageApi.getMapper();
        setMapper(mappingData);
        setAlbums(files.map(filename => ({ 
          filename,
          audioFile: mappingData[filename]
        })));
      } catch (error) {
        console.error('Failed to load dataset:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialDataset();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(albums.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedAlbums = albums.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleQueryResult = (matches: ImageMatch[], time: number) => {
    const matchedAlbums = matches.map(m => ({
      filename: m.filename,
      similarity: m.similarity,
      audioFile: mapper[m.filename]
    }));
    const otherAlbums = albums
      .filter(f => !matches.find(m => m.filename === f.filename))
      .map(f => ({ 
        filename: f.filename,
        audioFile: mapper[f.filename]
      }));
    setAlbums([...matchedAlbums, ...otherAlbums]);
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
      {executionTime && (
        <div className="mb-4 text-[#B3B3B3]">
          Query executed in {executionTime.toFixed(2)}ms
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedAlbums.map((album) => (
          <div
            key={album.filename}
            className="bg-[#282828] p-4 rounded-lg group hover:bg-[#282828]/80 transition-colors"
          >
            <div className="relative bg-[#3E3E3E] w-full aspect-video rounded-md mb-4 flex items-center justify-center">
              <img 
                src={`/api/images/${album.filename}`}
                alt={album.filename}
                className="w-full h-full object-cover rounded-md"
              />
              {album.similarity && (
                <span className="absolute top-2 right-2 bg-[#282828] px-2 py-1 rounded-full text-sm text-[#1DB954]">
                  {album.similarity.toFixed(1)}% Match
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1 truncate">
                <span className="text-[#B3B3B3] group-hover:text-white transition-colors">
                  {album.filename}
                </span>
                {album.audioFile && (
                  <span className="text-[#B3B3B3] text-sm block truncate">
                    {album.audioFile}
                  </span>
                )}
              </div>
              <button className="text-[#1DB954] hover:text-white transition-colors">
                <FaImage />
              </button>
            </div>
          </div>
        ))}
      </div>

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