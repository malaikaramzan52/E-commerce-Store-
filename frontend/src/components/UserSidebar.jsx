import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  ShoppingBag, 
  MapPin, 
  Settings, 
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function UserSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();

  const menu = useMemo(
    () => [
      {
        label: "Home",
        path: "/user/dashboard",
        icon: Home,
      },
      {
        label: "Order History",
        path: "/user/dashboard/orders",
        icon: ShoppingBag,
      },
      {
        label: "Address Details",
        path: "/user/dashboard/address",
        icon: MapPin,
      },
      {
        label: "Complaints",
        path: "/user/dashboard/complaints",
        icon: MessageSquare,
      },
      {
        label: "Profile Settings",
        path: "/user/dashboard/profile",
        icon: Settings,
      },
    ],
    []
  );

  const handleNavigate = (path) => {
    navigate(path);
  };

  const isActivePath = (path) => {
    if (path === "/user/dashboard") return pathname === "/user/dashboard";
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout("user");
    navigate("/login");
  };

  return (
    <div
      className={`hidden md:flex flex-col bg-black text-white shadow-2xl border-r border-white/5 transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-20" : "w-72"} h-[calc(100vh-64px)] sticky top-[64px] z-40 select-none`}
    >
      <div className="px-6 py-6 border-b border-white/5 flex items-center justify-between">
        {!isCollapsed && (
          <span className="text-[11px] font-extrabold uppercase tracking-[.4em] text-white">
            User Panel
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white/40 hover:text-white transition-colors p-1 ml-auto"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-8 space-y-2 no-scrollbar px-3">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(item.path);

          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-[11px] font-bold uppercase tracking-[.15em] transition-all
                ${active 
                  ? "bg-white text-black shadow-xl" 
                  : "text-white hover:text-white hover:bg-white/5"}`}
            >
              <div className={`transition-colors ${active ? "text-black" : "text-white/30"}`}>
                <Icon size={18} />
              </div>
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>

      <div className="p-6 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-5 rounded-2xl text-white hover:text-rose-500 hover:bg-rose-500/5 transition-all group"
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
