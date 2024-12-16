'use client';

import React, { useState, useEffect, useRef } from 'react';
import { imageApi } from '../lib/api-client';
import { FaImage, FaUpload, FaMusic } from 'react-icons/fa';
import { RiFileListLine } from 'react-icons/ri';

const ITEMS_PER_PAGE = 12;

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

    const handleQuerySelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploadStatus('Processing query...');
            const result = await imageApi.uploadQuery(file);
            
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
            setUploadStatus('Query processed successfully');
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

    const totalPages = Math.ceil(albums.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedAlbums = albums.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-[#1DB954]">Loading...</div>
            </div>
        );
    }

    return (
        <div>
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
                        <FaImage /> Query Image
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayedAlbums.map((album) => (
                    <div
                        key={album.filename}  // Using filename as unique key
                        className="bg-[#282828] p-4 rounded-lg group hover:bg-[#282828]/80 transition-colors"
                    >
                        <div className="relative bg-[#3E3E3E] w-full aspect-square rounded-md mb-4">
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