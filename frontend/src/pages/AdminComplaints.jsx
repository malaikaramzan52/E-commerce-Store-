import { useState, useEffect } from "react";
import { MessageSquare, User, Calendar, CheckCircle, Trash2, Shield, AlertCircle, X, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, Phone, Mail as MailIcon, Package, Clock, ShieldCheck } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function AdminComplaints() {
  const { adminToken, logout } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const location = useLocation();

  const fetchComplaints = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/complaints`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setComplaints(data.complaints);
      } else if (res.status === 401 || res.status === 403) {
        logout("admin");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, [adminToken]);

  // Handle auto-opening from notification
  useEffect(() => {
    if (!loading && complaints.length > 0 && location.state?.openComplaintId) {
      const complaint = complaints.find(c => c._id === location.state.openComplaintId);
      if (complaint) {
        setSelectedComplaint(complaint);
        // Clear state to prevent re-opening on manual refresh
        window.history.replaceState({}, document.title);
      }
    }
  }, [loading, complaints, location.state]);

  const updateStatus = async (id, status) => {
    try {
       const res = await fetch(`${API_BASE}/api/complaints/${id}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchComplaints();
    } catch (err) { console.error(err); }
  };

  const filtered = complaints.filter(c => 
    c.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Issue Management</p>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Customer Complaints</h1>
        </div>
        <div className="bg-white border border-slate-200 rounded-full px-5 py-3 flex items-center gap-3 shadow-sm focus-within:ring-2 focus-within:ring-black/5 transition-all">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by user or subject..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-64 font-medium"
          />
        </div>
      </header>

      {loading ? (
        <div className="py-20 text-center uppercase tracking-[0.4em] text-[10px] text-slate-400 animate-pulse">Syncing grievances...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[40px] p-24 text-center shadow-sm">
           <MessageSquare size={52} className="mx-auto text-slate-100 mb-6" />
           <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Registry clear of disputes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filtered.map((c) => (
            <div key={c._id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Shield size={60} className="text-slate-900" />
                </div>

                <div className="relative z-10 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-black text-xs uppercase shadow-lg">
                                    {c.user?.name?.[0] || "?"}
                                </div>
                                <div>
                                    <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Complainant</h3>
                                    <p className="text-sm font-bold text-slate-900 leading-none">{c.user?.name || "Deleted User"}</p>
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ml-auto border ${
                                    c.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    c.status === 'Pending' ? 'bg-black text-white border-black' :
                                    'bg-blue-50 text-blue-600 border-blue-100'
                                }`}>
                                    {c.status}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter">{c.subject}</h4>
                                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-50 text-slate-600 leading-relaxed text-sm font-medium">
                                    "{c.description}"
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                                <div className="flex flex-wrap gap-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><User size={12} className="text-slate-300" /> {c.user?.email || "N/A"}</span>
                                    <span className="flex items-center gap-2"><Calendar size={12} className="text-slate-300" /> {new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {c.status !== 'Resolved' && (
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => updateStatus(c._id, 'Resolved')}
                                                className="px-4 py-2 bg-black text-white hover:bg-zinc-800 rounded-xl transition-all flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-widest shadow-lg active:scale-95"
                                            >
                                                <CheckCircle size={14} /> Resolve
                                            </button>
                                            {c.status === 'Pending' && (
                                                <button 
                                                    onClick={() => updateStatus(c._id, 'In Progress')}
                                                    className="px-4 py-2 bg-white text-slate-900 border border-slate-200 hover:border-black rounded-xl transition-all flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-widest active:scale-95"
                                                >
                                                    <AlertCircle size={14} /> Start
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    <button 
                                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                        title="Permanent deletion restricted"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedComplaint(null)} />
            
            <div className="relative w-full max-w-2xl bg-white rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-500">
                {/* Modal Header */}
                <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500 mb-1">Issue Overview</p>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Complaint Details</h2>
                    </div>
                    <button 
                        onClick={() => setSelectedComplaint(null)}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-black hover:border-black transition-all shadow-sm"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal content */}
                <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
                    {/* User & Order Info */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Complainant</h3>
                            <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4">
                                <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-black text-xs uppercase shadow-sm">
                                    {selectedComplaint.user?.name?.[0] || "?"}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-900">{selectedComplaint.user?.name}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">{selectedComplaint.user?.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Reference</h3>
                            <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                                    <Package size={20} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-900">ID: {selectedComplaint.order_id || "N/A"}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">{selectedComplaint.complaint_type}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subject & Description */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</h3>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${
                                selectedComplaint.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                selectedComplaint.status === 'Pending' ? 'bg-black text-white border-black' :
                                'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                                {selectedComplaint.status}
                            </span>
                        </div>
                        <div className="bg-slate-50/50 border border-slate-50 rounded-[32px] p-8 space-y-4">
                            <h4 className="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">
                                {selectedComplaint.subject}
                            </h4>
                            <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                                "{selectedComplaint.description}"
                            </p>
                        </div>
                    </div>

                    {/* Image Preview (If exists) */}
                    {selectedComplaint.image && (
                        <div className="space-y-4">
                             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Supporting Evidence</h3>
                             <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-xl">
                                <img src={selectedComplaint.image} alt="Complaint Evidence" className="w-full h-auto object-cover max-h-80" />
                             </div>
                        </div>
                    )}

                    {/* Timeline Info */}
                    <div className="pt-4 flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span className="flex items-center gap-2"><Clock size={14} className="text-slate-300" /> Filed: {new Date(selectedComplaint.createdAt).toLocaleString()}</span>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <ShieldCheck size={16} /> Secure Inquiry
                     </div>
                     <div className="flex items-center gap-3">
                         {selectedComplaint.status !== 'Resolved' && (
                             <>
                                {selectedComplaint.status === 'Pending' && (
                                    <button 
                                        onClick={() => { updateStatus(selectedComplaint._id, 'In Progress'); setSelectedComplaint(prev => ({...prev, status: 'In Progress'})); }}
                                        className="px-8 py-4 bg-white text-slate-900 border border-slate-200 hover:border-black rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest active:scale-95"
                                    >
                                        Mark In Progress
                                    </button>
                                )}
                                <button 
                                    onClick={() => { updateStatus(selectedComplaint._id, 'Resolved'); setSelectedComplaint(prev => ({...prev, status: 'Resolved'})); }}
                                    className="px-8 py-4 bg-black text-white hover:bg-zinc-800 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 flex items-center gap-2"
                                >
                                    <CheckCircle size={14} /> Resolve Case
                                </button>
                             </>
                         )}
                     </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
