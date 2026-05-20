import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MapPin, 
  CreditCard,
  ChevronRight,
  Search,
  Filter
} from "lucide-react";
import OrderTracker from "../components/OrderTracker";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Orders() {
  const navigate = useNavigate();
  const { adminToken, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      } else if (res.status === 401 || res.status === 403) {
        logout("admin");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 20000);
    return () => clearInterval(interval);
  }, [adminToken]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}` 
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === "all" || order.orderStatus === filter;
    const shippingAddress = order.shippingAddress || "";
    const userName = order.userId?.name || "Guest";
    const matchesSearch = shippingAddress.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         userName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock size={16} className="text-amber-500" />;
      case "shipped": return <Truck size={16} className="text-blue-500" />;
      case "delivered": return <CheckCircle size={16} className="text-emerald-500" />;
      case "cancelled": return <XCircle size={16} className="text-rose-500" />;
      default: return <Package size={16} className="text-slate-500" />;
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "pending": return "bg-amber-50 text-amber-700 border-amber-200";
      case "shipped": return "bg-blue-50 text-blue-700 border-blue-200";
      case "delivered": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled": return "bg-rose-50 text-rose-700 border-rose-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="text-slate-400 animate-pulse uppercase tracking-widest text-xs font-bold">Synchronizing Shipments...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-slate-400 mb-2">Sales Management</p>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Customer Orders</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-48"
            />
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-hide">
        {["all", "pending", "shipped", "out_for_delivery", "delivered", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${
              filter === s 
                ? "border-black text-black" 
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order._id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  {/* Master Header: Metadata & Operations */}
                  <thead className="bg-slate-50/50">
                    <tr className="border-b border-slate-100">
                      <th colSpan="2" className="py-6 px-8 text-left">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${getStatusStyles(order.orderStatus)}`}>
                              {getStatusIcon(order.orderStatus)}
                              {order.orderStatus}
                            </span>
                            <div className="bg-slate-900 px-4 py-1.5 rounded-full shadow-lg">
                              <p className="text-[10px] font-black text-white tracking-tighter flex items-center gap-2">
                                <span className="opacity-40 text-[8px] uppercase tracking-widest">Reference</span>
                                #{String(order._id).slice(-6).toUpperCase()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                              <User size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-[11px] font-black text-slate-900 truncate uppercase tracking-widest">{order.userId?.name || "Guest User"}</h3>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">{order.userId?.email}</p>
                            </div>
                          </div>
                        </div>
                      </th>
                      <th colSpan="3" className="py-6 px-8 text-right align-top">
                        <div className="space-y-4 inline-block text-right">
                          <div className="flex flex-col gap-0.5">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Net Valuation</p>
                             <p className="text-2xl font-black text-slate-900 tracking-tighter">Rs. {order.totalAmount.toLocaleString()}</p>
                             <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">{order.paymentMethod}</p>
                          </div>
                          <div className="pt-4 border-t border-slate-200/60 text-left">
                             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 flex items-center gap-2">
                               <MapPin size={10} className="text-slate-300" /> Logistics Destination
                             </p>
                             <p className="text-[10px] text-slate-600 leading-relaxed font-semibold italic max-w-xs">
                               {order.shippingAddress}
                             </p>
                          </div>
                        </div>
                      </th>
                    </tr>
                    
                    {/* Items Sub-Header */}
                    <tr className="bg-white border-b border-slate-100">
                      <th className="py-4 px-8 text-left text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Order Item ({order.products.length})</th>
                      <th className="py-4 px-2 text-left text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Specifications</th>
                      <th className="py-4 px-2 text-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Qty</th>
                      <th className="py-4 px-2 text-right text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Unit Price</th>
                      <th className="py-4 px-8 text-right text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Line Total</th>
                    </tr>
                  </thead>

                  {/* Product Rows */}
                  <tbody className="divide-y divide-slate-50">
                    {order.products.map((item, idx) => (
                      <tr key={idx} className="group/row hover:bg-slate-50/50 transition-colors">
                        <td className="py-5 px-8">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 shadow-sm group-hover/row:scale-105 transition-transform">
                              {item.productId?.images?.[0] ? (
                                  <img src={item.productId.images[0]} alt="" className="w-full h-full object-cover" />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-200"><Package size={24} /></div>
                              )}
                            </div>
                            <div>
                               <p className="text-[13px] font-black text-slate-900 mb-1">{item.productId?.productName || "Product Item"}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-2">
                          <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-lg uppercase tracking-widest">Size {item.size}</span>
                        </td>
                        <td className="py-5 px-2 text-center">
                          <span className="text-[11px] font-black text-slate-900">{item.quantity}</span>
                        </td>
                        <td className="py-5 px-2 text-right">
                          <p className="text-[10px] font-black text-slate-400">Rs. {item.price.toLocaleString()}</p>
                        </td>
                        <td className="py-5 px-8 text-right">
                          <p className="text-[14px] font-black text-slate-900 tracking-tighter">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Full Width Order Tracker Section */}
              <div className="px-8 pb-10 border-t border-slate-50 bg-white">
                 <div className="max-w-4xl mx-auto pt-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 text-center px-4">
                      Interactive Logistics Stream <span className="opacity-40 mx-2">•</span> Click Nodes to Update Status
                    </p>
                    <div className="px-6">
                       <OrderTracker 
                         currentStatus={order.orderStatus} 
                         isAdmin={true} 
                         onStatusChange={(newStatus) => handleUpdateStatus(order._id, newStatus)} 
                       />
                    </div>
                 </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <ShoppingCart size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider">No active orders found</h2>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">Once customers start purchasing your ladies couture, their orders will appear here for management.</p>
          </div>
        )}
      </div>
    </div>
  );
}
