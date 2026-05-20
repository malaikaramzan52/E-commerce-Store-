import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Lock, Save, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function AdminProfile() {
  const { adminToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [msg, setMsg] = useState({ type: "", text: "" });
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!adminToken) return;
      try {
        const res = await fetch(`${API_BASE}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        const data = await res.json();
        if (res.ok) {
          setForm({
            name: data.user.name || "",
            email: data.user.email || "",
            phoneNumber: data.user.phoneNumber || "",
            address: data.user.address || "",
            password: "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [adminToken]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setMsg({ type: "success", text: "Identity verification updated successfully." });
        setForm(prev => ({ ...prev, password: "" })); // Clear password field
      } else {
        setMsg({ type: "error", text: data.message || "Failed to update profile." });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Network anomaly detected. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400 animate-pulse uppercase tracking-[0.4em] text-[10px] font-black">
          Decrypting Identity...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-4xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Protocol Access</p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
             Profile Settings
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Manage System Credentials</p>
        </div>
        <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white shadow-xl shadow-black/20">
          <ShieldCheck size={28} />
        </div>
      </header>

      {msg.text && (
        <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-center animate-bounce border ${
          msg.type === "success" ? "bg-black text-white border-black" : "bg-rose-50 text-rose-600 border-rose-200"
        }`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] p-10 md:p-14 space-y-10 relative overflow-hidden">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-50 rounded-full blur-[100px] opacity-50 -z-10 pointer-events-none translate-x-1/2 -translate-y-1/2" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {/* Identity Parameters */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-900 ml-1">Name</label>
            <div className="relative group">
              <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" />
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Exquisite Administrator"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-slate-100 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-900 ml-1">Email</label>
            <div className="relative group">
              <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" />
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="admin@elegance.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-slate-100 transition-all outline-none"
              />
            </div>
          </div>

          {/* Operational Parameters */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-900 ml-1">Phone Number</label>
            <div className="relative group">
              <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" />
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="+1 (000) 000-0000"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-slate-100 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-900 ml-1">Location</label>
            <div className="relative group">
              <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="123 High Street, Couture District"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-slate-100 transition-all outline-none"
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 mt-4 pt-10 border-t border-slate-100 space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-900 ml-1 flex items-center gap-2">
               Update Password
               <span className="text-[9px] font-bold tracking-widest text-slate-400 lowercase">(Leave blank to keep current signature)</span>
            </label>
            <div className="relative group max-w-md">
              <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-slate-100 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all shadow-xl shadow-black/20 hover:-translate-y-1 active:scale-95 flex items-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Synchronize Identity
          </button>
        </div>
      </form>
    </div>
  );
}
