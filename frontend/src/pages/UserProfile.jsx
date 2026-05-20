import { useEffect, useState } from "react";
import { User, Mail, Lock, Save, CheckCircle2, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function UserProfile() {
  const { userToken } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userToken) return;
      try {
        const res = await fetch(`${API_BASE}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.user.name || "",
            email: data.user.email || "",
            password: "",
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [userToken]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setMessage("Security protocols updated.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Security Hub</p>
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Profile Settings</h1>
      </header>

      <form onSubmit={handleUpdate} className="bg-white rounded-[40px] border border-slate-100 p-12 md:p-20 space-y-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-50 rounded-full -mr-64 -mt-64 transition-transform group-hover:scale-110 duration-1000"></div>

        {message && (
            <div className="absolute top-0 left-0 right-0 bg-black text-white p-5 text-center text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 animate-in slide-in-from-top duration-500 z-50">
                <CheckCircle2 size={18} className="text-emerald-400" /> {message}
            </div>
        )}

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                    <User size={14} className="text-slate-400" />
                    <label className="text-[10px] font-black uppercase text-slate-900 block ml-1">Full Name</label>
                </div>
                <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-black focus:bg-white transition-all"
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                    <Mail size={14} className="text-slate-400" />
                    <label className="text-[10px] font-black uppercase text-slate-900 block ml-1">Email</label>
                </div>
                <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-black focus:bg-white transition-all"
                />
            </div>

            <div className="space-y-4 md:col-span-2">
                <div className="flex items-center gap-3 px-2">
                    <Lock size={14} className="text-slate-400" />
                    <label className="text-[10px] font-black uppercase text-slate-900 block ml-1">Password</label>
                </div>
                <div className="relative">
                    <input 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Keep empty to maintain current vault key"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-black focus:bg-white transition-all placeholder:text-slate-300"
                    />
                    <Shield className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-100 transition-colors group-focus-within:text-slate-200" size={32} />
                </div>
            </div>
        </div>

        <button 
            type="submit" 
            disabled={loading}
            className="relative z-10 w-full bg-black text-white rounded-2xl py-5 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-zinc-800 transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50"
        >
            {loading ? "Re-Authorizing..." : <><Save size={18} /> Deploy Changes</>}
        </button>
      </form>
    </div>
  );
}
