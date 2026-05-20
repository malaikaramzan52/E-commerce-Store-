import React, { useState, useMemo, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShoppingBag, Eye, Heart, Filter, ChevronDown, Check, X, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';

import heroImg from '../assets/shop_hero.jpg';

const FilterDropdown = ({ label, options, selected, onSelect, isOpen, onToggle }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) onToggle(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => onToggle(!isOpen)}
        className={`flex items-center gap-2 py-3 px-5 border transition-all duration-300 rounded-full ${
          isOpen || (selected !== "All" && selected !== "Default")
            ? 'bg-black border-black text-white' 
            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:text-black'
        }`}
      >
        <span className="text-[10px] uppercase font-bold tracking-[0.2em]">{label}</span>
        <span className="text-[11px] font-medium">{selected !== "All" && selected !== "Default" ? `: ${selected}` : ""}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-64 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-200 z-[999] rounded-xl overflow-visible">
          <div className="py-2 bg-white rounded-xl">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onSelect(opt); onToggle(false); }}
                className="w-full flex items-center justify-between px-6 py-4 text-left text-[11px] uppercase tracking-widest hover:bg-gray-50 transition-colors group cursor-pointer"
              >
                <span className={selected === opt ? 'font-bold text-black' : 'text-gray-600 group-hover:text-black'}>
                  {opt}
                </span>
                {selected === opt && <Check size={14} className="text-black" />}
              </button>
            ))}
          </div>
          {/* Small arrow pointing up */}
          <div className="absolute -top-1.5 left-8 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45 z-[-1]"></div>
        </div>
      )}
    </div>
  );
};

const Shop = () => {
  const { addToCart, toggleWishlist, wishlistItems, products, categories } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("all");
  const [maxPrice, setMaxPrice] = useState(30000);
  const [sortBy, setSortBy] = useState("Default");

  const [openDropdown, setOpenDropdown] = useState(null);

  const isInWishlist = (id) => wishlistItems.some(item => (item._id || item.id) === id);

  const sortOptions = ["Default", "Price: Low to High", "Price: High to Low", "Newest"];

  const adminProducts = useMemo(
    () => products.filter((product) => product?.status === 'active' && product?.isDeleted !== true),
    [products]
  );

  const filteredAndSortedProducts = useMemo(() => {
    let results = adminProducts.filter(product => {
      const matchCategory = selectedCategory === "All" || product.categoryId?.categoryName === selectedCategory || product.categoryId?._id === selectedCategory;
      const matchSize = selectedSize === "all" || product.sizes?.includes(selectedSize);
      const price = product.discountPrice > 0 ? product.discountPrice : product.price;
      const matchPrice = price <= maxPrice;
      return matchCategory && matchSize && matchPrice;
    });

    if (sortBy === "Price: Low to High") results.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    if (sortBy === "Price: High to Low") results.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    if (sortBy === "Newest") results.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return results;
  }, [selectedCategory, selectedSize, maxPrice, sortBy, adminProducts]);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedSize("all");
    setMaxPrice(30000);
    setSortBy("Default");
  };

  const hasActiveFilters = selectedCategory !== "All" || selectedSize !== "all" || maxPrice < 30000 || sortBy !== "Default";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Shop Hero with Moving Marquee */}
        <section className="relative h-[45vh] md:h-[55vh] flex items-center justify-center overflow-hidden">
          <img 
            src={heroImg} 
            alt="Shop Couture" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-2">
              The Collection
            </h1>
            <div className="w-20 h-px bg-white mx-auto mb-6 opacity-70" />
            <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold">
              Timeless Elegance & Master Craftsmanship
            </p>
          </div>
        </section>

        {/* Enhanced Filter Bar */}
        <section className="sticky top-[80px] z-[100] bg-white border-b border-gray-100 shadow-sm overflow-visible">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Category Dropdown */}
            <FilterDropdown 
                label="Collections" 
                options={["All", ...categories.map(cat => cat.categoryName)]} 
                selected={selectedCategory} 
                onSelect={setSelectedCategory}
                isOpen={openDropdown === 'category'}
                onToggle={(open) => setOpenDropdown(open ? 'category' : null)}
            />

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-8 justify-center">
              {/* Sort Dropdown */}
              <FilterDropdown 
                label="Sort By" 
                options={sortOptions} 
                selected={sortBy} 
                onSelect={setSortBy}
                isOpen={openDropdown === 'sort'}
                onToggle={(open) => setOpenDropdown(open ? 'sort' : null)}
              />

              {/* Size Select */}
              <div className="flex items-center gap-4 border-l border-gray-100 pl-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Size:</span>
                <select 
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="text-[11px] font-bold uppercase tracking-widest bg-transparent border-b border-gray-300 focus:outline-none focus:border-black cursor-pointer pb-1 transition-colors"
                >
                  <option value="all">Any</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>

              {/* Price Slider */}
              <div className="flex items-center gap-4 border-l border-gray-100 pl-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Price:</span>
                <input 
                  type="range" 
                  min="0" 
                  max="30000" 
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="accent-black w-28 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[11px] font-bold tracking-widest text-gray-900 min-w-[80px] text-right">Rs. {maxPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Active Filter Pills */}
        {hasActiveFilters && (
          <section className="bg-gray-50 py-3 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-3">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mr-2">Active Filters:</span>
              
               {selectedCategory !== "All" && (
                <button onClick={() => setSelectedCategory("All")} className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-200 rounded-full text-[9px] uppercase tracking-widest font-bold group hover:border-black transition-colors">
                  Category: {selectedCategory} <X size={10} className="text-gray-400 group-hover:text-black" />
                </button>
              )}
              {selectedSize !== "all" && (
                <button onClick={() => setSelectedSize("all")} className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-200 rounded-full text-[9px] uppercase tracking-widest font-bold group hover:border-black transition-colors">
                  Size: {selectedSize} <X size={10} className="text-gray-400 group-hover:text-black" />
                </button>
              )}
              {maxPrice < 30000 && (
                <button onClick={() => setMaxPrice(30000)} className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-200 rounded-full text-[9px] uppercase tracking-widest font-bold group hover:border-black transition-colors">
                  Price: Under Rs. {maxPrice.toLocaleString()} <X size={10} className="text-gray-400 group-hover:text-black" />
                </button>
              )}
              {sortBy !== "Default" && (
                <button onClick={() => setSortBy("Default")} className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-200 rounded-full text-[9px] uppercase tracking-widest font-bold group hover:border-black transition-colors">
                  Sort: {sortBy} <X size={10} className="text-gray-400 group-hover:text-black" />
                </button>
              )}
              
              <button 
                onClick={clearFilters}
                className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-600 hover:text-red-800 transition-colors ml-2"
              >
                Clear All
              </button>
            </div>
          </section>
        )}

        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-['Outfit',_sans-serif]">
          <div className="mb-10 text-center">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Collection Overview</span>
            <h2 className="text-xl font-bold text-gray-900 mt-2 uppercase tracking-tight">Curated for Elegance</h2>

          </div>

          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
              {filteredAndSortedProducts.map((product) => (
                <div key={product._id || product.id} className="group relative">
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-50 mb-5 rounded-sm">
                    <Link to={`/product/${product._id || product.id}`} className="block h-full w-full">
                      <img 
                        src={product.images?.[0] || product.image || ""} 
                        alt={product.productName || product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                      />
                    </Link>
                    
                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-4 left-4 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] bg-black text-white shadow-sm z-10">
                        {product.badge}
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 translate-x-2 group-hover:translate-x-0">
                      <button 
                          onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                          className={`p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 ${
                              isInWishlist(product._id || product.id) ? 'bg-white text-red-600' : 'bg-white/90 text-gray-400 hover:text-black'
                          }`}
                      >
                          <Heart className={`w-3.5 h-3.5 ${isInWishlist(product._id || product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <Link 
                        to={`/product/${product._id || product.id}`}
                        className="bg-white/90 text-gray-400 p-2.5 rounded-full shadow-lg backdrop-blur-md hover:text-black transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Add to Cart */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-10">
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                        className="w-full bg-black text-white py-4 px-4 text-[9px] font-bold uppercase tracking-[0.3em] transition-all flex justify-center items-center shadow-2xl hover:bg-gray-900"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add to Bag
                      </button>
                    </div>
                  </div>

                  <div className="text-center px-2">
                    <p className="text-[9px] text-gray-400 mb-2 tracking-[0.3em] uppercase font-bold">{product.categoryId?.categoryName || product.category || "Luxury Couture"}</p>
                    <h3 className="text-[12px] font-semibold text-gray-900 mb-2 tracking-wide uppercase group-hover:text-gray-500 transition-colors">
                      <Link to={`/product/${product._id || product.id}`}>
                        {product.productName || product.name}
                      </Link>
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                        {product.discountPrice > 0 ? (
                           <>
                              <span className="text-xs text-gray-400 line-through tracking-wider">Rs. {(product.price || 0).toLocaleString()}</span>
                              <span className="text-sm font-bold text-red-600 tracking-[0.1em] font-['Outfit',_sans-serif]">Rs. {product.discountPrice.toLocaleString()}</span>
                           </>
                        ) : (
                           <span className="text-sm font-bold text-black tracking-[0.1em] font-['Outfit',_sans-serif]">Rs. {(product.price || 0).toLocaleString()}</span>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Search size={32} className="text-gray-200" />
              </div>
              <h3 className="text-2xl font-serif italic text-gray-900 mb-2">No results found</h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto mb-8 font-light">
                We couldn't find any masterpieces matching your current filter selection.
              </p>
              <button 
                onClick={clearFilters}
                className="bg-black text-white px-10 py-4 text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-gray-900 transition-colors shadow-lg"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
};

export default Shop;
