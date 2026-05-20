import { useState, useEffect } from "react";
import { Mail, Phone, User, Calendar, MessageSquare, Trash2, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Queries() {
  const { adminToken, logout } = useAuth();
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueries = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/contact/all`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setQueries(data.queries);
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

  useEffect(() => { fetchQueries(); }, [adminToken]);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API_BASE}/api/contact/${id}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}` 
        },
        body: JSON.stringify({ status })
      });
      fetchQueries();
    } catch (err) { console.error(err); }
  };

  const deleteQuery = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await fetch(`${API_BASE}/api/contact/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      fetchQueries();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Customer Relations</p>
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Message Inquiries</h1>
      </header>

      {loading ? (
        <div className="py-20 text-center animate-pulse uppercase tracking-[0.3em] text-[10px] text-slate-400">Syncing database...</div>
      ) : queries.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[32px] p-20 text-center shadow-sm">
           <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No customer queries found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {queries.map((q) => (
            <div key={q._id} className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all duration-500 group">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center font-bold uppercase">
                      {q.name[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{q.name}</h3>
                      <p className="text-[11px] text-slate-400 font-medium">{q.subject || "No Subject"}</p>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ml-auto md:ml-0 ${
                      q.status === 'New' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      q.status === 'Read' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      q.status === 'Replied' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                      'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {q.status}
                    </span>
                  </div>

                  <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-50 italic text-slate-600 leading-relaxed text-sm">
                    "{q.message}"
                  </div>

                  <div className="flex flex-wrap gap-6 text-[11px] text-slate-500 font-medium pb-2">
                    <span className="flex items-center gap-2"><Mail size={14} /> {q.email}</span>
                    {q.phone && <span className="flex items-center gap-2"><Phone size={14} /> {q.phone}</span>}
                    <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(q.createdAt).toLocaleDateString()}</span>

                  </div>
                </div>

                <div className="flex md:flex-col gap-2 shrink-0">
                  {q.status !== 'Resolved' && (
                    <>
                        <button 
                        onClick={() => updateStatus(q._id, q.status === 'New' ? 'Read' : q.status === 'Read' ? 'Replied' : 'Resolved')}
                        className="p-3 bg-white border border-slate-100 hover:border-black rounded-xl transition-all text-slate-600 flex items-center justify-center gap-3 px-4 text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md"
                        >
                        <CheckCircle size={14} /> {q.status === 'New' ? 'Open Ticket' : q.status === 'Read' ? 'Mark Replied' : 'Mark Resolved'}
                        </button>
                        {q.status !== 'New' && (
                            <button 
                            onClick={() => updateStatus(q._id, 'Resolved')}
                            className="p-3 bg-black text-white hover:bg-zinc-800 rounded-xl transition-all flex items-center justify-center gap-3 px-4 text-[10px] font-black uppercase tracking-widest shadow-xl"
                            >
                            Complete Case
                            </button>
                        )}
                    </>
                  )}
                  <button 
                    onClick={() => deleteQuery(q._id)}
                    className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
