'use client';

import React, { useState, useEffect, useRef } from 'react';
import { imageApi } from '../lib/api-client';
import { FaImage, FaUpload, FaMusic } from 'react-icons/fa';
import { RiFileListLine, RiSearchLine } from 'react-icons/ri';

const ITEMS_PER_PAGE = 12;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface AlbumItem {
    filename: string;
    similarity?: number;
    audioFile?: string;
}

export default function AlbumPage() {
    const [albums, setAlbums] = useState<AlbumItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [executionTime, setExecutionTime] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFiles, setFilteredFiles] = useState<AlbumItem[]>([]);

    const queryInputRef = useRef<HTMLInputElement>(null);
    const datasetInputRef = useRef<HTMLInputElement>(null);
    const mapperInputRef = useRef<HTMLInputElement>(null);

    const loadInitialDataset = async () => {
        try {
            setIsLoading(true);
            const response = await imageApi.getDataset();
            
            // Convert response to AlbumItems
            const albumItems: AlbumItem[] = response.map(file => {
                if (typeof file === 'object' && file !== null) {
                    return {
                        filename: file.filename,
                        audioFile: file.audioFile
                    };
                }
                // Fallback if response is just string array
                return {
                    filename: String(file),
                    audioFile: undefined
                };
            });
    
            setAlbums(albumItems);
            setFilteredFiles(albumItems);
        } catch (error) {
            setUploadStatus('Failed to load dataset');
            console.error('Failed to load dataset:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadInitialDataset();
    }, []);

    useEffect(() => {
        const filtered = albums.filter(file => 
          file.filename.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredFiles(filtered);
        setCurrentPage(1);
      }, [searchTerm, albums]);

    const handleQuerySelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        try {
            setUploadStatus('Processing query...');
            const result = await imageApi.uploadQuery(file);
            
            if (result.matches.length === 0) {
                setUploadStatus('No matches found for your query');
                await loadInitialDataset();
                return;
            }
    
            const matchedAlbums = result.matches.map(m => ({
                filename: m.filename,
                similarity: m.similarity,
                audioFile: m.audioFile
            }));
    
            const otherAlbums = albums
                .filter(a => !result.matches.find(m => m.filename === a.filename))
                .map(a => ({
                    filename: a.filename,
                    audioFile: a.audioFile
                }));
    
            setAlbums([...matchedAlbums, ...otherAlbums]);
            setExecutionTime(result.executionTime);
            setCurrentPage(1);
            setUploadStatus(`Found ${result.matches.length} matching images`);
        } catch (error) {
            setUploadStatus('Error processing query');
            console.error('Query error:', error);
        }
    };

    const handleDatasetUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files?.length) return;

        try {
            setUploadStatus('Uploading dataset...');
            await imageApi.uploadDataset(files);
            await loadInitialDataset();
            setUploadStatus(`Successfully uploaded ${files.length} files`);
        } catch (error) {
            setUploadStatus('Failed to upload dataset');
            console.error('Upload error:', error);
        }
    };

    const handleMapperUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploadStatus('Uploading mapper...');
            await imageApi.uploadMapper(file);
            await loadInitialDataset();
            setUploadStatus('Mapper uploaded successfully');
        } catch (error) {
            setUploadStatus('Failed to upload mapper');
            console.error('Mapper error:', error);
        }
    };

    const totalPages = Math.ceil(filteredFiles.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedAlbums = filteredFiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
            <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-[#282828] p-4 rounded-lg">
                    <input
                        type="file"
                        ref={queryInputRef}
                        onChange={handleQuerySelect}
                        accept=".jpg,.jpeg,.png"
                        className="hidden"
                    />
                    <button
                        className="bg-[#1DB954] text-white px-4 py-2 rounded-full w-full hover:bg-opacity-80 transition-colors flex items-center justify-center gap-2"
                        onClick={() => queryInputRef.current?.click()}
                    >
                        <FaImage /> Upload Query
                    </button>
                </div>

                <div className="flex-1 bg-[#282828] p-4 rounded-lg">
                    <input
                        type="file"
                        ref={datasetInputRef}
                        onChange={handleDatasetUpload}
                        accept=".jpg,.jpeg,.png"
                        multiple
                        className="hidden"
                    />
                    <button
                        className="bg-[#1DB954] text-white px-4 py-2 rounded-full w-full hover:bg-opacity-80 transition-colors flex items-center justify-center gap-2"
                        onClick={() => datasetInputRef.current?.click()}
                    >
                        <FaUpload /> Upload Dataset
                    </button>
                </div>

                <div className="flex-1 bg-[#282828] p-4 rounded-lg">
                    <input
                        type="file"
                        ref={mapperInputRef}
                        onChange={handleMapperUpload}
                        accept=".txt,.json"
                        className="hidden"
                    />
                    <button
                        className="bg-[#1DB954] text-white px-4 py-2 rounded-full w-full hover:bg-opacity-80 transition-colors flex items-center justify-center gap-2"
                        onClick={() => mapperInputRef.current?.click()}
                    >
                        <RiFileListLine /> Upload Mapper
                    </button>
                </div>
            </div>

            {uploadStatus && (
                <div className="mb-4 px-4 py-2 bg-[#282828] rounded-lg text-[#1DB954]">
                    {uploadStatus}
                </div>
            )}

            {executionTime && (
                <div className="mb-4 text-[#B3B3B3]">
                    Query executed in {executionTime.toFixed(2)}ms
                </div>
            )}

            {displayedAlbums.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#282828] rounded-lg">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">No Images Found</h3>
                    <p className="text-[#B3B3B3] text-center max-w-md">
                        {albums.length === 0 
                            ? "Start by uploading some images to your dataset using the 'Upload Dataset' button above."
                            : "No images match your search criteria. Try a different query image or upload more images to the dataset."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {displayedAlbums.map((album) => (
                        <div
                            key={album.filename}  
                            className="bg-[#282828] p-4 rounded-lg group hover:bg-[#282828]/80 transition-colors"
                        >
                            <div className="relative bg-[#3E3E3E] w-full aspect-square rounded-md mb-4">
                                <img
                                    src={`${API_URL}/api/image/view/${album.filename}`}
                                    alt={album.filename}
                                    className="w-full h-full object-cover rounded-md"
                                />
                                {album.similarity && (
                                    <span className="absolute top-2 right-2 bg-[#282828] px-2 py-1 rounded-full text-sm text-[#1DB954]">
                                        {album.similarity.toFixed(1)}% Match
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[#B3B3B3] group-hover:text-white transition-colors">
                                    {album.filename}
                                </span>
                                {album.audioFile ? (
                                    <div className="flex items-center gap-2 text-sm text-[#1DB954]">
                                        <FaMusic />
                                        <span className="truncate">{album.audioFile}</span>
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-500 italic">
                                        No audio file mapped
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        )}
        
            <div className="mt-6 flex items-center justify-center gap-4">
                <button
                    className="text-[#B3B3B3] hover:text-white transition-colors disabled:opacity-50"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="text-[#B3B3B3]">
                    Page {currentPage} of {totalPages || 1}
                </span>
                <button
                    className="text-[#B3B3B3] hover:text-white transition-colors disabled:opacity-50"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}