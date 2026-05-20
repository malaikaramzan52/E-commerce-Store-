import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShoppingBag, Heart, ArrowLeft, Ruler, Truck, ShieldCheck, Star, Layers } from "lucide-react";
import { useApp } from "../context/useApp";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlistItems, products, loading: appLoading } = useApp();
  
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [loading, setLoading] = useState(true);

  const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/products/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading || appLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400 font-bold uppercase tracking-tight animate-pulse uppercase">Revealing the Craftsmanship...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <p className="text-gray-400 font-bold uppercase tracking-tight text-xl mb-6">This piece is currently unavailable.</p>
        <button onClick={() => navigate("/")} className="text-[10px] font-bold uppercase tracking-[0.3em] border-b border-black pb-2">Return Home</button>
      </div>
    );
  }

  const isInWishlist = wishlistItems.some(item => (item._id || item.id) === product._id);
  const allImages = product.images?.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-white py-12 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back */}
        <div className="mb-12 flex items-center justify-between">
           <button onClick={() => navigate(-1)} className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">
              <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Back
           </button>
           <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
             Home / {product.categoryId?.categoryName || "Collection"} / {product.productName}
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          
          {/* Image Gallery */}
          <div className="flex flex-col gap-6">
            <div className="aspect-[3/4] w-full overflow-hidden bg-gray-50 shadow-sm">
              <img 
                src={allImages[selectedImage]} 
                alt={product.productName} 
                className="w-full h-full object-cover object-top"
              />
            </div>
            
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-[3/4] overflow-hidden border-b-2 transition-all ${selectedImage === idx ? 'border-black opacity-100 shadow-md' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-8 flex justify-between items-start">
               <div>
                 <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-4">{product.categoryId?.categoryName || "Ladies Couture"}</p>
                 <h1 className="text-3xl md:text-4xl font-serif italic text-gray-900 leading-tight mb-2">{product.productName}</h1>
                 <div className="flex items-center gap-1.5 mt-2">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 4) ? 'fill-black text-black' : 'text-gray-200'}`} />
                    ))}
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{product.rating || 4.5} Rating</span>
                 </div>
               </div>
               <button 
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-full border transition-all ${isInWishlist ? 'bg-black text-white' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}
               >
                 <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
               </button>
            </div>

            <div className="mb-10 pb-10 border-b border-gray-100">
               <div className="flex items-center gap-4 mb-4">
                  {product.discountPrice > 0 ? (
                    <>
                      <span className="text-3xl font-bold text-black tracking-widest">Rs. {product.discountPrice.toLocaleString()}</span>
                      <span className="text-lg text-gray-400 line-through tracking-widest">Rs. {product.price.toLocaleString()}</span>
                      <span className="bg-red-600 text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest">Sale</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-black tracking-widest">Rs. {product.price.toLocaleString()}</span>
                  )}
               </div>
               <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-lg">{product.description}</p>
               
               <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <div className="flex items-center"><Layers className="w-3.5 h-3.5 mr-2" /> {product.fabricType || "Lawn"} Fabric</div>
                  <div className="flex items-center"><Ruler className="w-3.5 h-3.5 mr-2" /> Stitched Pret</div>
               </div>
            </div>

            {/* Size Selector */}
            <div className="mb-10">
               <div className="flex items-center justify-between mb-4">
                 <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">Select Size</p>
                 <button className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 underline decoration-gray-200 underline-offset-4 hover:text-black transition-colors">Size Guide</button>
               </div>
               <div className="flex flex-wrap gap-3">
                 {(product.sizes?.length > 0 ? product.sizes : ["XS", "S", "M", "L", "XL"]).map(sz => (
                   <button 
                     key={sz}
                     onClick={() => setSelectedSize(sz)}
                     className={`w-14 h-14 flex items-center justify-center text-[11px] font-bold border transition-all ${selectedSize === sz ? 'bg-black text-white border-black shadow-lg scale-105' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}
                   >
                     {sz}
                   </button>
                 ))}
               </div>
            </div>

            {/* CTA */}
            <div className="mb-12">
               <button 
                 onClick={() => addToCart(product, selectedSize)}
                 className="w-full bg-black text-white py-5 px-8 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all flex items-center justify-center shadow-2xl group active:scale-[0.98]"
               >
                 <ShoppingBag className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                 Secure Your Piece
               </button>
               <p className="mt-4 text-[9px] text-gray-400 text-center uppercase tracking-widest font-bold">Complimentary Standard Delivery For A Limited Time</p>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-2 gap-8 py-8 border-t border-gray-100">
               <div className="flex items-start gap-4">
                  <Truck className="w-5 h-5 text-gray-900" />
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 mb-1">Standard Shipping</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-wider">Arrives within 3-5 business days</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <ShieldCheck className="w-5 h-5 text-gray-900" />
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 mb-1">Couture Quality</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-wider">Premium fabrics and stitching</p>
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* Suggestion / Related (Simplified) */}
        <div className="mt-24 border-t border-gray-100 pt-16">
          <h2 className="text-xl md:text-xl font-bold uppercase tracking-tight text-gray-900 mb-12 text-center">Complementary Selections</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {products.filter(p => {
                const pId = p._id || p.id;
                const currentId = product._id || product.id;
                const pCatId = p.categoryId?._id || p.categoryId;
                const currentCatId = product.categoryId?._id || product.categoryId;
                return pId !== currentId && pCatId === currentCatId;
             }).slice(0, 4).map(p => (
               <Link key={p._id || p.id} to={`/product/${p._id || p.id}`} className="group block text-center">
                  <div className="aspect-[3/4] overflow-hidden bg-gray-50 mb-4 transition-transform duration-700 group-hover:shadow-lg">
                    <img src={p.images?.[0] || p.image} alt={p.productName} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  </div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900 group-hover:text-gray-500 transition-colors">{p.productName}</h4>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest mt-1">Rs. {p.price.toLocaleString()}</p>
               </Link>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;