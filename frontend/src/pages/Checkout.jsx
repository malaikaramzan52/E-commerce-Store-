import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronDown, HelpCircle, ShieldCheck, Lock, RotateCcw, Truck, CheckCircle2, Loader2, Star, ArrowRight } from 'lucide-react';
import { useApp } from '../context/useApp';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
    const navigate = useNavigate();
    const { userToken } = useAuth();
    const { cartItems, setCartItems, setIsCartOpen } = useApp();
    const [subtotal, setSubtotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        address: "",
        apartment: "",
        city: "",
        postalCode: "",
        phone: ""
    });

    useEffect(() => {
        const total = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
        setSubtotal(total);
    }, [cartItems]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCompleteOrder = async (e) => {
        e?.preventDefault?.();
        if (cartItems.length === 0) return;

        if (!userToken) {
            navigate('/login');
            return;
        }
        
        // Basic validation
        if (!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.phone) {
            alert("Please fill in all the required delivery details.");
            return;
        }

        setLoading(true);
        try {
            const orderPayload = {
                products: cartItems.map(item => ({
                    productId: item._id || item.id,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.selectedSize || "M"
                })),
                totalAmount: subtotal,
                shippingAddress: `${formData.firstName} ${formData.lastName}, ${formData.address}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city} ${formData.postalCode}. Phone: ${formData.phone}`,
                paymentMethod: "Cash on Delivery"
            };

            const response = await fetch("http://localhost:5000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`
                },
                body: JSON.stringify(orderPayload)
            });

            const data = await response.json();

            if (response.ok) {
                setIsOrderPlaced(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
                setFormData({
                    firstName: "",
                    lastName: "",
                    address: "",
                    apartment: "",
                    city: "",
                    postalCode: "",
                    phone: ""
                });
                // Clear cart locally
                setCartItems([]);
                localStorage.removeItem("cart");
            } else {
                alert(data.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Order error:", error);
            alert("Server error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
            {!userToken && (
                <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-center py-3 px-4 text-xs font-bold uppercase tracking-widest">
                    Please sign in to complete your checkout.
                </div>
            )}
      <div className="flex-grow pt-32 px-4 pb-20 relative">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-20">
            
            {/* Left Column - Form */}
            <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-6 font-sans uppercase tracking-tight">Delivery</h2>
                
                <form className="space-y-4">
                    {/* Country */}
                    <div className="relative">
                        <label className="absolute left-3 top-2 text-[11px] text-gray-500 font-sans">Country/Region</label>
                        <select className="w-full border border-gray-300 rounded-[8px] pt-6 pb-2 px-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black appearance-none bg-white font-sans text-gray-900 cursor-pointer">
                            <option>Pakistan</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>

                    {/* Name Row */}
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <label className="absolute left-3 top-2 text-[11px] text-gray-500 font-sans">First name</label>
                            <input 
                                type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-[8px] pt-6 pb-2 px-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-sans text-gray-900" placeholder="" />
                        </div>
                        <div className="relative flex-1">
                            <label className="absolute left-3 top-2 text-[11px] text-gray-500 font-sans">Last name</label>
                            <input 
                                type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-[8px] pt-6 pb-2 px-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-sans text-gray-900" placeholder="" />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="relative">
                        <label className="absolute left-3 top-2 text-[11px] text-gray-500 font-sans">Address</label>
                        <input 
                            type="text" name="address" value={formData.address} onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-[8px] pt-6 pb-2 px-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-sans text-gray-900" placeholder="" />
                    </div>

                    {/* Apartment */}
                    <div className="relative">
                        <label className="absolute left-3 top-2 text-[11px] text-gray-500">Apartment, suite, etc. (optional)</label>
                        <input 
                            type="text" name="apartment" value={formData.apartment} onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-[8px] pt-6 pb-2 px-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-sans text-gray-900" placeholder="" />
                    </div>

                    {/* City / Postal Row */}
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <label className="absolute left-3 top-2 text-[11px] text-gray-500 font-sans">City</label>
                            <input 
                                type="text" name="city" value={formData.city} onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-[8px] pt-6 pb-2 px-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-sans text-gray-900" placeholder="" />
                        </div>
                        <div className="relative flex-1">
                            <label className="absolute left-3 top-2 text-[11px] text-gray-500 font-sans">Postal code (optional)</label>
                            <input 
                                type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-[8px] pt-6 pb-2 px-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-sans text-gray-900" placeholder="" />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="relative flex items-center border border-gray-300 rounded-[8px] focus-within:border-black focus-within:ring-1 focus-within:ring-black overflow-hidden bg-white">
                        <div className="flex-1 relative">
                            <label className="absolute left-3 top-1 text-[11px] text-gray-500 font-sans">Phone</label>
                            <input 
                                type="text" name="phone" value={formData.phone} onChange={handleInputChange}
                                className="w-full pt-6 pb-2 px-3 text-sm focus:outline-none font-sans text-gray-900" placeholder="" />
                        </div>
                        <div className="pr-3 pl-2 flex items-center space-x-3 border-l border-gray-200">
                             <HelpCircle className="w-[18px] h-[18px] text-gray-400 cursor-pointer hover:text-gray-600" />
                             <div className="text-xl flex items-center space-x-1 cursor-pointer">
                                <span>🇵🇰</span>
                                <ChevronDown className="w-3 h-3 text-gray-600" />
                             </div>
                        </div>
                    </div>
                </form>

                <div className="mt-12">
                   <h2 className="text-xl font-bold text-gray-900 mb-6 font-sans uppercase tracking-tight">Payment Method</h2>
                   <div className="border border-black bg-[#f4f4f4] rounded-[8px] p-6 flex flex-col justify-center relative cursor-pointer shadow-[0_0_0_1px_rgba(0,0,0,1)]">
                        <div className="flex items-center space-x-3 text-gray-900">
                           <div className="w-4 h-4 rounded-full border-[5px] border-black bg-white" />
                           <span className="text-sm font-semibold">Cash on Delivery (COD)</span>
                        </div>
                   </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                        <div className="flex flex-col items-center">
                            <Lock className="w-8 h-8 text-gray-500 mb-3" strokeWidth={1} />
                            <h4 className="text-[10px] font-bold text-gray-900 mb-1 uppercase tracking-widest">Secure Payments</h4>
                            <p className="text-[10px] text-gray-500 leading-relaxed max-w-[120px]">We use 100% secure payments.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <RotateCcw className="w-8 h-8 text-gray-500 mb-3" strokeWidth={1} />
                            <h4 className="text-[10px] font-bold text-gray-900 mb-1 uppercase tracking-widest">Easy Returns & Exchange</h4>
                            <p className="text-[10px] text-gray-500 leading-relaxed max-w-[120px]">Return your item within 10 days for a full refund</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <Truck className="w-8 h-8 text-gray-500 mb-3" strokeWidth={1} />
                            <h4 className="text-[10px] font-bold text-gray-900 mb-1 uppercase tracking-widest">Fast Shipping</h4>
                            <p className="text-[10px] text-gray-500 leading-relaxed max-w-[120px]">Receive your order within 3-5 business days</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <button 
                        onClick={handleCompleteOrder}
                        disabled={loading}
                        className="w-full bg-black text-white px-6 py-[18px] text-[13px] font-bold uppercase tracking-widest hover:-translate-y-0.5 hover:shadow-xl transition-all rounded-md flex justify-center items-center gap-3 disabled:opacity-50"
                    >
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        Complete Order
                    </button>
                    <p className="text-xs text-gray-400 mt-4 font-sans">By completing your order, you agree to our Terms & Conditions.</p>
                </div>
            </div>

            {/* Right Column - Order Summary Map */}
            <div className="lg:w-[45%] md:w-5/12 hidden md:block">
               <div className="sticky top-32">
                <div className="bg-gray-50/50 p-8 rounded-2xl border border-gray-100">
                    <h3 className="text-base font-bold uppercase tracking-tight text-gray-900 mb-8">Order Summary</h3>
                    
                    <div className="max-h-[50vh] overflow-y-auto pr-3 no-scrollbar mb-6 space-y-6">
                        {cartItems.map((item, idx) => (
                            <div key={item.cartItemId || idx} className="flex items-start space-x-4">
                                <div className="w-[72px] h-[72px] bg-white rounded-xl overflow-visible relative border border-gray-200 p-[3px]">
                                   <div className="w-full h-full rounded-lg overflow-hidden bg-gray-50">
                                       <img src={item.image || (item.images && item.images[0])} alt={item.productName} className="w-full h-full object-cover" />
                                   </div>
                                   <div className="absolute -top-2 -right-2 w-[22px] h-[22px] bg-black text-white text-[11px] flex items-center justify-center font-bold rounded-full shadow-sm">{item.quantity}</div>
                                </div>
                                
                                <div className="flex-1 flex flex-col justify-center min-h-[72px] pt-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-[14px] text-gray-900 font-sans leading-tight">{item.productName || item.name}</h4>
                                            <button onClick={() => setIsCartOpen(true)} className="px-2 py-0.5 mt-2 border border-gray-200 rounded text-[11px] text-gray-600 hover:bg-gray-50 transition-colors">
                                                Edit
                                            </button>
                                        </div>
                                        <span className="text-[14px] text-gray-900 ml-4 whitespace-nowrap">Rs {(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {cartItems.length === 0 && (
                            <p className="text-sm text-gray-500 italic">Your cart is empty.</p>
                        )}
                    </div>

                    <div className="space-y-3 text-sm text-gray-500 font-sans">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-medium text-gray-900">Rs. {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="font-medium text-gray-900">Free</span>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200 my-5"></div>
                    
                    <div className="flex justify-between items-center text-base font-bold text-gray-900">
                        <span>Total</span>
                        <span className="text-xl">Rs. {subtotal.toLocaleString()}</span>
                    </div>
                </div>
               </div>
            </div>

        </div>
      </div>
      <Footer />

      {/* ── Success Modal Popup ── */}
      {isOrderPlaced && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
            <div className="bg-white max-w-sm w-full p-10 rounded-3xl shadow-2xl text-center relative overflow-hidden animate-in zoom-in-95 duration-500">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-gray-50 rounded-full"></div>
                
                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 text-green-600 rounded-full mb-8 shadow-inner animate-bounce">
                        <CheckCircle2 size={42} strokeWidth={2.5} />
                    </div>
                    
                    <h2 className="text-xl font-bold uppercase tracking-tight text-gray-900 mb-3">Order Confirmed</h2>
                    <p className="text-[13px] text-gray-500 font-sans leading-relaxed mb-10 px-4">
                        Your luxury ensemble has been reserved and your order is placed successfully.
                    </p>
                    
                    <div className="space-y-3">
                        <button 
                            onClick={() => navigate('/')}
                            className="w-full bg-black text-white py-4 px-6 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all hover:shadow-lg shadow-black/20"
                        >
                            Continue Shopping <ArrowRight size={14} />
                        </button>
                        
                        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-4">
                            <ShieldCheck size={14} /> Secure & Protected
                        </div>
                    </div>
                </div>
                
                {/* Artistic details */}
                <Star className="absolute bottom-4 left-4 text-gray-100" size={16} fill="currentColor" />
                <Star className="absolute top-12 right-12 text-gray-100" size={12} fill="currentColor" />
            </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
