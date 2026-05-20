import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';

import heroImg from '../assets/sale_hero.png';

const Sale = () => {
  const { addToCart, toggleWishlist, wishlistItems, products } = useApp();
  const isInWishlist = (id) => wishlistItems.some(item => (item._id || item.id) === id);

  const saleProducts = products.filter(p => p.discountPrice && p.discountPrice > 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
          <img 
            src={heroImg} 
            alt="Sale Collection" 
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif italic tracking-wider mb-4">
              Premium Sale
            </h1>
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] font-light">
              Exclusive Discounts on Timeless Pieces
            </p>
          </div>
        </section>

        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-serif italic text-gray-900 mb-4">Special Offers</h2>
            <div className="w-16 h-px bg-gray-200 mx-auto border-t border-red-500"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {saleProducts.map((product) => (
              <div key={product._id || product.id} className="group relative bg-white pb-6 shadow-sm hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-50 mb-5 border border-red-50">
                  <Link to={`/product/${product._id || product.id}`} className="block h-full w-full">
                    <img 
                      src={product.images?.[0] || product.image || ""} 
                      alt={product.productName || product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                  </Link>
                  
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] bg-red-600 text-white shadow-sm">
                      SALE
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <button 
                        onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                        className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
                            isInWishlist(product._id || product.id) ? 'bg-red-50 text-red-600 scale-110' : 'bg-white/90 text-gray-400 hover:text-red-500'
                        }`}
                    >
                        <Heart className={`w-4 h-4 ${isInWishlist(product._id || product.id) ? 'fill-current' : ''}`} />
                    </button>
                    <Link 
                      to={`/product/${product._id || product.id}`}
                      className="bg-white/90 text-gray-400 p-2.5 rounded-full backdrop-blur-md hover:text-black transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-10">
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                      className="w-full bg-red-600 text-white py-3.5 px-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex justify-center items-center shadow-lg hover:bg-red-700"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>

                <div className="text-center px-4">
                  <p className="text-[9px] text-gray-400 mb-2 tracking-[0.2em] uppercase font-bold">{product.categoryId?.categoryName || product.category || "Luxury Couture"}</p>
                  <h3 className="text-sm font-medium text-gray-900 mb-2 tracking-tight">
                    <Link to={`/product/${product._id || product.id}`} className="hover:text-red-500 transition-colors">
                      {product.productName || product.name}
                    </Link>
                  </h3>
                  <div className="flex items-center justify-center gap-3">
                    <p className="text-sm font-bold text-red-600 tracking-widest">Rs. {(product.discountPrice || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-400 line-through tracking-wider">Rs. {(product.price || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sale;
