import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategorySection = ({ onCategorySelect }) => {
  const { categories, loading } = useApp();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'right' ? amount : -amount,
        behavior: 'smooth'
      });
    }
  };

  if (loading && categories.length === 0) return null;

  return (
    <section id="categories" className="pt-12 pb-6 bg-[#fafafa] relative group/sidebar border-y border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.5em] mb-3 block">Shop by Style</span>
          <h2 className="text-2xl font-serif italic text-gray-900">The Curation</h2>
          <div className="w-10 h-px bg-black mx-auto mt-4 opacity-10" />
        </div>

        <div className="relative">
          {/* Navigation Arrows - Refined Styling */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-[-30px] top-[35%] -translate-y-1/2 z-10 p-2 text-gray-300 hover:text-black transition-all duration-300 opacity-0 group-hover/sidebar:opacity-100 hidden lg:block"
          >
            <ChevronLeft size={40} strokeWidth={1} />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-[-30px] top-[35%] -translate-y-1/2 z-10 p-2 text-gray-300 hover:text-black transition-all duration-300 opacity-0 group-hover/sidebar:opacity-100 hidden lg:block"
          >
            <ChevronRight size={40} strokeWidth={1} />
          </button>

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto no-scrollbar gap-10 md:gap-14 pb-12 scroll-smooth items-start justify-start"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            {categories.map((category) => (
              <div 
                key={category._id} 
                className="flex flex-col items-center group cursor-pointer flex-shrink-0"
                onClick={() => {
                  const grid = document.getElementById('products');
                  if (grid) grid.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {/* Smaller, more refined bubbles */}
                <div className="relative w-28 h-28 md:w-40 md:h-40 rounded-full p-1 border border-transparent group-hover:border-black/10 transition-all duration-700 ease-out bg-white shadow-sm group-hover:shadow-2xl overflow-hidden">
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <img 
                      src={category.image} 
                      alt={category.categoryName} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out brightness-95 group-hover:brightness-105"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                </div>
                
                <h3 className="mt-8 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 group-hover:text-black transition-all duration-500 text-center">
                  {category.categoryName}
                </h3>
                <div className="w-0 group-hover:w-8 h-px bg-black mt-2 transition-all duration-500 opacity-0 group-hover:opacity-30" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
