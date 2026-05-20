import React from 'react';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';

const RecentArrivals = () => {
  const { products, loading, addToCart, toggleWishlist, wishlistItems } = useApp();

  const isInWishlist = (id) => wishlistItems.some(item => (item._id || item.id) === id);

  if (loading) return null;

  // Take the first 4 products (which are the newest, based on backend sort)
  const recentProducts = products.slice(0, 4);

  if (recentProducts.length === 0) return null;

  return (
    <section className="py-16 bg-[#fcfcfc] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-serif italic tracking-wider text-gray-900 mb-2">
              Latest Additions
            </h2>
            <div className="w-16 h-px bg-black mb-3" />
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.4em] font-bold">
              Freshly Crafted Artistry
            </p>
          </div>
          <Link to="/products" className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
            View All Arrivals
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {recentProducts.map((product) => (
            <div key={product._id || product.id} className="group relative bg-white pb-6 shadow-sm hover:shadow-xl transition-shadow duration-300">
              {/* Image Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 mb-4">
                <Link to={`/product/${product._id || product.id}`} className="block h-full w-full">
                  <img 
                    src={product.images?.[0] || product.image || ""} 
                    alt={product.productName || product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                </Link>
                
                {/* Sale Badge */}
                {product.discountPrice > 0 && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] bg-red-600 text-white shadow-lg">
                    SALE
                  </div>
                )}

                {/* Actions Overlay */}
                <div className="absolute top-4 right-4 flex flex-col space-y-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 z-20">
                  <button 
                      onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                      className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-md ${
                          isInWishlist(product._id || product.id) ? 'bg-white text-red-600 scale-110' : 'bg-white/90 text-gray-400 hover:text-red-500'
                      }`}
                  >
                      <Heart className={`w-4 h-4 ${isInWishlist(product._id || product.id) ? 'fill-current' : ''}`} />
                  </button>
                  <Link 
                    to={`/product/${product._id || product.id}`}
                    className="bg-white/90 text-gray-400 p-3 rounded-full backdrop-blur-md hover:text-black transition-all shadow-md"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>

                {/* Quick Add Button */}
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out z-10">
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                    className="w-full bg-black text-white py-4 px-6 text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-neutral-800 flex justify-center items-center shadow-2xl"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2.5" />
                    Quick Add
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="text-center px-4">
                <p className="text-[9px] text-gray-400 mb-2 tracking-[0.3em] uppercase font-bold">
                    {product.categoryId?.categoryName || product.category || "Couture"}
                </p>
                <h3 className="text-sm font-medium text-gray-900 mb-2 overflow-hidden whitespace-nowrap text-ellipsis px-2">
                  <Link to={`/product/${product._id || product.id}`} className="hover:text-gray-500 transition-colors">
                    {product.productName || product.name}
                  </Link>
                </h3>
                <div className="flex items-center justify-center gap-3">
                    {product.discountPrice > 0 ? (
                        <>
                            <span className="text-xs text-gray-400 line-through tracking-wider">Rs. {(product.price || 0).toLocaleString()}</span>
                            <span className="text-sm font-bold text-red-600 tracking-widest">Rs. {(product.discountPrice || 0).toLocaleString()}</span>
                        </>
                    ) : (
                        <span className="text-sm font-bold text-black tracking-widest">Rs. {(product.price || 0).toLocaleString()}</span>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentArrivals;
