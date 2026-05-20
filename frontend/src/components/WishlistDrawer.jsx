import React from 'react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useApp } from '../context/useApp';

const WishlistDrawer = () => {
  const { isWishlistOpen, setIsWishlistOpen, wishlistItems, toggleWishlist, addToCart } = useApp();

  return (
    <>
      {isWishlistOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] transition-opacity duration-300"
          onClick={() => setIsWishlistOpen(false)}
        />
      )}

      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[110] transform transition-transform duration-500 ease-in-out shadow-2xl flex flex-col ${
          isWishlistOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-white shadow-sm">
          <h2 className="text-2xl font-serif italic mb-0 text-gray-900">My Favorites</h2>
          <button 
            onClick={() => setIsWishlistOpen(false)}
            className="p-3 hover:bg-gray-100 rounded-full transition-all duration-300 group"
          >
            <X className="w-8 h-8 text-black group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          {wishlistItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <p className="text-gray-400 font-serif italic text-lg uppercase tracking-widest">Your wishlist is empty</p>
              <button 
                onClick={() => setIsWishlistOpen(false)}
                className="text-[10px] font-bold tracking-[0.3em] uppercase underline hover:text-gray-600 transition-colors"
              >
                  Discover the Collection
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {wishlistItems.map((item) => (
                <div key={item._id || item.id} className="flex gap-6 border-b border-gray-50 pb-8 animate-in fade-in duration-500">
                  <div className="w-24 h-32 bg-gray-100 rounded overflow-hidden flex-shrink-0 shadow-sm">
                    <img 
                        src={item.images?.[0] || item.image} 
                        alt={item.productName || item.name} 
                        className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-gray-900 tracking-tight leading-tight">{item.productName || item.name}</h3>
                        <button 
                          onClick={() => toggleWishlist(item)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-black mt-2 tracking-widest">Rs. {(item.discountPrice || item.price || 0).toLocaleString()}</p>
                    </div>

                    <button 
                        onClick={() => {
                            addToCart(item);
                            toggleWishlist(item);
                        }}
                        className="w-full mt-4 bg-black text-white py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all flex items-center justify-center"
                    >
                        <ShoppingBag className="w-3.5 h-3.5 mr-2" />
                        Move to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistDrawer;
