import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, ChevronRight, ChevronLeft, X, Info, Package, Truck, Send, MessageCircle, Eye } from 'lucide-react';
import { useApp } from '../context/useApp';
  
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MarqueeBanner from '../components/Marquee';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlistItems, products: globalProducts, loading: appLoading } = useApp();
  const [product, setProduct] = useState(null);
  const [isSizeDrawerOpen, setIsSizeDrawerOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('Select size');
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [loadingProduct, setLoadingProduct] = useState(true);
  const galleryRef = useRef(null);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    const loadProduct = async () => {
      setLoadingProduct(true);
      // Try global context first
      let foundProduct = globalProducts.find(p => String(p._id) === String(id) || String(p.id) === String(id));
      
      // Skip mock data, go straight to backend fetch if not in global products


      // If still not found, fetch from backend
      if (!foundProduct) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/products/${id}`);
          const data = await res.json();
          if (data.success) {
            foundProduct = data.product;
          }
        } catch (err) {
          console.error("Failed to fetch product directly:", err);
        }
      }

      if (foundProduct) {
        setProduct(foundProduct);
      }
      setLoadingProduct(false);
    };

    if (!appLoading) {
      loadProduct();
      window.scrollTo(0, 0);
    }
  }, [id, globalProducts, appLoading]);

  const scrollGallery = (direction) => {
    if (galleryRef.current) {
      const scrollAmount = window.innerWidth * 0.8;
      galleryRef.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (galleryRef.current) {
      const scrollLeft = galleryRef.current.scrollLeft;
      const width = galleryRef.current.clientWidth;
      const newActive = Math.round(scrollLeft / width);
      setActiveImage(newActive);
    }
  };

  const isInWishlist = product ? wishlistItems.some(item => (item._id || item.id) === (product._id || product.id)) : false;

  if (loadingProduct || appLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
            <div className="text-gray-400 tracking-[0.5em] uppercase text-[10px] font-bold">The Art of Couture</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <p className="text-gray-400 font-serif italic mb-6">This piece is currently unavailable.</p>
        <button onClick={() => navigate("/")} className="text-[10px] font-bold uppercase tracking-[0.3em] border-b border-black pb-2">Return Home</button>
      </div>
    );
  }

  const displayImages = (product.images || []).filter(img => img && typeof img === 'string' && img.trim() !== '');
  const productName = product.productName || product.name;
  const categoryName = product.categoryId?.categoryName || "Collection";


  return (
    <div className="min-h-screen bg-white flex flex-col animate-in fade-in duration-1000">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* Marquee Banner */}
        <MarqueeBanner
          text={productName.toUpperCase()}
          collectionText="NEW COLLECTION"
          speed="35s"
        />

        {/* ── Cinematic Image Showcase ── */}
        <div style={{
          background: '#eeecea',
          width: '100%',
          padding: '0',
          overflow: 'hidden',
          minHeight: '520px',
        }}>
          {displayImages.length > 0 ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: '0px',
                width: '100%',
                minHeight: '520px',
              }}>
                {displayImages.map((img, index) => {
                  const count = displayImages.length;
                  const mid = Math.floor(count / 2);
                  const dist = Math.abs(index - mid);
                  // For any count, calculate height by distance from center
                  const maxH = 560;
                  const stepDown = count > 1 ? 70 : 0;
                  const imgH = maxH - dist * stepDown;

                  return (
                    <div
                      key={index}
                      onClick={() => setActiveImage(index)}
                      style={{
                        flex: count === 1 ? '0 0 50%' : dist === 0 ? '0 0 22%' : dist === 1 ? '0 0 20%' : '0 0 19%',
                        height: `${imgH}px`,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'flex 0.4s ease, height 0.4s ease',
                        position: 'relative',
                      }}
                    >
                      <img
                        src={img}
                        alt={`${productName} – view ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'top center',
                          display: 'block',
                          transition: 'transform 0.6s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      
                      {/* Badge */}
                       {/* Badge removed from image as per request */}
                    </div>
                  );
                })}
              </div>

              {/* Dot indicators */}
              {displayImages.length > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '16px 0 20px' }}>
                  {displayImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      style={{
                        width: activeImage === idx ? '28px' : '8px',
                        height: '2px',
                        background: activeImage === idx ? '#1a1a1a' : 'rgba(0,0,0,0.2)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.4s ease',
                        borderRadius: '2px',
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-[520px] flex items-center justify-center bg-gray-50/50">
               <p className="font-serif italic text-gray-400">Image unavilable</p>
            </div>
          )}
        </div>

        {/* Product Info Action Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in slide-in-from-bottom duration-1000">
          <div className="bg-white/50 backdrop-blur-sm border border-gray-100 rounded-[2rem] p-8 md:p-10 flex flex-wrap lg:flex-nowrap items-center justify-between gap-8 shadow-sm">
            
            {/* 1. Category & Name Info */}
            <div className="flex flex-col min-w-[160px]">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-1 font-sans">{categoryName}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900">{productName}</span>
                {product.discountPrice > 0 && (
                  <span className="bg-red-600 text-white text-[9.5px] font-black px-4 py-1.5 tracking-widest uppercase rounded-full shadow-lg shadow-red-500/20 animate-soft-pulse transition-all">
                    Sale
                  </span>
                )}
              </div>
            </div>

            {/* 2. Wishlist */}
            <div className="flex items-center px-8 border-x border-gray-100 h-10">
              <button 
                onClick={() => toggleWishlist(product)}
                className={`group/heart p-3.5 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 ${
                  isInWishlist ? 'bg-red-50 text-red-600 shadow-md' : 'bg-gray-50 text-gray-400 hover:bg-white hover:text-black shadow-sm border border-transparent hover:border-gray-100'
                }`}
              >
                <Heart className={`w-4 h-4 transition-transform duration-500 ${isInWishlist ? 'fill-current scale-110' : 'group-hover/heart:scale-110'}`} />
              </button>
            </div>

            {/* 3. Size Selector */}
            <div 
              className="flex flex-col cursor-pointer group/size relative px-8 min-w-[140px]"
              onClick={() => setIsSizeDrawerOpen(true)}
            >
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-1 flex items-center font-sans tracking-widestScale">
                Size <ChevronRight className="w-3 h-3 ml-2 group-hover/size:translate-x-1 transition-transform" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 border-b border-transparent hover:border-black transition-all">
                {selectedSize}
              </span>
            </div>

            {/* 4. Price */}
            <div className="flex flex-col border-l border-gray-100 pl-8 min-w-[180px]">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-1 font-sans text-left">Investment</span>
              {product.discountPrice > 0 ? (
                <div className="flex items-center gap-2">
                   <span className="text-base font-bold tracking-widest text-red-600">Rs. {product.discountPrice.toLocaleString()}</span>
                   <span className="text-xs text-gray-400 line-through tracking-wider">Rs. {(product.price || 0).toLocaleString()}</span>
                </div>
              ) : (
                <span className="text-base font-bold tracking-widest text-gray-900">Rs. {(product.price || 0).toLocaleString()}</span>
              )}
            </div>

            {/* 5. Buttons */}
            <div className="flex flex-1 lg:flex-none gap-4 w-full lg:w-auto ml-auto pl-8">
              <button 
                onClick={() => {
                  if (selectedSize === 'Select size') {
                    alert('Please select a size first.');
                    return;
                  }
                  addToCart(product, selectedSize);
                }}
                className="flex-1 lg:flex-none border border-gray-900 text-gray-900 bg-white px-8 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-50 transition-all shadow-sm"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => {
                  if (selectedSize === 'Select size') {
                    alert('Please select a size first.');
                    return;
                  }
                  addToCart(product, selectedSize, false);
                  navigate('/checkout');
                }}
                className="flex-1 lg:flex-none bg-black text-white px-8 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                Buy Now
              </button>
            </div>

          </div>
        </div>

        {/* Details Section (Tabs) */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-10 bg-white">
          <div className="flex border-b border-gray-200 mb-10 justify-start space-x-12">
            <button 
              className={`pb-4 text-[11px] font-bold tracking-[0.3em] uppercase transition-all duration-300 relative ${activeTab === 'description' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
              onClick={() => setActiveTab('description')}
            >
              Description
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-black transition-transform duration-300 ${activeTab === 'description' ? 'scale-x-100' : 'scale-x-0'}`} />
            </button>
            <button 
              className={`pb-4 text-[11px] font-bold tracking-[0.3em] uppercase transition-all duration-300 relative ${activeTab === 'shipping' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
              onClick={() => setActiveTab('shipping')}
            >
              Shipping Details
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-black transition-transform duration-300 ${activeTab === 'shipping' ? 'scale-x-100' : 'scale-x-0'}`} />
            </button>
          </div>

          <div className="min-h-[150px]">
            {activeTab === 'description' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="text-gray-700 leading-relaxed text-base font-light tracking-wide font-sans text-left max-w-3xl">
                  {product.description}
                </p>
              </div>
            )}
            
            {activeTab === 'shipping' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-2xl">
                <ul className="text-gray-600 space-y-4 text-sm font-sans tracking-wide">
                  <li className="flex items-start">
                    <span className="mr-4 text-black font-bold mt-1">—</span>
                    <span><strong className="text-black font-medium">Standard Delivery:</strong> 3-5 business days across Pakistan.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-4 text-black font-bold mt-1">—</span>
                    <span><strong className="text-black font-medium">Express Delivery:</strong> 1-2 business days in major cities.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-4 text-black font-bold mt-1">—</span>
                    <span><strong className="text-black font-medium">International Shipping:</strong> Available worldwide via DHL.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-4 text-black font-bold mt-1">—</span>
                    <span><strong className="text-black font-medium">Returns:</strong> 7-days hassle-free return & exchange policy.</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Shipping & Returns 4-Col Image Section */}
        <div className="w-full bg-stone-50/50 border-t border-stone-100 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-serif italic mb-16 text-center text-gray-900 tracking-wide">Shipping & Returns</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-0 gap-y-16 text-center divide-y md:divide-y-0 md:divide-x divide-stone-200/60">
              
              {/* Feature 1 */}
              <div className="flex flex-col items-center pt-8 md:pt-0 pb-8 md:pb-0 group px-4">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform duration-500 border border-stone-100/50">
                  <Package className="w-6 h-6 text-gray-800" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3 text-gray-900">Free Shipping</span>
                <span className="text-xs text-gray-500 leading-relaxed max-w-[180px]">For all orders over Rs. 2000<br/>across Pakistan</span>
              </div>
              
              {/* Feature 2 */}
              <div className="flex flex-col items-center pt-8 md:pt-0 pb-8 md:pb-0 group px-4">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform duration-500 border border-stone-100/50">
                  <Truck className="w-6 h-6 text-gray-800" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3 text-gray-900">Shipping Time</span>
                <span className="text-xs text-gray-500 leading-relaxed max-w-[180px]">Delivered within<br/>3-5 working days</span>
              </div>
              
              {/* Feature 3 */}
              <div className="flex flex-col items-center pt-8 md:pt-0 pb-8 md:pb-0 group px-4">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform duration-500 border border-stone-100/50">
                  <Send className="w-6 h-6 text-gray-800" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3 text-gray-900">Hassle Free</span>
                <span className="text-xs text-gray-500 leading-relaxed max-w-[180px] border-b border-gray-300 pb-0.5 hover:border-gray-900 hover:text-gray-900 transition-colors cursor-pointer">Returns & Exchanges</span>
              </div>
              
              {/* Feature 4 */}
              <div className="flex flex-col items-center pt-8 md:pt-0 pb-8 md:pb-0 group px-4">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform duration-500 border border-stone-100/50">
                  <MessageCircle className="w-6 h-6 text-gray-800" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3 text-gray-900">Need Help?</span>
                <span className="text-xs text-gray-500 leading-relaxed max-w-[180px] border-b border-gray-300 pb-0.5 hover:border-gray-900 hover:text-gray-900 transition-colors cursor-pointer">Contact Us</span>
              </div>

            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-gray-100 mt-10">
          <div className="text-center mb-16">
            <h3 className="text-[11px] font-extrabold tracking-[0.6em] text-gray-400 uppercase mb-4 font-sans">Curated Additions</h3>
            <h3 className="text-2xl md:text-3xl font-serif italic text-gray-900">Discover More Pieces</h3>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 md:gap-8">
            {globalProducts.filter(relatedP => {
              const isNotCurrent = String(relatedP._id || relatedP.id) !== String(id);
              const pCatId = relatedP.categoryId?._id || relatedP.categoryId;
              const currentCatId = product.categoryId?._id || product.categoryId;
              return isNotCurrent && pCatId === currentCatId;
            }).slice(0, 4).map((relatedProduct) => (
              <div key={relatedProduct._id || relatedProduct.id} className="group cursor-pointer">
                <Link to={`/product/${relatedProduct._id || relatedProduct.id}`} className="block">
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-50 mb-5 shadow-sm group-hover:shadow-lg transition-all duration-500">
                    <img 
                      src={relatedProduct.image || relatedProduct.images?.[0]} 
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out"
                    />
                    
                    {/* Badge */}
                    {relatedProduct.discountPrice > 0 && (
                      <div className="absolute top-4 left-4 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] bg-red-600 text-white z-10 shadow-lg">
                        SALE
                      </div>
                    )}
                    
                    {/* Actions Overlay Buttons (Wishlist and View) */}
                    <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(relatedProduct); }}
                          className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
                              wishlistItems.some(item => (item._id || item.id) === (relatedProduct._id || relatedProduct.id)) ? 'bg-red-50 text-red-600 scale-110' : 'bg-white/90 text-gray-400 hover:text-red-500'
                          }`}
                      >
                          <Heart className={`w-4 h-4 ${wishlistItems.some(item => (item._id || item.id) === (relatedProduct._id || relatedProduct.id)) ? 'fill-current' : ''}`} />
                      </button>
                      <Link 
                        to={`/product/${relatedProduct._id || relatedProduct.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white/90 text-gray-400 p-2.5 rounded-full backdrop-blur-md hover:text-black transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>

                    {/* Add to Cart Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-10">
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(relatedProduct, 'M'); }}
                        className="w-full bg-black text-white py-3.5 px-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex justify-center items-center shadow-lg"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-gray-400 mb-1.5 tracking-[0.2em] uppercase font-bold">{relatedProduct.categoryId?.categoryName || relatedProduct.category}</p>
                    <h3 className="text-xs font-semibold text-gray-900 tracking-tight mb-1.5 group-hover:text-gray-500 transition-colors">{relatedProduct.productName || relatedProduct.name}</h3>
                    <p className="text-xs font-bold text-black tracking-widest">Rs. {(relatedProduct.price || 0).toLocaleString()}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

      </main>


      {/* Footer */}
      <Footer />

      {/* Size Selection Drawer */}
      <div 
        className={`fixed inset-0 z-[100] transition-opacity duration-500 ${
          isSizeDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={() => setIsSizeDrawerOpen(false)} 
        />
        <div 
          className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col p-10 ${
            isSizeDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center mb-16">
            <h3 className="text-2xl font-serif italic text-gray-900">Select Size</h3>
            <button onClick={() => setIsSizeDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            {sizes.map((size) => (
              <button 
                key={size}
                onClick={() => {
                  setSelectedSize(size);
                  setIsSizeDrawerOpen(false);
                }}
                className={`w-full py-5 text-[10px] font-bold tracking-[0.4em] uppercase border transition-all duration-300 flex items-center justify-between px-8 ${
                  selectedSize === size 
                    ? 'border-gray-900 bg-gray-50 text-gray-900' 
                    : 'border-gray-100 text-gray-400 hover:border-gray-300 hover:text-black'
                }`}
              >
                {size}
                {selectedSize === size && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-10 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-gray-400">
              <Info className="w-5 h-5" />
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] leading-relaxed">
                Refer to our size guide for the perfect tailored fit.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default ProductView;
