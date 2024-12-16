"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import hiAnimation from "../public/hi.png"

const HomePage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="bg-[#191414] text-white min-h-screen pt-24 px-8 flex flex-col items-center">
      <div className="max-w-3xl text-center mb-12" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-[#1DB954] mb-6">
          Welcome to Skibiditify
        </h1>
        <p className="text-lg leading-relaxed">
          The best website to find albums and music with ease and precision. Skibiditify specializes in advanced search methods to give you the best music discovery experience.
        </p>
      </div>

      <div className="text-center mt-8" data-aos="fade-up" data-aos-delay="200">
        <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
          <Image
            src={hiAnimation}
            alt="Say Hi"
            width={200}
            height={200}
            className="object-cover"
          />
        </div>
      </div>

      <div className="text-center mt-8" data-aos="fade-up" data-aos-delay="200">
        <p className="text-lg text-white">
          Start exploring albums and music today with our powerful search features!
        </p>
      </div>
    </div>
  );
};

export default HomePage;
