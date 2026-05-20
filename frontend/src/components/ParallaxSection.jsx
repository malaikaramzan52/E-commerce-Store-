import React from 'react';
import { Link } from 'react-router-dom';

const ParallaxSection = ({ bgImage, innerImage, title, cta }) => {
  return (
    <section className="relative w-full py-10 md:py-14 overflow-hidden bg-black flex items-center">
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* Overlay to darken background */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Empty left column to let background show */}
          <div className="hidden md:block"></div>
          
          {/* Right column with inner image and text */}
          <div className="flex flex-col items-center text-center">
            {innerImage && (
              <div className="w-full max-w-sm mb-8">
                <img 
                  src={innerImage} 
                  alt="Collection Highlight" 
                  className="w-full h-auto object-cover shadow-2xl"
                />
              </div>
            )}
            
            <h2 className="text-3xl md:text-4xl font-serif italic text-white mb-8 tracking-wide drop-shadow-md whitespace-pre-line leading-relaxed">
              {title}
            </h2>
            
            {cta && (
              <Link
                to="/shop"
                className="inline-block px-10 py-3 text-[10px] font-bold tracking-[0.3em] text-black uppercase bg-white border border-white shadow-xl"
              >
                {cta}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParallaxSection;
