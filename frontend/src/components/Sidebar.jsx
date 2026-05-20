import { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Boxes, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  PlusSquare, 
  Tag, 
  Tags,
  ShoppingCart,
  Users,
  Settings,
  PieChart,
  MessageSquare,
  Shield,
  LogOut
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroup, setOpenGroup] = useState("catalog");
  const [notifications, setNotifications] = useState([]);
  const [showComplaintsPopup, setShowComplaintsPopup] = useState(false);
  const [popupTop, setPopupTop] = useState(0);
  const popupRef = useRef(null);
  const { adminToken } = useAuth();
  
  useEffect(() => {
    if (!adminToken) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/orders/notifications/unread`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
        }
      } catch (err) {
        console.error("[Sidebar] Fetch failed:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [adminToken]);

  // Close popup on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowComplaintsPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const complaintNotifications = notifications.filter(n => n.type === "complaint");
  const complaintCount = complaintNotifications.length;

  const menu = useMemo(
    () => [
      {
        key: "main",
        label: "Dashboard",
        icon: Home,
        children: [
          { label: "Overview", path: "/dashboard", icon: PieChart },
        ],
      },
      {
        key: "catalog",
        label: "Products",
        icon: Boxes,
        children: [
          { label: "Inventory", path: "/dashboard/products", icon: LayoutGrid },
          { label: "New Product", path: "/dashboard/products/create", icon: PlusSquare },
          { label: "Categories", path: "/dashboard/products/categories", icon: Tags },
          { label: "Promotions", path: "/dashboard/products/discounted", icon: Tag },
        ],
      },
      {
        key: "sales",
        label: "Orders",
        icon: ShoppingCart,
        children: [
          { label: "Customer Orders", path: "/dashboard/orders", icon: ShoppingCart },
        ],
      },
      {
        key: "customers",
        label: "Customers",
        icon: Users,
        children: [
          { label: "Account List", path: "/dashboard/customers", icon: Users },
        ],
      },
      {
        key: "complaints",
        label: "Queries",
        icon: MessageSquare,
        children: [
          { label: "Public Inquiries", path: "/dashboard/queries", icon: MessageSquare },
          { label: "Customer Complaints", path: "/dashboard/complaints", icon: Shield },
        ],
      },
      {
        key: "settings",
        label: "Settings",
        icon: Settings,
        children: [
          { label: "Admin Profile", path: "/dashboard/profile", icon: Shield },
        ],
      },
    ],
    []
  );

  const handleNavigate = (item) => {
    if (item.disabled) return;
    navigate(item.path);
  };

  const isActivePath = (path) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  const toggleGroup = (key) => {
    if (isCollapsed) setIsCollapsed(false);
    setOpenGroup(openGroup === key ? "" : key);
  };

  const { logout } = useAuth();
  const handleLogout = () => {
    logout("admin");
    navigate("/admin/login");
  };

  return (
    <div
      className={`hidden md:flex flex-col bg-black text-white shadow-2xl border-r border-white/5 transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-20" : "w-72"} h-[calc(100vh-64px)] sticky top-[64px] z-40 select-none`}
    >
      {/* ── Header ── */}
      <div className="px-6 py-6 border-b border-white/5 flex items-center justify-between">
        {!isCollapsed && (
          <span className="text-[11px] font-extrabold uppercase tracking-[.4em] text-white">
            Admin Panel
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white/40 hover:text-white transition-colors p-1 ml-auto"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* ── Navigation Items ── */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4 scrollbar-hide no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
        
        {menu.map((group) => {
          const GroupIcon = group.icon;
          const isOpen = openGroup === group.key && !isCollapsed;
          const isGroupActive = group.children.some(child => isActivePath(child.path));

          return (
            <div key={group.key} className="px-3">
              {/* Group Trigger */}
              <button
                onClick={() => toggleGroup(group.key)}
                className={`w-full flex items-center gap-4 rounded-2xl px-4 py-3.5 text-[11px] font-bold uppercase tracking-[.2em] transition-all
                  ${isOpen || isGroupActive ? "text-white" : "text-white hover:text-white/70"}`}
              >
                <div className={`p-2 rounded-xl transition-colors ${isGroupActive ? "bg-white/10 text-white" : "text-white/30"}`}>
                  <GroupIcon size={18} />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between relative">
                    <span>{group.label}</span>
                    {group.key === "complaints" && complaintCount > 0 && (
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setPopupTop(rect.top + rect.height / 2);
                            setShowComplaintsPopup(!showComplaintsPopup);
                          }}
                          className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full mr-2 hover:scale-110 active:scale-90 transition-transform shadow-lg shadow-rose-500/20"
                        >
                          {complaintCount}
                        </button>

                        {/* Floating Complaints Popover */}
                        {showComplaintsPopup && (
                          <div 
                            ref={popupRef}
                            onClick={(e) => e.stopPropagation()}
                            className="fixed left-[260px] w-60 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] animate-in fade-in slide-in-from-left-4 duration-300 z-[100] cursor-default overflow-hidden"
                            style={{ top: `${popupTop}px`, transform: 'translateY(-50%)' }}
                          >
                            <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                              <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">New Issues</h4>
                            </div>
                            <div className="max-h-56 overflow-y-auto no-scrollbar">
                              {complaintNotifications.map((n) => (
                                <button 
                                  key={n._id}
                                  onClick={() => {
                                    setShowComplaintsPopup(false);
                                    navigate("/dashboard/complaints", { state: { openComplaintId: n.complaintId } });
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0 group"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter truncate max-w-[120px]">{n.customerName}</p>
                                    <span className="text-[8px] font-bold text-rose-500 uppercase">New</span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 font-medium leading-tight line-clamp-1 italic">"{n.message.replace('New complaint filed: ', '')}"</p>
                                </button>
                              ))}
                            </div>
                            <div className="p-3 bg-white text-center border-t border-slate-50">
                               <button 
                                onClick={() => { setShowComplaintsPopup(false); navigate("/dashboard/complaints"); }}
                                className="text-[9px] font-black uppercase tracking-widest text-slate-900 border border-slate-200 px-4 py-2 rounded-xl hover:bg-black hover:text-white transition-all w-full"
                               >
                                  Management View
                               </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {!isCollapsed && (
                  <ChevronDown 
                    size={14} 
                    className={`ml-auto transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
                  />
                )}
              </button>

              {/* Sub-items (Dropdown) */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                <div className="space-y-1.5 ml-4 border-l border-white/5 pl-4">
                  {group.children.map((item) => {
                    const active = isActivePath(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNavigate(item)}
                        disabled={item.disabled}
                        className={`w-full flex items-center gap-4 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-[.15em] transition-all
                          ${active 
                            ? "bg-white text-black shadow-xl" 
                            : item.disabled
                            ? "opacity-20 cursor-not-allowed"
                            : "text-white hover:text-white hover:bg-white/5"}`}
                      >
                        <ItemIcon size={14} />
                        {!isCollapsed && (
                          <div className="flex items-center justify-between flex-1">
                            <span>{item.label}</span>
                            {item.path === "/dashboard/complaints" && complaintCount > 0 && (
                              <span className="bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                                {complaintCount}
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Logout ── */}
      <div className="p-6 border-t border-white/5 space-y-2">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-white hover:text-rose-500 hover:bg-rose-500/5 transition-all group"
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Logout Session</span>}
        </button>
      </div>
    </div>
  );
}