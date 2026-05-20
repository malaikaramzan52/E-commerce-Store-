import React from 'react';
import { Link } from 'react-router-dom';
import silkImg from '../assets/image_4.webp';

const ProfessionalBlazerSection = () => {
  return (
    <section className="py-20 md:py-0 bg-white md:min-h-[70vh] flex items-center">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-stretch">
        
        {/* Text Content - Left Side */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-16 bg-white">
          <div className="max-w-md">
            <span className="block text-[10px] font-bold tracking-[0.5em] text-gray-400 uppercase mb-5">
              Traditional & Timeless
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif italic text-gray-900 mb-8 leading-tight tracking-tight">
              Luxe Silk <br className="hidden md:block" />
              Heritage Ensemble
            </h2>
            <p className="text-gray-500 mb-12 leading-relaxed font-light text-sm md:text-base tracking-wide">
              Embrace the luster of premium silk with our Heritage Ensemble. Each piece is a masterpiece of intricate needlework and traditional craftsmanship, designed to make every moment feel royal.
            </p>
            <Link
              to="/shop"
              className="inline-block px-14 py-5 text-[10px] font-bold tracking-[0.4em] text-white bg-black border border-black uppercase shadow-xl"
            >
              Shop The Collection
            </Link>
          </div>
        </div>

        {/* Image Content - Right Side */}
        <div className="w-full md:w-1/2 relative bg-[#F9F7F5]">
           <img 
             src={silkImg}
             alt="Pakistani Luxe Silk Collection"
             className="w-full h-full object-cover min-h-[500px] md:min-h-[650px]"
           />
        </div>

      </div>
    </section>
  );
};


export default ProfessionalBlazerSection;
