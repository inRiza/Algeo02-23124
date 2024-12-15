import React from 'react';
import { FaSpotify, FaHome } from 'react-icons/fa';

const NavBar = () => {
    return (
        <nav className="bg-[#191414] p-4 flex items-center justify-between fixed top-0 left-0 w-full">
            <div className="flex items-center space-x-2 cursor-pointer">
                <FaHome className="text-white text-xl" />
                <span className="text-white text-base font-medium">Home</span>
            </div>

            <div className="flex items-center space-x-3">
                <FaSpotify className="text-[#1DB954] text-3xl rotate-180" />
                <h1 className="font-bold text-xl text-[#1DB954]">Skibiditify</h1>
            </div>

            <div className="cursor-pointer">
                <span className="text-white text-base font-medium">About the Website</span>
            </div>
        </nav>
    );
}

export default NavBar;