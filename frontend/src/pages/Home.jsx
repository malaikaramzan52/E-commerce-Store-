import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ProductGrid from '../components/ProductGrid';
import ParallaxSection from '../components/ParallaxSection';
import ProfessionalBlazerSection from '../components/ProfessionalBlazerSection';
import DiscoverSection from '../components/DiscoverSection';
import FeatureBar from '../components/FeatureBar';
import OverlaySection from '../components/OverlaySection';
import Footer from '../components/Footer';
import CategorySection from '../components/CategorySection';

import img6 from '../assets/image_3.jpg';

import imgLastParallax from '../assets/last.webp';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">

        
        <HeroSection />
        
        <CategorySection />

        <ProductGrid />
        
        <OverlaySection />

        <FeatureBar />

        <ParallaxSection 
          bgImage={imgLastParallax}
          innerImage={img6}
          title="The Heritage Embroidery Collection"
          cta="VIEW TRADITIONS"
        />

        <ProfessionalBlazerSection />

        <DiscoverSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
