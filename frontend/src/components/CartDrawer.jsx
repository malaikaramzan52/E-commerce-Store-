import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useApp } from '../context/useApp';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, updateSize } = useApp();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[110] transform transition-transform duration-500 ease-in-out shadow-2xl flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-white">
          <h2 className="text-2xl font-serif italic mb-0 text-black">Your Shopping Cart</h2>
          <button 
            onClick={(e) => {
                e.stopPropagation();
                setIsCartOpen(false);
            }}
            className="p-3 hover:bg-gray-100 rounded-full transition-all duration-300 group"
            aria-label="Close cart"
          >
            <X className="w-8 h-8 text-black group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.cartItemId || item._id || item.id} className="flex gap-4 border-b border-gray-50 pb-6">
                  <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={item.images?.[0] || item.image} 
                      alt={item.productName || item.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-gray-900">{item.productName || item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.cartItemId || item._id || item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Rs. {(item.discountPrice || item.price || 0).toLocaleString()}</p>
                      {item.selectedSize && (
                        <div className="flex items-center mt-1.5">
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest mr-2">Size:</span>
                          <select 
                            value={item.selectedSize}
                            onChange={(e) => updateSize(item.cartItemId || item._id || item.id, e.target.value)}
                            className="text-[11px] font-semibold text-gray-700 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-black cursor-pointer pb-[1px]"
                          >
                             {['XS', 'S', 'M', 'L', 'XL'].map(sz => <option key={sz} value={sz}>{sz}</option>)}
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center border border-gray-200 w-fit rounded-sm mt-3">
                      <button 
                        onClick={() => updateQuantity(item.cartItemId || item._id || item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-50 text-gray-500 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-8 text-center leading-relaxed">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.cartItemId || item._id || item.id, item.quantity + 1)}
                         className="p-1 hover:bg-gray-50 text-gray-500 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-gray-50">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-6">
              <p>Subtotal</p>
              <p>Rs. {subtotal.toLocaleString()}</p>
            </div>
            <p className="text-xs text-gray-500 mb-6 text-center">Shipping and taxes calculated at checkout.</p>
            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout');
              }}
              className="w-full bg-black text-white px-6 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
