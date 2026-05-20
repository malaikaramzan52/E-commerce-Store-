import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Loader2, Tags } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Categories() {
  const navigate = useNavigate();
  const { adminToken, logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ categoryName: "", status: "active", image: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCategories = async () => {
    if (!adminToken) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/categories`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      
      if (res.status === 401) {
        logout("admin");
        navigate("/login");
        return;
      }
      
      if (!res.ok) throw new Error(data?.message || "Failed to load categories");
      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [adminToken]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    setLoading(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_BASE}/api/categories/${editingId}`
        : `${API_BASE}/api/categories`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
           categoryName: form.categoryName,
           status: form.status,
           image: form.image
        }),
      });

      const data = await res.json();
      
      if (res.status === 401) {
        logout("admin");
        navigate("/login");
        return;
      }
      
      if (!res.ok) throw new Error(data?.message || "Failed to save category");

      setForm({ categoryName: "", status: "active", image: "" });
      setEditingId(null);
      setSuccess(editingId ? "Category updated" : "Category created");
      fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ categoryName: cat.categoryName, status: cat.status, image: cat.image || "" });
    setSuccess("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this category?");
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_BASE}/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      
      if (res.status === 401) {
        logout("admin");
        navigate("/login");
        return;
      }
      
      if (!res.ok) throw new Error(data?.message || "Failed to delete");
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Architectural Layout</p>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
             Categories
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
             <label className="text-sm font-semibold text-slate-800">Category Image</label>
             <div className="relative group w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all hover:border-black cursor-pointer">
                {form.image ? (
                  <>
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                       <p className="text-[10px] text-white font-bold uppercase tracking-widest">Change Image</p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <Plus size={20} className="text-slate-400 mb-2" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Upload</p>
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
             </div>
             {form.image && (
               <button 
                  type="button" 
                  onClick={() => setForm({...form, image: ""})}
                  className="text-[10px] font-bold text-rose-500 uppercase tracking-widest hover:text-rose-700 w-full text-center"
               >
                 Remove Image
               </button>
             )}
          </div>

          <div className="md:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">Category Name</label>
                <input
                  type="text"
                  value={form.categoryName}
                  onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-black focus:ring-2 focus:ring-slate-100 outline-none transition-all text-sm font-medium"
                  placeholder="e.g. Lawn, Cotton, Chiffon"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-black focus:ring-2 focus:ring-slate-100 outline-none transition-all text-sm font-medium"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</div>}
        {success && <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">{success}</div>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-70"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {editingId ? "Update Category" : "Create Category"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                 setEditingId(null);
                 setForm({ categoryName: "", status: "active", image: "" });
               }}
              className="text-slate-600 hover:text-slate-800"
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className="bg-white border border-slate-200 rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-10 py-7 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Current Assortment</h2>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{categories.length} Total</span>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-7 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 w-32">Visual</th>
                <th className="px-10 py-7 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Nomenclature</th>
                <th className="px-10 py-7 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Visibility</th>
                <th className="px-10 py-7 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="w-16 h-16 rounded-[22px] overflow-hidden border border-slate-200 bg-slate-50 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-500">
                      <img src={cat.image || "https://placehold.co/100x100?text=No+Img"} alt={cat.categoryName} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-10 py-6 font-bold text-base text-slate-900 tracking-tight">{cat.categoryName}</td>
                  <td className="px-10 py-6">
                    <span
                      className={`px-5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-sm flex items-center w-fit gap-2 ${
                        cat.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}
                    >
                      {cat.status === "active" ? (
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      ) : (
                         <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      )}
                      {cat.status === "active" ? "Active" : "Draft"}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="px-5 py-2.5 bg-white text-slate-900 border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm active:scale-95"
                      >
                         Modify
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-2.5 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                   <td colSpan={4} className="px-10 py-32 text-center text-slate-500">
                     <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
                        <Tags size={48} />
                     </div>
                     <p className="text-xl font-bold text-slate-900 uppercase tracking-tight leading-none mb-3">No categories defined</p>
                     <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">Initialize your architecture above</p>
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
