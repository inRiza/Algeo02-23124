import React from 'react'
import { Pagination, PlayIcon } from '../components/pagination';

export default function MusicPage() {
  const musicFiles = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `music${i + 1}.wav`
  }));

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {musicFiles.map((music) => (
          <div
            key={music.id}
            className="bg-[#282828] p-4 rounded-lg group hover:bg-[#282828]/80 transition-colors"
          >
            <div className="bg-[#3E3E3E] w-full aspect-video rounded-md mb-4"></div>
            <div className="flex items-center justify-between">
              <span className="text-[#B3B3B3] group-hover:text-white transition-colors">
                {music.name}
              </span>
              <button className="text-[#1DB954] hover:text-white transition-colors">
                <PlayIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Pagination />
    </>
  );
}