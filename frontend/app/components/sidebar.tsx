import React from 'react'

const SideBar = () => {
  return (
    <div className="w-64 space-y-4">
      <div className="bg-[#282828] rounded-lg p-4">
        <p className="text-gray-300 mb-2">Audio_Name.wav</p>
        <button className="bg-[#1DB954] text-white px-4 py-2 rounded-full w-full hover:bg-opacity-80 transition-colors">
            Upload
        </button>
      </div>
      
      <div className="space-y-2">
        <button className="w-full text-left py-2 px-4 rounded hover:bg-[#282828] transition-colors">
            Audios
        </button>
        <button className="w-full text-left py-2 px-4 rounded hover:bg-[#282828] transition-colors">
            Pictures
        </button>
        <button className="w-full text-left py-2 px-4 rounded hover:bg-[#282828] transition-colors">
            Mapper
        </button>
      </div>
      
      <div className="text-[#B3B3B3] space-y-1 text-sm">
        <p>Audios: audios.zip</p>
        <p>Pictures: pictures.zip</p>
        <p>Mapper: mapper.txt</p>
      </div>
    </div>
  )
}

export default SideBar
