import React from 'react'
import { FaSpotify } from 'react-icons/fa';
import { RiSearchLine } from "react-icons/ri";

const NavBar = () => {
    return (
        <nav className="bg-[#191414] p-4 flex items-center justify-between fixed top-0 left-0 w-full">
          <div className="flex items-center ml-8">
          <div className="relative flex flex-row items-center justify-center">
            <RiSearchLine className="absolute left-4 text-2xl text-white" />
            <input 
                type="text" 
                placeholder="What do you want to play?" 
                className="bg-[#282828] text-white rounded-full py-2 px-4 w-80 pl-12 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
            />
          </div>
          </div>
          <div className='flex items-center mr-8'>
            <FaSpotify className='text-[#1DB954] text-2xl rotate-180'/>
            <h1 className='font-semibold text-2xl text-[#1DB954] ml-2'>Skibiditify</h1>
          </div>
        </nav>
      );
    }

export default NavBar
