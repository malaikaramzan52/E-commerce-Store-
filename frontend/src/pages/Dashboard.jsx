import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CreateProduct from "./CreateProduct";
import Products from "./Products";
import DiscountedProducts from "./DiscountedProducts";
import Categories from "./Categories";
import EditProduct from "./EditProduct";
import ProductDetails from "./ProductDetails";
import Orders from "./Orders"; // NEW
import Queries from "./Queries";
import AdminComplaints from "./AdminComplaints";
import Customers from "./Customers";
import AdminProfile from "./AdminProfile";
import { Boxes, Tags, Tag, ArrowUpRight, Bell, X, ShoppingBag, Users, PieChart, MessageSquare, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ErrorBoundary from "../components/ErrorBoundary";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function StatCard({ label, value, icon, color, gradient, path, percentage, height = "h-44" }) {
  return (
    <Link 
      to={path}
      className={`relative overflow-hidden p-8 rounded-[40px] border border-white/40 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-black/10 group flex flex-col justify-center cursor-pointer ${height}`}
    >
      {/* Dynamic Background Gradient */}
      <div className={`absolute inset-0 opacity-[0.07] ${gradient}`}></div>
      
      <div className="relative z-10 flex items-center gap-6">
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 group-hover:rotate-12 ${color}`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">{label}</p>
          <div className="flex items-center gap-4">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value.toLocaleString()}</h3>
            <div className="flex items-center gap-1 text-emerald-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
              <ArrowUpRight size={12} className="font-bold" />
              <span className="text-[10px] font-bold">{percentage}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative accent */}
      <div className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full opacity-10 blur-3xl ${color}`}></div>
    </Link>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { admin, adminToken, logout, user } = useAuth();
  const [stats, setStats] = useState({ products: 0, categories: 0, promos: 0, orders: 0 });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!adminToken) return;

    const fetchStatsAndNotifications = async () => {
      try {
        const [pRes, cRes, oRes, notifRes] = await Promise.all([
          fetch(`${API_BASE}/api/products`, { headers: { Authorization: `Bearer ${adminToken}` } }),
          fetch(`${API_BASE}/api/categories`, { headers: { Authorization: `Bearer ${adminToken}` } }),
          fetch(`${API_BASE}/api/orders`, { headers: { Authorization: `Bearer ${adminToken}` } }),
          fetch(`${API_BASE}/api/orders/notifications/unread`, { headers: { Authorization: `Bearer ${adminToken}` } })
        ]);

        if (pRes.ok && cRes.ok && oRes.ok) {
          const pData = await pRes.json();
          const cData = await cRes.json();
          const oData = await oRes.json();
          setStats({
            products: pData.products?.length || 0,
            categories: cData.categories?.length || 0,
            promos: pData.products?.filter(p => p.discountPrice > 0).length || 0,
            orders: oData.orders?.length || 0
          });
        }

        if (notifRes.ok) {
            const notifData = await notifRes.json();
            setNotifications(notifData.notifications || []);
        }

      } catch (err) {
        console.error("[Dashboard] Background fetch failed:", err);
      }
    };

    fetchStatsAndNotifications();
    const interval = setInterval(fetchStatsAndNotifications, 30000);
    return () => clearInterval(interval);
  }, [adminToken]);


  const markAsRead = async (id) => {
    try {
        await fetch(`${API_BASE}/api/orders/notifications/${id}/read`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
        console.error("Failed to mark as read", err);
    }
  };

  if (error) return <h2 className="text-center mt-20 text-red-500 font-bold">{error}</h2>;
  if (!admin) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="text-black font-black uppercase tracking-[0.5em] text-[10px]">Initializing Workspace</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <Navbar user={user} />
      <div className="flex flex-1 pt-20">
        <ErrorBoundary>
          <Sidebar />
        </ErrorBoundary>

        <div className="flex-1 p-6 md:p-12 overflow-y-auto">
          <Routes>
            <Route
              index
              element={
                <div className="space-y-12 max-w-7xl mx-auto">
                  <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Management Station</p>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
                          Welcome, <span className="text-black font-black">{admin.name.split(' ')[0]}</span>
                        </h1>
                    </div>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`group flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-500 relative ${notifications.length > 0 ? 'bg-black text-white border-black shadow-2xl' : 'bg-white border-slate-200 text-slate-500 hover:border-black hover:text-black shadow-sm'}`}
                        >
                            <Bell size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">System Alerts</span>
                            {notifications.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[9px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-xl">
                                    {notifications.length}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-6 w-96 bg-white border border-slate-100 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] z-[100] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-900">Notifications</h3>
                                    <button onClick={() => setShowNotifications(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors text-slate-400 hover:text-black"><X size={16} /></button>
                                </div>
                                <div className="max-h-[450px] overflow-y-auto no-scrollbar">
                                    {notifications.length > 0 ? (
                                        notifications.map(n => (
                                            <div key={n._id} className="p-6 border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-all group">
                                                <div className="flex gap-4">
                                                    <div className={`w-12 h-12 ${n.type === 'complaint' ? 'bg-rose-500' : 'bg-black'} text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                                                        {n.type === 'complaint' ? <Shield size={20} /> : <ShoppingBag size={20} />}
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <p className="text-xs font-bold text-slate-900">
                                                            {n.customerName} {n.type === 'complaint' ? "filed a complaint" : "placed an order"}
                                                        </p>
                                                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{n.message}</p>
                                                        <div className="flex items-center justify-between pt-3">
                                                           <Link 
                                                              to={n.type === 'complaint' ? "/dashboard/complaints" : "/dashboard/orders"} 
                                                              state={n.type === 'complaint' ? { openComplaintId: n.complaintId } : null}
                                                              onClick={() => { setShowNotifications(false); markAsRead(n._id); }}
                                                              className={`text-[10px] font-bold uppercase tracking-widest ${n.type === 'complaint' ? 'text-rose-600 hover:text-rose-800' : 'text-blue-600 hover:text-blue-800'} underline underline-offset-4`}
                                                           >
                                                              {n.type === 'complaint' ? "Review Complaint" : "Procure Order"}
                                                           </Link>
                                                           <button 
                                                              onClick={() => markAsRead(n._id)}
                                                              className="text-[9px] font-bold uppercase tracking-widest text-slate-300 hover:text-rose-500"
                                                           >
                                                               Dismiss
                                                           </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-16 text-center space-y-4">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200"><Bell size={32} /></div>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">All clear at the moment</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 bg-slate-50/50 text-center border-t border-slate-100">
                                    <Link to="orders" onClick={() => setShowNotifications(false)} className="text-[10px] font-bold uppercase tracking-widest text-slate-900 hover:opacity-50 transition-opacity">Full Activity Log</Link>
                                </div>
                            </div>
                        )}
                    </div>
                  </header>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Total Products" value={stats.products} icon={<Boxes size={26} />} color="bg-slate-800" gradient="bg-slate-900" path="/dashboard/products" percentage="12.5%" />
                    <StatCard label="Categories" value={stats.categories} icon={<Tags size={26} />} color="bg-indigo-600" gradient="bg-indigo-700" path="/dashboard/products/categories" percentage="8.2%" />
                    <StatCard label="Active Promos" value={stats.promos} icon={<Tag size={26} />} color="bg-rose-600" gradient="bg-rose-700" path="/dashboard/products/discounted" percentage="15.0%" />
                    <StatCard label="Total Orders" value={stats.orders} icon={<ShoppingBag size={26} />} color="bg-amber-500" gradient="bg-amber-600" path="/dashboard/orders" percentage="10.4%" />
                  </div>

                  <div className="relative bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-10 md:p-20 overflow-hidden group">
                     {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-50/50 rounded-full -mr-64 -mt-64 transition-transform duration-1000 group-hover:scale-110"></div>
                    <div className="absolute bottom-10 left-10 w-24 h-24 bg-rose-50/30 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div className="space-y-8">
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mb-4">Operations Hub</p>
                           <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tight leading-tight mb-6">Mastering Your <br/>Seasonal Collections</h2>
                           <p className="text-slate-500 text-sm leading-relaxed max-w-lg font-medium">
                            Welcome to your refined control center. Effortlessly orchestrate your inventory, 
                            sculpt new categories, and curate exclusive promotions. Every stitch of your data 
                            is perfectly synced and waiting for your command.
                           </p>
                        </div>
                        <div className="flex flex-wrap gap-5">
                          <Link to="products/create" className="px-10 py-5 bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded-2xl hover:bg-zinc-800 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1 active:scale-95">Add New Masterpiece</Link>
                          <Link to="products" className="px-10 py-5 border-2 border-black text-black text-[11px] font-bold uppercase tracking-widest rounded-2xl hover:bg-black hover:text-white transition-all hover:-translate-y-1 active:scale-95">Explore Catalog</Link>
                        </div>
                      </div>

                      <div className="bg-slate-50/80 rounded-[32px] border border-slate-100 p-8 shadow-inner overflow-hidden relative">
                        {/* Subtle background pattern */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-8">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-800">Recent Transactions</h3>
                            <Link to="/dashboard/orders" className="text-[9px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors border-b border-blue-600/20 pb-0.5">Explore All</Link>
                          </div>
                          
                          <div className="space-y-4">
                            {notifications.slice(0, 3).length > 0 ? (
                              notifications.slice(0, 3).map((n, idx) => (
                                <div key={idx} className="bg-[#111] p-5 rounded-2xl border border-white/5 shadow-xl flex items-center justify-between group hover:bg-black hover:scale-[1.02] transition-all duration-500">
                                  <div className="flex items-center gap-4">
                                    <div className={`w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm ${n.type === 'complaint' ? 'text-rose-500 group-hover:bg-rose-500 group-hover:text-white' : 'text-white/40 group-hover:bg-white group-hover:text-black'}`}>
                                      {n.type === 'complaint' ? <Shield size={20} /> : <ShoppingBag size={20} />}
                                    </div>
                                    <div className="space-y-0.5">
                                      <p className="text-[11px] font-bold text-white uppercase tracking-tight">{n.customerName}</p>
                                      <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                        {n.type === 'complaint' ? 'User Complaint' : `ID: ${String(n.orderId || '').slice(-6).toUpperCase()}`}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg border shadow-sm ${
                                      n.type === 'complaint' ? 'bg-black text-rose-500 border-rose-500/20' : 'bg-black text-emerald-400 border-emerald-400/20'
                                    }`}>
                                      {n.type === 'complaint' ? 'New Issue' : 'Success'}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="py-16 text-center">
                                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Awaiting Activity</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="products/create" element={<CreateProduct />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="queries" element={<Queries />} />
            <Route path="complaints" element={<AdminComplaints />} />
            <Route path="products/view/:id" element={<ProductDetails />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="products/categories" element={<Categories />} />
            <Route path="products/discounted" element={<DiscountedProducts />} />
            <Route path="customers" element={<Customers />} />
            <Route path="profile" element={<AdminProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}