import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import aboutHeroImg from '../assets/about.jpg'; 
import storyImg from '../assets/about_1.jpg'; 

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
          <img 
            src={aboutHeroImg} 
            alt="About Us" 
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 text-center text-white px-4 max-w-3xl animate-fade-in">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.5em] font-bold text-white/90 mb-5">
              ESTABLISHED IN EXCELLENCE
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif italic tracking-wider mb-6">
              Our Legacy
            </h1>
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] font-light leading-relaxed max-w-xl mx-auto text-white/80">
              Redefining Ethnic Couture through Timeless Elegance and Master Craftsmanship
            </p>
          </div>
        </section>

        {/* Brand Introduction */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-[10px] font-bold tracking-[0.5em] text-gray-400 uppercase mb-6">BRAND INTRODUCTION</h2>
            <h3 className="text-3xl md:text-4xl font-serif italic text-gray-900 mb-10 leading-tight">
              Elegance is not standing out,<br />but being remembered.
            </h3>
            <p className="text-gray-600 font-light leading-loose max-w-3xl mx-auto mb-16">
              Welcome to our premier Pakistani Ladies Couture brand. We specialize in curating an extraordinary collection of pret wear, evening unstitched, and luxury winter collections. Every piece is an ode to the magnificent heritage of subcontinental artistry, blended seamlessly with contemporary silhouettes. Our creations are woven with premium fabrics—from the finest silks and airy chiffons to rich velvets and crisp organzas.
            </p>
            
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-0 relative">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 p-12 md:p-24 flex flex-col justify-center bg-[#111] text-white">
              <h2 className="text-sm font-bold tracking-[0.3em] text-gray-500 uppercase mb-4">Our Story</h2>
              <h3 className="text-3xl md:text-4xl font-serif italic mb-8">
                A Journey of Passion and Threads
              </h3>
              <p className="text-gray-300 font-light leading-relaxed mb-6">
                Born out of a profound love for traditional craftsmanship and an eye for modern aesthetics, our brand started as a small atelier and has grown into a beacon of high-end ethnic luxury. We embarked on a journey to revive ancient embroidery techniques while molding them for the modern, empowered woman.
              </p>
              <p className="text-gray-300 font-light leading-relaxed">
                Over the years, we have celebrated the intricate handwork of our artisans, ensuring that every stitch tells a story of dedication. Our story is not just about clothes; it's about the fabric of our culture, draped gracefully on women around the world.
              </p>
            </div>
            <div className="w-full lg:w-1/2 min-h-[400px] relative">
              <img 
                src={storyImg} 
                alt="Our Craft" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 bg-[#FAF9F7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
              <div className="text-center md:text-left">
                <div className="w-12 h-px bg-black mb-6 mx-auto md:mx-0"></div>
                <h2 className="text-2xl md:text-3xl font-serif italic text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-600 font-light leading-relaxed">
                  Our mission is to empower women through elegant, thoughtfully designed clothing that honors their heritage while keeping them impeccably styled. We are committed to ethical production, supporting local artisans, and ensuring that every garment that bears our name brings joy, confidence, and uncompromising quality to its wearer.
                </p>
              </div>

              <div className="text-center md:text-left">
                <div className="w-12 h-px bg-black mb-6 mx-auto md:mx-0"></div>
                <h2 className="text-2xl md:text-3xl font-serif italic text-gray-900 mb-6">Our Vision</h2>
                <p className="text-gray-600 font-light leading-relaxed">
                  We envision a world where luxury is defined by craftsmanship, cultural richness, and timelessness. Our goal is to become the ultimate global destination for Pakistani couture, transcending borders with our exquisite designs, and making ethnic elegance an essential part of the modern, sophisticated wardrobe.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
};

export default About;
