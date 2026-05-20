import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingBag, Eye, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';

const ITEMS_PER_PAGE = 4;

const ProductGrid = () => {
  const { addToCart, toggleWishlist, wishlistItems, products, loading } = useApp();
  const [page, setPage] = useState(0);

  const isInWishlist = (id) => wishlistItems.some(item => (item._id || item.id) === id);

  const adminProducts = useMemo(
    () => products.filter((product) => product?.status === 'active' && product?.isDeleted !== true),
    [products]
  );

  const totalPages = Math.max(1, Math.ceil(adminProducts.length / ITEMS_PER_PAGE));
  const visibleProducts = useMemo(
    () => adminProducts.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE),
    [adminProducts, page]
  );

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);

  const prev = () => setPage(p => Math.max(0, p - 1));
  const next = () => setPage(p => Math.min(totalPages - 1, p + 1));

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-400 font-serif italic tracking-widest animate-pulse">Curating your selection...</p>
      </div>
    );
  }

  return (
    <section id="products" className="pt-8 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center mb-12 relative">
          <h2 className="text-3xl md:text-4xl font-serif italic tracking-wider text-gray-900 mb-4">
            The Collection
          </h2>
          <div className="w-24 h-px bg-black mb-6" />
          <p className="text-gray-400 text-[10px] max-w-2xl mx-auto uppercase tracking-[0.5em] font-bold mb-8">
            Premium Ladies Couture & Ethnic Craftsmanship
          </p>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-8">
            <button 
              onClick={prev}
              disabled={page === 0}
              className={`transition-all duration-500 p-2 ${page === 0 ? 'opacity-20 cursor-not-allowed grayscale' : 'hover:scale-125 text-black'}`}
              aria-label="Previous products"
            >
              <ChevronLeft size={32} strokeWidth={1} />
            </button>
            <button 
              onClick={next}
              disabled={page >= totalPages - 1}
              className={`transition-all duration-500 p-2 ${page >= totalPages - 1 ? 'opacity-20 cursor-not-allowed grayscale' : 'hover:scale-125 text-black'}`}
              aria-label="Next products"
            >
              <ChevronRight size={32} strokeWidth={1} />
            </button>
          </div>
        </div>


        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
          {visibleProducts.map((product) => (
            <div key={product._id} className="group relative">
              {/* Image Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-700 ease-in-out">
                <Link to={`/product/${product._id}`} className="block h-full w-full">
                  <img 
                    src={product.images?.[0] || product.image} 
                    alt={product.productName}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
                  />
                </Link>
                
                {/* Sale Badge */}
                {product.discountPrice > 0 && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] bg-red-600 text-white shadow-lg">
                    Sale
                  </div>
                )}

                {/* Actions Overlay */}
                <div className="absolute top-4 right-4 flex flex-col space-y-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 z-20">
                  <button 
                      onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                      className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-md ${
                          isInWishlist(product._id) ? 'bg-white text-red-600 scale-110' : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white'
                      }`}
                  >
                      <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                  </button>
                  <Link 
                    to={`/product/${product._id}`}
                    className="bg-white/80 text-gray-400 p-3 rounded-full backdrop-blur-md hover:text-black hover:bg-white transition-all shadow-md"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>

                {/* Quick Add Button */}
                <div className="absolute inset-x-0 bottom-0 p-5 opacity-0 transform translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out z-10">
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                    className="w-full bg-black text-white py-4 px-6 text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-neutral-800 flex justify-center items-center shadow-2xl"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2.5" />
                    Add To Cart
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="text-center px-2">
                <p className="text-[10px] text-gray-400 mb-2.5 tracking-[0.3em] uppercase font-bold">
                    {product.categoryId?.categoryName || "New Arrival"}
                </p>
                <h3 className="text-[13px] font-medium text-gray-900 mb-3 tracking-normal leading-tight h-10 overflow-hidden line-clamp-2">
                  <Link to={`/product/${product._id}`} className="hover:text-neutral-500 transition-colors">
                    {product.productName}
                  </Link>
                </h3>
                <div className="flex items-center justify-center gap-3">
                    {product.discountPrice > 0 ? (
                        <>
                            <span className="text-xs text-gray-400 line-through tracking-wider">Rs. {product.price.toLocaleString()}</span>
                            <span className="text-sm font-bold text-red-600 tracking-widest">Rs. {product.discountPrice.toLocaleString()}</span>
                        </>
                    ) : (
                        <span className="text-sm font-bold text-black tracking-widest">Rs. {product.price.toLocaleString()}</span>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {adminProducts.length === 0 && (
          <div className="py-24 text-center">
             <p className="text-gray-400 font-serif italic text-lg uppercase tracking-widest">No matching dresses found</p>
          </div>
        )}

        <div className="mt-20 text-center">
          <Link to="#" className="inline-block text-[11px] font-bold tracking-[0.5em] uppercase text-black hover:tracking-[0.6em] transition-all border-b border-black pb-3">
             View Entire Gallery
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ProductGrid;
