import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserSidebar from "../components/UserSidebar";
import UserOrders from "./UserOrders";
import UserAddress from "./UserAddress";
import UserProfile from "./UserProfile";
import UserComplaints from "./UserComplaints";
import { useAuth } from "../context/AuthContext";
import ErrorBoundary from "../components/ErrorBoundary";
import { 
  ShoppingBag, 
  Package, 
  Clock, 
  CreditCard, 
  ArrowRight, 
  ChevronRight, 
  MapPin, 
  Calendar,
  Sparkles,
  TrendingUp
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function UserDashboard() {
  const { user, userToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userToken) return;

    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/orders/mine`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userToken]);


  if (error) return <h2 className="text-center mt-20 text-red-500 font-bold">{error}</h2>;
  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="text-black font-bold uppercase tracking-widest text-[10px]">Initializing Session</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <Navbar user={user} />
      <div className="flex flex-1 pt-20">
        <ErrorBoundary>
          <UserSidebar />
        </ErrorBoundary>

        <div className="flex-1 p-6 md:p-12 overflow-y-auto">
          <Routes>
            <Route index element={<WelcomeScreen user={user} orders={orders} loading={loading} />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="address" element={<UserAddress />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="complaints" element={<UserComplaints />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function UserStatCard({ label, value, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-black/5 transition-all">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
                <p className="text-xl font-bold text-slate-900">{value}</p>
            </div>
        </div>
    );
}

function WelcomeScreen({ user, orders, loading }) {
    const navigate = useNavigate();
    const recentOrders = orders.slice(0, 3);
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const activeOrders = orders.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length;

    return (
        <div className="max-w-6xl mx-auto py-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Personal Station</p>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                        Welcome, <span className="font-black text-black">{user.name.split(' ')[0]}</span>
                    </h1>
                </div>
                <div className="flex gap-3">
                    <Link to="/shop" className="px-6 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-all shadow-lg active:scale-95 flex items-center gap-2">
                        <Sparkles size={14} /> New Acquisitions
                    </Link>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <UserStatCard 
                    label="Total Acquisitions" 
                    value={orders.length} 
                    icon={<ShoppingBag size={20} />} 
                    color="bg-slate-900" 
                />
                <UserStatCard 
                    label="Active Logistics" 
                    value={activeOrders} 
                    icon={<Clock size={20} />} 
                    color="bg-amber-500" 
                />
                <UserStatCard 
                    label="Premium Valuation" 
                    value={`Rs. ${totalSpent.toLocaleString()}`} 
                    icon={<TrendingUp size={20} />} 
                    color="bg-emerald-600" 
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Cards Section */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Recent Orders Section */}
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
                        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-900">Recent Acquisitions</h3>
                            <Link to="orders" className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors">View History</Link>
                        </div>
                        <div className="p-4 space-y-4">
                            {loading ? (
                                <div className="py-10 flex flex-col items-center gap-3">
                                    <div className="w-6 h-6 border-2 border-slate-200 border-t-black rounded-full animate-spin"></div>
                                    <p className="text-[9px] font-medium text-slate-300 uppercase tracking-widest">Syncing Data</p>
                                </div>
                            ) : recentOrders.length > 0 ? (
                                recentOrders.map((order, idx) => (
                                    <div key={order._id} className="group p-5 rounded-3xl hover:bg-slate-50 transition-all flex items-center justify-between border border-transparent hover:border-slate-100">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                                                {order.products?.[0]?.productId?.images?.[0] ? (
                                                    <img src={order.products[0].productId.images[0]} className="w-full h-full object-cover" alt="" />
                                                ) : <Package className="w-full h-full p-5 text-slate-200" />}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-900">{order.products?.[0]?.productId?.productName || 'Couture Item'}</p>
                                                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <span>Ref: {order._id.slice(-6).toUpperCase()}</span>
                                                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-xs font-bold text-slate-900">Rs. {order.totalAmount.toLocaleString()}</p>
                                                <p className={`text-[9px] font-bold uppercase tracking-widest ${
                                                    order.orderStatus === 'delivered' ? 'text-emerald-500' : 
                                                    order.orderStatus === 'cancelled' ? 'text-rose-500' : 'text-amber-500'
                                                }`}>{order.orderStatus}</p>
                                            </div>
                                            <button 
                                                onClick={() => navigate('orders')}
                                                className="p-3 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-black group-hover:text-white transition-all"
                                            >
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-16 text-center space-y-4">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                                        <ShoppingBag size={32} />
                                    </div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Your wardrobe is awaiting its first masterpiece</p>
                                    <Link to="/shop" className="inline-block text-[10px] font-bold uppercase tracking-widest text-blue-600 underline underline-offset-4">Begin Journey</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-8">


                    <div className="bg-black p-10 rounded-[40px] border border-white/5 shadow-2xl flex flex-col justify-between group overflow-hidden relative min-h-[300px]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-6 flex items-center gap-2">
                                <Calendar size={12} /> Client Tenure
                            </p>
                            <h3 className="text-2xl font-bold text-white mb-4">Member Since <br /> {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                            <p className="text-white/40 text-sm leading-relaxed mb-8">Part of the Elegance Couture inner circle.</p>
                        </div>
                        <button 
                            onClick={() => navigate('profile')}
                            className="relative z-10 w-full px-8 py-4 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-white hover:text-black transition-all active:scale-95 border border-white/5 backdrop-blur-sm"
                        >
                            Member Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Link = ({ to, children, ...props }) => {
    const navigate = useNavigate();
    const isAbsolute = to.startsWith('/');
    return (
        <a 
            href={to} 
            onClick={(e) => {
                e.preventDefault();
                navigate(isAbsolute ? to : `/user/dashboard/${to}`);
            }} 
            {...props}
        >
            {children}
        </a>
    );
};
