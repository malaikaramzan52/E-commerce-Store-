import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Save, ArrowLeft, X, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminToken, logout } = useAuth();
  const [product, setProduct] = useState({
    productName: "",
    price: "",
    discountPrice: "",
    description: "",
    categoryId: "",
    status: "active",
    images: [],
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!adminToken) return;
      try {
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/api/products/${id}`, { headers: { Authorization: `Bearer ${adminToken}` } }),
          fetch(`${API_BASE}/api/categories`, { headers: { Authorization: `Bearer ${adminToken}` } }),
        ]);

        const productData = await productRes.json();
        const categoryData = await categoriesRes.json();

        if (productRes.status === 401 || productRes.status === 403) {
            logout("admin");
            navigate("/login");
            return;
        }

        if (!productRes.ok) throw new Error(productData?.message || "Failed to load product");
        if (categoriesRes.ok) setCategories(categoryData.categories || []);

        setProduct({
          productName: productData.product.productName,
          price: productData.product.price,
          discountPrice: productData.product.discountPrice,
          description: productData.product.description,
          categoryId: productData.product.categoryId?._id || productData.product.categoryId,
          status: productData.product.status,
          images: productData.product.images || [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, adminToken, logout, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    Promise.all(
      files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      })
    ).then((base64Strings) => {
      setProduct((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...base64Strings],
      }));
    });
  };

  const removeImage = (indexToRemove) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!adminToken) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          productName: product.productName,
          price: Number(product.price),
          discountPrice: Number(product.discountPrice || 0),
          description: product.description,
          categoryId: product.categoryId,
          status: product.status,
          images: product.images,
        }),
      });
      const data = await res.json();
      
      if (res.status === 401 || res.status === 403) {
          logout("admin");
          navigate("/login");
          return;
      }

      if (!res.ok) throw new Error(data?.message || "Failed to update");
      navigate("/dashboard/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <Loader2 size={32} className="animate-spin text-slate-300 mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Loading Artifact</p>
        </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Edit product</p>
          <h1 className="text-2xl font-bold text-slate-900">{product.productName}</h1>
        </div>
      </div>

      {error && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</div>}

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">Name</label>
            <input
              type="text"
              name="productName"
              value={product.productName}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-black focus:ring-4 focus:ring-slate-100 transition outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">Category</label>
            <select
              name="categoryId"
              value={product.categoryId}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-black focus:ring-4 focus:ring-slate-100 transition outline-none"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">Price</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-black focus:ring-4 focus:ring-slate-100 transition outline-none"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">Discount</label>
            <input
              type="number"
              name="discountPrice"
              value={product.discountPrice}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-black focus:ring-4 focus:ring-slate-100 transition outline-none"
              step="0.01"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">Status</label>
            <select
              name="status"
              value={product.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-black focus:ring-4 focus:ring-slate-100 transition outline-none"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-black focus:ring-4 focus:ring-slate-100 transition outline-none"
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-800">Gallery Images (Upload multiple for cinematic showcase)</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
             {product.images && product.images.map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] group rounded-xl overflow-hidden border border-slate-200">
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                </div>
             ))}
             <label className="relative aspect-[3/4] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl hover:border-black transition-all cursor-pointer bg-slate-50">
                 <Plus size={24} className="text-slate-400 mb-2" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add more</span>
                 <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
             </label>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-70"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Synchronize Changes
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-8 py-3.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all text-xs font-semibold uppercase tracking-widest"
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  );
}
