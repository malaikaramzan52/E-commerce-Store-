import { useEffect, useState } from "react";
import { Save, CheckCircle2, Phone, MapPin, Building, Home, Navigation, Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function UserAddress() {
  const { userToken } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    phone: ""
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
          const user = data.user;
          // Try to parse the address string if it was saved in concatenated format
          // Checkout format: `${formData.firstName} ${formData.lastName}, ${formData.address}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city} ${formData.postalCode}. Phone: ${formData.phone}`
          setFormData({
            firstName: user.name?.split(" ")[0] || "",
            lastName: user.name?.split(" ").slice(1).join(" ") || "",
            address: user.address || "",
            apartment: "",
            city: "",
            postalCode: "",
            phone: user.phoneNumber || ""
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
    if (!userToken) return;
    setLoading(true);
    setMessage("");

    // Concat address for the single model field
    const fullAddress = `${formData.address}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city} ${formData.postalCode}`;

    try {
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ 
            address: fullAddress, 
            phoneNumber: formData.phone,
            name: `${formData.firstName} ${formData.lastName}`.trim()
        }),
      });
      if (res.ok) {
        setMessage("Shipping profile updated successfully.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <header>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Primary Logistics</p>
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Address Details</h1>
      </header>

      <form onSubmit={handleUpdate} className="bg-white rounded-[40px] border border-slate-100 p-12 md:p-16 space-y-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] relative overflow-hidden">
        {message && (
            <div className="absolute top-0 left-0 right-0 bg-black text-white p-5 text-center text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 animate-in slide-in-from-top duration-500 z-50">
                <CheckCircle2 size={18} className="text-emerald-400" /> {message}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-900 block ml-1">First Name</label>
                <input 
                    name="firstName" value={formData.firstName} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                    placeholder="E.g. Jane"
                />
            </div>
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-900 block ml-1">Last Name</label>
                <input 
                    name="lastName" value={formData.lastName} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                    placeholder="E.g. Smith"
                />
            </div>
            <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-900 block ml-1">Street Address</label>
                <div className="relative">
                    <MapPin size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                        name="address" value={formData.address} onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                        placeholder="House #, Street name"
                    />
                </div>
            </div>
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-900 block ml-1">Apartment/Suite</label>
                <input 
                    name="apartment" value={formData.apartment} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                    placeholder="Optional"
                />
            </div>
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-900 block ml-1">City</label>
                <input 
                    name="city" value={formData.city} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                    placeholder="Karachi, Lahore..."
                />
            </div>
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-900 block ml-1">Postal Code</label>
                <input 
                    name="postalCode" value={formData.postalCode} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                    placeholder="Optional"
                />
            </div>
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-900 block ml-1">Contact Phone</label>
                <input 
                    name="phone" value={formData.phone} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                    placeholder="+92 3XX XXXXXXX"
                />
            </div>
        </div>

        <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white rounded-2xl py-5 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-zinc-800 transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 mt-4"
        >
            {loading ? "Re-Routing..." : <><Save size={18} /> Deploy Defaults</>}
        </button>
      </form>
    </div>
  );
}
