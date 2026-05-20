import { useEffect, useState } from "react";
import { MessageSquare, CheckCircle2, Ghost, Plus, X, Upload } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function UserComplaints() {
  const { userToken } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    order_id: "",
    complaint_type: "Product Issue",
    subject: "",
    description: "",
    image: ""
  });

  const complaintTypes = [
    "Product Issue", 
    "Delivery Delay", 
    "Payment Issue", 
    "Wrong Item", 
    "Other"
  ];

  const fetchComplaints = async () => {
    if (!userToken) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/complaints/my`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setComplaints(data.complaints || []);
      }
    } catch (err) {
      console.error("Fetch Complaints Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [userToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/complaints`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}` 
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setShowForm(false);
        setFormData({
          order_id: "",
          complaint_type: "Product Issue",
          subject: "",
          description: "",
          image: ""
        });
        fetchComplaints();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Submit Complaint Error:", err);
      alert("Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Support Desk</p>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">My Complaints</h1>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
        >
          <Plus size={16} /> Submit Complaint
        </button>
      </header>

      {/* COMPLAINTS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
           <div className="py-20 text-center uppercase tracking-[0.4em] text-[10px] text-slate-300 animate-pulse">Syncing concierge history...</div>
        ) : complaints.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-3xl border border-slate-100 border-dashed m-4">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 mb-6">
                <Ghost size={32} />
             </div>
             <p className="text-slate-300 text-xs font-bold uppercase tracking-[0.3em]">No active complaints found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Complaint ID</th>
                  <th className="p-5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Order ID</th>
                  <th className="p-5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Subject</th>
                  <th className="p-5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Status</th>
                  <th className="p-5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Date</th>
                  <th className="p-5 text-[10px] font-bold text-slate-400 tracking-wider uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5 text-sm font-medium text-slate-600">
                      #{c.complaint_id ? c.complaint_id.slice(-6).toUpperCase() : c._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="p-5 text-sm font-medium text-slate-500">
                      {c.order_id ? `#${c.order_id}` : "-"}
                    </td>
                    <td className="p-5 text-sm font-medium text-slate-900">
                      {c.subject}
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                        c.status === 'Resolved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                        c.status === 'In Progress' ? "bg-blue-50 text-blue-600 border-blue-100" : 
                        "bg-amber-50 text-amber-600 border-amber-100"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-5 text-sm text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => setSelectedComplaint(c)}
                        className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* COMPLAINT MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">New Resolution Request</p>
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight leading-tight">File a Complaint</h2>
              </div>
              <button 
                onClick={() => setShowForm(false)}
                className="w-10 h-10 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order ID */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-900 ml-1">Order ID (Optional)</label>
                  <input 
                    type="text" 
                    name="order_id"
                    value={formData.order_id}
                    onChange={handleInputChange}
                    placeholder="e.g. ORD-12345"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                </div>
                
                {/* Complaint Type */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-900 ml-1">Complaint Type</label>
                  <select 
                    name="complaint_type"
                    value={formData.complaint_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  >
                    {complaintTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-900 ml-1">Subject / Title</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="Briefly summarize the issue"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-900 ml-1">Detailed Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Provide all relevant details about your complaint..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-900 ml-1">Attach Image (Optional)</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-sm text-slate-500 hover:bg-slate-100 transition-all">
                    <Upload size={16} />
                    {formData.image ? "Image Selected - Click to change" : "Upload File"}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.image && (
                    <div className="w-12 h-12 rounded-lg bg-black/5 overflow-hidden flex-shrink-0">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex justify-end gap-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 text-sm font-semibold text-slate-500 hover:text-black transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-black text-white text-xs font-semibold uppercase tracking-widest rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-lg active:scale-95 flex flex-col justify-center"
                >
                  {submitting ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
             <div className="bg-slate-50/50 p-7 border-b border-slate-100 flex justify-between items-center">
                <div>
                   <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-3">
                      {selectedComplaint.subject}
                   </h2>
                   <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${
                        selectedComplaint.status === 'Resolved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                        selectedComplaint.status === 'In Progress' ? "bg-blue-50 text-blue-600 border-blue-100" : 
                        "bg-amber-50 text-amber-600 border-amber-100"
                      }`}>
                        {selectedComplaint.status}
                      </span>
                      <span className="px-3 py-1 rounded-lg border border-slate-200 bg-white text-[8px] font-black uppercase tracking-widest text-slate-500">
                         {selectedComplaint.complaint_type}
                      </span>
                   </div>
                </div>
                <button 
                  onClick={() => setSelectedComplaint(null)}
                  className="w-10 h-10 bg-white text-slate-300 rounded-full flex items-center justify-center hover:text-black shadow-sm transition-all active:scale-95 shrink-0"
                >
                  <X size={18} />
                </button>
             </div>

             <div className="p-7 space-y-6">
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Statement of Facts</p>
                   <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-slate-600 text-sm leading-relaxed font-semibold italic">
                      "{selectedComplaint.description}"
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Reference Sequence</p>
                      <p className="text-xs font-black text-slate-900">
                        #{selectedComplaint.complaint_id ? selectedComplaint.complaint_id.slice(-8).toUpperCase() : selectedComplaint._id.slice(-8).toUpperCase()}
                      </p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Filing Date</p>
                      <p className="text-xs font-black text-slate-900">{new Date(selectedComplaint.createdAt).toLocaleDateString()}</p>
                   </div>
                </div>

                {selectedComplaint.image && (
                  <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Supporting Evidence</p>
                     <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden border border-slate-100 shadow-inner group cursor-pointer relative">
                        <img src={selectedComplaint.image} alt="Evidence" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                           <p className="text-[10px] text-white font-black uppercase tracking-widest">Attached Asset View</p>
                        </div>
                     </div>
                  </div>
                )}
             </div>

             <div className="px-7 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setSelectedComplaint(null)}
                  className="px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-zinc-800 transition-all shadow-xl shadow-black/20 active:scale-95"
                >
                  Dismiss Entry
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
