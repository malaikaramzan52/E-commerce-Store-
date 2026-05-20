import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import her2 from '../assets/her_2.jpg';
import hero1 from '../assets/hero_1.webp';

const slides = [
  {
    id: 1,
    image: her2,
    title: 'Heritage & Grace',
    subtitle: 'THE LUXE COLLECTION',
    description: 'Experience the essence of tradition with our exquisite hand-embroidered collection. Crafted with love, designed for the modern woman who values her roots.',
    cta: 'EXPLORE LUXURY'
  },
  {
    id: 2,
    image: hero1,
    title: 'Festive Allure \n Redefined',
    subtitle: 'CELEBRATION WEAR',
    description: 'Discover the perfect blend of vibrant colors and intricate silhouettes. Make every occasion unforgettable with our curated festive masterpieces.',
    cta: 'SHOP FESTIVE'
  }
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 8000); // Slower for premium feel
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          {/* Background Image with Parallax (bg-fixed) */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed transition-transform duration-[8000ms] ease-linear"
            style={{ 
                backgroundImage: `url(${slide.image})`,
                transform: index === current ? 'scale(1.1)' : 'scale(1)'
            }}
          />
          {/* Overlay gradient/darkening to make text readable */}
          <div className="absolute inset-0 bg-black/30 backdrop-contrast-125" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center text-center px-4 pt-20">
            <div className="max-w-4xl mx-auto animate-fade-in flex flex-col items-center">

              <p className="text-[10px] md:text-xs font-bold tracking-[0.5em] text-white/90 uppercase mb-5 animate-slide-up">
                {slide.subtitle}
              </p>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif italic text-white mb-6 tracking-wider drop-shadow-2xl whitespace-pre-line leading-tight animate-slide-up-delayed min-h-[2.4em] flex items-center justify-center">
                {slide.title}
              </h1>

              <p className="text-xs md:text-sm text-white/90 mb-10 max-w-xl font-light drop-shadow-sm leading-relaxed tracking-wide animate-slide-up-delayed min-h-[4em] flex items-center justify-center">
                {slide.description}
              </p>

              <Link
                to="/shop"
                className="inline-block px-12 py-4 text-[10px] font-bold tracking-[0.4em] text-black border border-white bg-white uppercase shadow-2xl"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrent(i)}
                className={`h-1 transition-all duration-500 ${current === i ? 'w-12 bg-white' : 'w-4 bg-white/30'}`}
              />
          ))}
      </div>
    </div>
  );
};

export default HeroSection;
