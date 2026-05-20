import { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  Search, 
  Trash2, 
  Edit2, 
  Eye, 
  Package, 
  Tags,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  X,
  MapPin,
  Save,
  Loader2,
  Building,
  Home,
  Navigation,
  Globe,
  Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrderTracker from "../components/OrderTracker";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function UserOrders() {
  const navigate = useNavigate();
  const { userToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [editingOrder, setEditingOrder] = useState(null);
  const [addressData, setAddressData] = useState({
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      postalCode: "",
      phone: ""
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);

  const fetchOrders = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    if (!userToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/orders/mine`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);
    const interval = setInterval(() => fetchOrders(false), 15000); 
    return () => clearInterval(interval);
  }, [userToken]);

  const handleEditClick = (orderId) => {
    const order = orders.find(o => o._id === orderId);
    if (order && order.orderStatus === "pending") {
        setEditingOrder(order);
        setAddressData({
            firstName: "",
            lastName: "",
            address: order.shippingAddress || "",
            apartment: "",
            city: "",
            postalCode: "",
            phone: ""
        });
    }
  };

  const handleUpdateAddress = async () => {
    const fullAddress = `${addressData.firstName} ${addressData.lastName}, ${addressData.address}${addressData.apartment ? ', ' + addressData.apartment : ''}, ${addressData.city} ${addressData.postalCode}. Phone: ${addressData.phone}`;
    
    setIsUpdating(true);
    setUpdateMsg("");
    try {
        const res = await fetch(`${API_BASE}/api/orders/mine/${editingOrder._id}/address`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`
            },
            body: JSON.stringify({ shippingAddress: fullAddress })
        });

        if (res.ok) {
            setUpdateMsg("Acquisition logistics modified.");
            fetchOrders();
            setTimeout(() => setEditingOrder(null), 1500);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setIsUpdating(false);
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

  const flattenedItems = orders.flatMap(order => 
    order.products.map(item => ({
      ...item,
      orderRef: order,
      orderId: order._id,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt
    }))
  ).filter(item => 
    item.productId?.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.orderId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Syncing Catalog</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Purchase History</p>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">My orders</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-full px-5 py-3 flex items-center gap-3 shadow-sm focus-within:ring-2 focus-within:ring-black/5 transition-all">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by product..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-48 font-medium"
            />
          </div>
        </div>
      </header>

      <div className="bg-white border border-slate-200 rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between bg-white">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Inventory of Orders</span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            {flattenedItems.length} Entries Found
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-10 py-5 text-left text-[10px] font-bold uppercase tracking-widest">Image</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-widest">Acquisition</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-widest">Category</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-widest">Valuation</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-widest">Status</th>
                <th className="px-10 py-5 text-right text-[10px] font-bold uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {flattenedItems.map((item, idx) => (
                <tr 
                  key={`${item.orderId}-${idx}`} 
                  className="hover:bg-slate-50/50 transition-colors group relative"
                >
                  <td className="px-10 py-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm group-hover:shadow-lg transition-all">
                      {item.productId?.images?.[0] ? (
                        <img src={item.productId.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Package size={20} />
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-black transition-colors">
                        {item.productId?.productName || "Product Artifact"}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        ID: {String(item.orderId).slice(-6).toUpperCase()} • Size: {item.size}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-tight">
                      <Tags size={12} className="text-slate-400" />
                      {item.productId?.categoryId?.categoryName || "Couture"}
                    </span>
                  </td>

                  <td className="px-6 py-6 font-bold text-lg text-slate-900">
                    Rs. {item.price?.toLocaleString()}
                  </td>

                  <td 
                    className="px-6 py-6"
                    onClick={() => {
                      setHoveredItem(item);
                    }}
                  >
                    <span className={`px-3 py-1.5 rounded-xl border text-[9px] font-bold uppercase tracking-widest inline-flex items-center gap-2 cursor-pointer hover:shadow-md transition-all active:scale-95 ${getStatusStyles(item.orderStatus)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                            item.orderStatus === "delivered" ? "bg-emerald-500" : 
                            item.orderStatus === "cancelled" ? "bg-rose-500" : 
                            item.orderStatus === "shipped" ? "bg-blue-500" : "bg-amber-500"
                        }`} />
                      {item.orderStatus}
                    </span>
                  </td>

                  <td className="px-10 py-6 text-right">
                    <div className="inline-flex items-center gap-2">
                       {item.orderStatus === "pending" && (
                          <button 
                            onClick={() => handleEditClick(item.orderId)}
                            className="p-2.5 rounded-xl bg-white text-slate-400 border border-slate-100 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
                            title="Update Logistics"
                          >
                            <Edit2 size={13} />
                          </button>
                       )}
                      <button 
                        onClick={() => navigate(`/product/${item.productId?._id}`)}
                        className="p-2.5 rounded-xl bg-white text-slate-900 border border-slate-100 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
                        title="View Artifact"
                      >
                        <Eye size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {flattenedItems.length === 0 && (
             <div className="py-20 text-center">
                <p className="text-slate-400 uppercase tracking-widest text-[10px] font-black">No matching records found.</p>
             </div>
          )}
        </div>
      </div>

      {/* ── Edit Address Modal ────────────────────────────────────── */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] px-4 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-y-auto max-h-[90vh] relative animate-in zoom-in-95 duration-500 border border-white/10 no-scrollbar">
                <div className="px-10 pt-10 pb-6 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm z-20">
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Logistics Modification</p>
                        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight leading-tight">Update Destination</h3>
                    </div>
                    <button onClick={() => setEditingOrder(null)} className="p-2 rounded-full hover:bg-slate-50 text-slate-400 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-10 space-y-8">
                    {updateMsg && (
                        <div className="bg-black text-white p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-bounce">
                           {updateMsg}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block ml-1">First Name</label>
                            <input 
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                                value={addressData.firstName}
                                onChange={(e) => setAddressData({...addressData, firstName: e.target.value})}
                                placeholder="Jane"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block ml-1">Last Name</label>
                            <input 
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                                value={addressData.lastName}
                                onChange={(e) => setAddressData({...addressData, lastName: e.target.value})}
                                placeholder="Smith"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block ml-1">Street Address</label>
                            <input 
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                                value={addressData.address}
                                onChange={(e) => setAddressData({...addressData, address: e.target.value})}
                                placeholder="House #, Street name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block ml-1">Apartment</label>
                            <input 
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                                value={addressData.apartment}
                                onChange={(e) => setAddressData({...addressData, apartment: e.target.value})}
                                placeholder="Optional"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block ml-1">City</label>
                            <input 
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                                value={addressData.city}
                                onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                                placeholder="Karachi"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block ml-1">Postal Code</label>
                            <input 
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                                value={addressData.postalCode}
                                onChange={(e) => setAddressData({...addressData, postalCode: e.target.value})}
                                placeholder="75500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block ml-1">Contact Phone</label>
                            <input 
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                                value={addressData.phone}
                                onChange={(e) => setAddressData({...addressData, phone: e.target.value})}
                                placeholder="+92 3..."
                            />
                        </div>
                    </div>

                    <button 
                       onClick={handleUpdateAddress}
                       disabled={isUpdating}
                       className="w-full bg-black text-white py-4.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl disabled:opacity-50"
                    >
                        {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Deploy Update</>}
                    </button>

                    <p className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-widest pb-4">
                        Modification only permissible for <span className="text-amber-500">PENDING</span> status orders.
                    </p>
                </div>
           </div>
        </div>
      )}
      {/* ── Hover Tracking Popup ────────────────────────────────── */}
      {hoveredItem && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="bg-white border border-slate-200 rounded-[40px] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.4)] w-[1100px] relative overflow-hidden animate-in zoom-in-95 duration-500 ring-1 ring-black/5"
          >
            {/* Header Strip */}
            <div className="px-12 py-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-1">Order Identifier</p>
                        <h4 className="text-xl font-bold text-slate-900 uppercase">#{String(hoveredItem.orderId).slice(-10).toUpperCase()}</h4>
                    </div>
                    <div className="h-10 w-px bg-slate-200" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-1">Expected Arrival</p>
                        <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                           <Clock size={14} className="text-emerald-500" /> {new Date(new Date(hoveredItem.createdAt).getTime() + 5*24*60*60*1000).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="h-10 w-px bg-slate-200" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-1">Logistics Status</p>
                        <span className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${getStatusStyles(hoveredItem.orderStatus)}`}>
                            {hoveredItem.orderStatus}
                        </span>
                    </div>
                </div>

                <button 
                    onClick={() => setHoveredItem(null)}
                    className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-black hover:text-white transition-all shadow-sm"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Tracker Body (Wide & Short) */}
            <div className="p-16 bg-white relative">
                <div className="flex items-center justify-between mb-12">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 border-l-4 border-black pl-4">Live Logistics Pipeline</p>
                    <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-full">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Connection Stable</span>
                    </div>
                </div>

                <div className="px-10">
                    <OrderTracker currentStatus={hoveredItem.orderStatus} />
                </div>
            </div>

            {/* Bottom Address Bar */}
            <div className="px-12 py-6 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <MapPin size={16} className="text-slate-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Destination:</p>
                    <p className="text-[11px] text-white font-bold tracking-wide leading-none">
                        {hoveredItem.orderRef?.shippingAddress}
                    </p>
                </div>
                <div className="flex items-center gap-6 opacity-40">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Couture Logistics Engine A-1</p>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
