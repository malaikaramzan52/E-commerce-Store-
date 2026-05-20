import React from 'react';
import { Link } from 'react-router-dom';
import discoverBg from '../assets/parallex.jpg';
import discoverImg from '../assets/image_5.webp';

const DiscoverSection = () => {
  return (
    <section id="discover" className="relative min-h-[70vh] flex items-center py-10 md:py-14">
      {/* Background dressing image with parallax/fixed effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: `url(${discoverBg})` }}
      />
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Main Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Overlapping Image - Border Removed as requested */}
        <div className="relative -mt-40 md:-mt-64 mb-16 animate-in fade-in slide-in-from-bottom duration-1000 max-w-sm md:max-w-md">
           <div className="shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden scale-105">
              <img 
                src={discoverImg} 
                alt="Heritage Collection" 
                className="w-full aspect-[4/5] object-cover"
              />
           </div>
        </div>

        {/* Text Section - Left aligned */}
        <div className="max-w-2xl mt-8 text-left animate-in fade-in slide-in-from-left duration-1000 delay-300">
          <h2 className="text-3xl md:text-5xl font-serif italic text-white mb-6 leading-tight tracking-wider drop-shadow-lg">
            Discover The Allure Of <br />
            Heritage Couture!
          </h2>
          <p className="text-white/80 text-sm md:text-base tracking-[0.1em] font-light mb-12 leading-relaxed max-w-md drop-shadow-md">
            Step into a world where tradition meets modernity. Our latest collection celebrates the fine art of hand-embroidery and timeless silhouettes. <br className="hidden md:block" /> 
            Redefine your wardrobe narrative with pieces that tell a story.
          </p>
          <Link
            to="/shop"
            className="inline-block px-12 py-4 text-[10px] font-bold tracking-[0.4em] text-black uppercase bg-white border border-white shadow-2xl"
          >
            Explore Traditions
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DiscoverSection;
