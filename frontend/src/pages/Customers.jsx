import { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  Mail, 
  Calendar, 
  Shield, 
  User as UserIcon,
  Filter,
  MoreVertical,
  ArrowUpDown,
  Trash2
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Customers() {
  const { adminToken, logout } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/auth/users`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCustomers(data.users || []);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleUpdateRole = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/users/${userId}/role`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: data.message });
        fetchCustomers();
      } else {
        setMsg({ type: "error", text: data.message });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Identity eradication protocol: Are you sure?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/auth/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: data.message });
        fetchCustomers();
      } else {
        setMsg({ type: "error", text: data.message });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (msg.text) {
      const timer = setTimeout(() => setMsg({ type: "", text: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || c.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="text-slate-400 animate-pulse uppercase tracking-[0.4em] text-[10px] font-black">Decrypting Customer Records...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Social Registry</p>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Customer Base</h1>
          <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-2">{customers.length} Verified Identities Found</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="bg-white border border-slate-200 rounded-full px-6 py-4 flex items-center gap-4 shadow-sm focus-within:ring-4 focus-within:ring-slate-100 transition-all group">
              <Search size={18} className="text-slate-400 group-focus-within:text-black transition-colors" />
              <input 
                type="text" 
                placeholder="Locate identity..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-72 font-semibold placeholder:text-slate-300"
              />
           </div>
        </div>
      </header>

      {/* Filters & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-8 bg-white p-2 rounded-[40px] border border-slate-100 shadow-sm">
         <div className="flex items-center gap-2 p-1">
           {["all", "user", "admin"].map(role => (
             <button
               key={role}
               onClick={() => setFilterRole(role)}
               className={`px-8 py-3.5 rounded-[30px] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                 filterRole === role 
                   ? "bg-black text-white shadow-xl scale-105" 
                   : "text-slate-400 hover:bg-slate-50 hover:text-black"
               }`}
             >
               {role === "all" ? "Whole Database" : `${role}s`}
             </button>
           ))}
         </div>
         
         <div className="flex items-center gap-12 px-10">
            <div className="text-center group">
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 group-hover:text-black transition-colors">Total Accounts</p>
               <p className="text-3xl font-bold text-slate-900 leading-none tracking-tighter">{customers.length}</p>
            </div>
            <div className="h-10 w-px bg-slate-100"></div>
            <div className="text-center group">
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 group-hover:text-emerald-500 transition-colors">Active Users</p>
               <p className="text-3xl font-bold text-slate-900 leading-none tracking-tighter">{customers.filter(u => u.role === 'user').length}</p>
            </div>
         </div>
      </div>

      {msg.text && (
        <div className={`mx-6 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-center animate-bounce border ${
          msg.type === "success" ? "bg-black text-white border-black" : "bg-rose-50 text-rose-600 border-rose-200"
        }`}>
          {msg.text}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-7 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Account Identity</th>
                <th className="px-10 py-7 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Auth Protocol</th>
                <th className="px-10 py-7 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Joined Sequence</th>
                <th className="px-10 py-7 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Registry Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-[22px] bg-slate-100 flex items-center justify-center text-slate-900 font-black text-2xl border border-slate-200 group-hover:bg-black group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-1">
                          {user.name ? user.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="text-base font-bold text-slate-900 tracking-tight">{user.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                             <p className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                                {user.email}
                             </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-5 py-2 rounded-xl border text-[9px] font-black uppercase tracking-[0.2em] flex items-center w-fit gap-2 shadow-sm ${
                        user.role === "admin" 
                          ? "bg-black border-black text-white shadow-black/20" 
                          : "bg-white border-slate-100 text-slate-700"
                      }`}>
                         {user.role === "admin" ? <Shield size={12} className="text-emerald-400" /> : <UserIcon size={12} className="text-slate-400" />}
                         {user.role}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                       <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Entry Timestamp Authenticated</p>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => handleUpdateRole(user._id)}
                            className="px-5 py-2.5 bg-white text-slate-900 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm active:scale-95"
                          >
                             {user.role === 'admin' ? 'Demote to User' : 'Grant Admin'}
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user._id)}
                            className="p-2.5 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                            title="Eradicate Identity"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-10 py-32 text-center">
                     <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
                        <Users size={48} />
                     </div>
                     <p className="text-xl font-bold text-slate-900 uppercase tracking-tight leading-none mb-3">No identities found in registry</p>
                     <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">Query adjusted to empty set</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
