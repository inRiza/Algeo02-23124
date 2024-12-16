"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";

import ppRaihaan from "../public/profileRaihaan.jpeg";
import ppArdell from "../public/profileArdell.jpeg";
import ppRizain from "../public/profileRizain.jpeg";

const AboutPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="bg-[#191414] text-white min-h-screen pt-24 px-8 flex flex-col items-center">
      <div className="max-w-3xl text-center mb-12" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-[#1DB954] mb-6">
          About the Website
        </h1>
        <p className="text-lg leading-relaxed">
          Welcome to{" "}
          <span className="text-[#1DB954] font-semibold">Skibiditify</span>! 
          This website is a platform that develops a{" "}
          <span className="font-semibold">Information Retrieval</span> system for{" "}
          <span>audio</span> and images
          by applying the concept of <span className="font-semibold">linear algebra</span>. The system
          built has two main features{" "}
          <span className="text-[#1DB954] font-semibold">
            Music Information Retrieval (MIR)
          </span>{" "}
          using <span className="font-semibold">Query by Humming</span> and{" "}
          <span className="text-[#1DB954] font-semibold">
            Image Retrieval
          </span>{" "}
          using <span className="font-semibold">
            Principal Component Analysis (PCA)
          </span>{" "}
          for album image search. These two features are integrated into
          a web interface that allows users to search using both{" "}
          <span>audio</span> and{" "}images.
        </p>
      </div>

      <div className="text-center mb-8" data-aos="fade-up" data-aos-delay="200">
        <h2 className="text-3xl font-bold text-[#1DB954] mb-4">Developers</h2>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        <div className="bg-[#282828] rounded-lg shadow-lg p-4 w-64 text-center" data-aos="flip-left" data-aos-delay="300">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
            <Image
              src={ppRaihaan}
              alt="Muhammad Raihaan Perdana"
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Muhammad Raihaan Perdana</h3>
          <p className="text-[#1DB954] font-medium">NIM: 13523124</p>
        </div>

        <div className="bg-[#282828] rounded-lg shadow-lg p-4 w-64 text-center" data-aos="flip-left" data-aos-delay="400">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
            <Image
              src={ppArdell}
              alt="Ardell Aghna Mahendra"
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Ardell Aghna Mahendra</h3>
          <p className="text-[#1DB954] font-medium">NIM: 13523151</p>
        </div>

        <div className="bg-[#282828] rounded-lg shadow-lg p-4 w-64 text-center" data-aos="flip-left" data-aos-delay="500">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
            <Image
              src={ppRizain}
              alt="Muhammad Rizain Firdaus"
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Muhammad Rizain Firdaus</h3>
          <p className="text-[#1DB954] font-medium">NIM: 13523164</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
