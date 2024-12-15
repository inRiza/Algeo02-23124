"use client"
import React, { useEffect } from "react";
import Image from "next/image"; // Import Next.js Image
import AOS from "aos"; // Import AOS
import "aos/dist/aos.css"; // Import AOS CSS

import ppRaihaan from "../public/profileRaihaan.jpeg";
import ppArdell from "../public/profileArdell.jpeg";
import ppRizain from "../public/profileRizain.jpeg";

const AboutPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Durasi animasi
      once: true, // Animasi hanya dijalankan sekali
    });
  }, []);

  return (
    <div className="bg-[#191414] text-white min-h-screen pt-24 px-8 flex flex-col items-center">
      <div className="max-w-3xl text-center mb-12" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-[#1DB954] mb-6">
          About the Website
        </h1>
        <p className="text-lg leading-relaxed">
          Selamat datang di{" "}
          <span className="text-[#1DB954] font-semibold">Skibiditify</span>! 
          Website ini adalah platform yang mengembangkan sistem{" "}
          <span className="font-semibold">Information Retrieval</span> untuk{" "}
          <span className="italic">audio</span> dan gambar
          dengan menerapkan konsep <span className="font-semibold">aljabar linear</span>. Sistem 
          yang dibangun memiliki dua fitur utama, yaitu{" "}
          <span className="text-[#1DB954] font-semibold">
            Music Information Retrieval (MIR)
          </span>{" "}
          menggunakan <span className="font-semibold">Query by Humming</span> dan{" "}
          <span className="text-[#1DB954] font-semibold">
            Image Retrieval
          </span>{" "}
          menggunakan <span className="font-semibold">
            Principal Component Analysis (PCA)
          </span>{" "}
          untuk pencarian gambar album. Kedua fitur ini diintegrasikan dalam
          sebuah antarmuka web yang memungkinkan pengguna melakukan pencarian
          melalui input <span className="italic">audio</span> maupun{" "}gambar.
        </p>
      </div>

      <div className="text-center mb-8" data-aos="fade-up" data-aos-delay="200">
        <h2 className="text-3xl font-bold text-[#1DB954] mb-4">Developers</h2>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {/* Card 1 */}
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

        {/* Card 2 */}
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

        {/* Card 3 */}
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
