import React from 'react';
import { Link } from 'react-router-dom';
import bgOverlay from '../assets/image_9.jpg';

const OverlaySection = () => {
  return (
    <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
      {/* Background with parallax effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: `url(${bgOverlay})` }}
      />
      
      {/* Dark semi-transparent overlay for contrast */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Content - Fully Centered, Compact, and Elegant */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center 
                      animate-in fade-in slide-in-from-bottom-10 duration-1000">
        
        <span className="inline-block text-[8px] md:text-[10px] font-bold tracking-[0.7em] text-white/70 uppercase mb-6 drop-shadow-md">
          Elegance Couture
        </span>

        <h2 className="text-xl md:text-3xl lg:text-4xl font-serif italic text-white mb-4 tracking-[0.1em] leading-relaxed drop-shadow-2xl max-w-xl">
          Elevate Your Wardrobe, <br className="hidden md:block" />
          Embrace Timeless Style!
        </h2>

        <div className="w-12 h-px bg-white/20 mb-4" />

        <p className="text-white/70 text-[9px] md:text-[11px] tracking-[0.2em] font-medium mb-8 leading-loose max-w-md mx-auto drop-shadow-lg px-4 uppercase">
            Curated silhouettes crafted <br className="hidden md:block" /> for the epitome of chic sophistication.
        </p>

        <Link
          to="/shop"
          className="inline-block px-12 py-4 text-[8px] font-bold tracking-[0.5em] text-black border border-white bg-white uppercase shadow-2xl"
        >
          Explore Collection
        </Link>
      </div>
    </section>
  );
};

export default OverlaySection;
