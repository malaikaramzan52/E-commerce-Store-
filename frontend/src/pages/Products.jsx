import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgePercent,
  Edit2,
  MoreVertical,
  Plus,
  Search,
  SlidersHorizontal,
  Tags,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const DEFAULT_FILTERS = {
  search: "",
  category: "all",
  status: "all",
  priceMin: "",
  priceMax: "",
};

export default function Products() {
  const navigate = useNavigate();
  const { adminToken, logout } = useAuth();
  const [products, setProducts]           = useState([]);
  const [categories, setCategories]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [filters, setFilters]             = useState(DEFAULT_FILTERS);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [quickEditProduct, setQuickEditProduct] = useState(null);
  const [quickForm, setQuickForm]         = useState({ price: "", discountPrice: "", category: "" });

  /* ── fetch ─────────────────────────────────────────────────── */
  const fetchData = async () => {
    if (!adminToken) return;
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`${API_BASE}/api/products`,   { headers: { Authorization: `Bearer ${adminToken}` } }),
        fetch(`${API_BASE}/api/categories`, { headers: { Authorization: `Bearer ${adminToken}` } }),
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      
      if (pRes.ok) {
        setProducts(pData.products || []);
      } else if (pRes.status === 401 || pRes.status === 403) {
        logout("admin");
        navigate("/login");
        return;
      }

      if (cRes.ok) setCategories(cData.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [adminToken]);

  /* ── derived filtered list ──────────────────────────────────── */
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const price = Number(p.price ?? 0);
      const categoryName = p.categoryId?.categoryName || p.category;

      if (filters.search.trim()) {
        if (!p.productName?.toLowerCase().includes(filters.search.toLowerCase())) return false;
      }
      if (filters.category !== "all" && categoryName !== filters.category) return false;
      if (filters.status   !== "all" && p.status   !== filters.status)   return false;
      if (filters.priceMin !== "" && price < Number(filters.priceMin))    return false;
      if (filters.priceMax !== "" && price > Number(filters.priceMax))    return false;

      return true;
    });
  }, [products, filters]);

  /* ── active filter count (excluding default values) ─────────── */
  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.search.trim())    n++;
    if (filters.category !== "all") n++;
    if (filters.status   !== "all") n++;
    if (filters.priceMin !== "")    n++;
    if (filters.priceMax !== "")    n++;
    return n;
  }, [filters]);

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const clearAll  = () => setFilters(DEFAULT_FILTERS);

  /* ── quick edit ─────────────────────────────────────────────── */
  const openQuickEdit = (product) => {
    setQuickEditProduct(product);
    setQuickForm({ 
      price: product.price, 
      discountPrice: product.discountPrice, 
      categoryId: product.categoryId?._id || product.categoryId 
    });
  };

  const handleQuickSave = async () => {
    if (!quickEditProduct || !adminToken) return;
    await fetch(`${API_BASE}/api/products/${quickEditProduct._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        price:         Number(quickForm.price),
        discountPrice: Number(quickForm.discountPrice || 0),
        categoryId:    quickForm.categoryId,
      }),
    });
    setQuickEditProduct(null);
    fetchData();
  };

  /* ── delete handlers ────────────────────────────────────────── */
  const handleSoftDelete = async (id) => {
    if (!adminToken) return;
    await fetch(`${API_BASE}/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    fetchData();
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm("Permanently delete this product?") || !adminToken) return;
    await fetch(`${API_BASE}/api/products/permanent/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    fetchData();
  };

  /* ── render ─────────────────────────────────────────────────── */
  return (
    <div className="space-y-6">

      {/* ── Page header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Catalog Inventory</p>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">All products</h1>
          <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-2">
            Showing {filtered.length}{filtered.length !== products.length ? ` of ${products.length}` : ""} active items
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/products/create")}
          className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl transition-all active:scale-95"
        >
          <Plus size={16} /> New Product
        </button>
      </div>

      {/* ── Search + filter bar ─────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">

          {/* Name search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              placeholder="Search by product name…"
              className="w-full pl-9 pr-9 py-2.5 text-sm rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
            {filters.search && (
              <button
                onClick={() => setFilter("search", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Toggle filter panel */}
          <button
            onClick={() => setShowFilterPanel((v) => !v)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all ${
              showFilterPanel || activeCount > 0
                ? "bg-black border-black text-white"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeCount > 0 && (
              <span className="bg-white text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {activeCount}
              </span>
            )}
            {showFilterPanel ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* ── Expanded filter panel ─────────────────────────────── */}
        {showFilterPanel && (
          <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Category
              </label>
              <div className="relative">
                <select
                  value={filters.category}
                  onChange={(e) => setFilter("category", e.target.value)}
                  className="appearance-none w-full pl-3 pr-8 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                >
                  <option value="all">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.categoryName}>{cat.categoryName}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▾</span>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Status
              </label>
              <div className="flex gap-2">
                {["all", "active", "draft"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter("status", s)}
                    className={`flex-1 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-colors ${
                      filters.status === s
                        ? s === "active"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : s === "draft"
                          ? "bg-amber-50 border-amber-200 text-amber-700"
                          : "bg-black border-black text-white"
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Price min */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Min price (Rs.)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">Rs.</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={filters.priceMin}
                  onChange={(e) => setFilter("priceMin", e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>
            </div>

            {/* Price max */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Max price (Rs.)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">Rs.</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="∞"
                  value={filters.priceMax}
                  onChange={(e) => setFilter("priceMax", e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Active filter pills ───────────────────────────────── */}
        {activeCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400">Active:</span>

            {filters.search.trim() && (
              <Pill label={`Name: "${filters.search}"`} onRemove={() => setFilter("search", "")} />
            )}
            {filters.category !== "all" && (
              <Pill label={`Category: ${filters.category}`} onRemove={() => setFilter("category", "all")} />
            )}
            {filters.status !== "all" && (
              <Pill label={`Status: ${filters.status}`} onRemove={() => setFilter("status", "all")} color="status" status={filters.status} />
            )}
            {filters.priceMin !== "" && (
              <Pill label={`Min: Rs. ${filters.priceMin}`} onRemove={() => setFilter("priceMin", "")} />
            )}
            {filters.priceMax !== "" && (
              <Pill label={`Max: Rs. ${filters.priceMax}`} onRemove={() => setFilter("priceMax", "")} />
            )}

            <button
              onClick={clearAll}
              className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Table card ─────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-800">Product list</span>
          <span className="text-xs text-slate-500">
            {filtered.length}{filtered.length !== products.length ? ` of ${products.length}` : ""} products
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Image</th>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold">Price</th>
                <th className="px-4 py-3 text-left font-semibold">Discount Price</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product._id} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">

                  {/* Image */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="h-12 w-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 hover:ring-2 hover:ring-indigo-200 transition"
                      title="View details in shop"
                    >
                      {product.images?.[0] || product.image ? (
                        <img src={product.images?.[0] || product.image} alt={product.productName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-slate-400 text-xs">—</div>
                      )}
                    </button>
                  </td>

                  {/* Name with search highlight */}
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="text-left hover:text-indigo-700"
                      title="View details in shop"
                    >
                      <HighlightMatch text={product.productName} query={filters.search} />
                    </button>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    {product.categoryId?.categoryName ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                        <Tags size={12} className="text-slate-400" />
                        {product.categoryId.categoryName}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 text-slate-800 font-medium">
                    Rs. {Number((product.price ?? product.productPrice) ?? 0).toLocaleString()}
                  </td>

                  {/* Discount price */}
                  <td className="px-4 py-3">
                    {product.discountPrice > 0 ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full text-xs font-semibold">
                        <BadgePercent size={13} /> Rs. {Number(product.discountPrice).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">No discount</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      product.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {product.status === "active" ? "Active" : "Draft"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/product/${product._id}`)}
                        className="p-2.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-200 hover:bg-black hover:text-white hover:border-black transition-all"
                        title="View in Shop"
                      >
                        <Eye size={14} />
                        <span className="sr-only">View in Shop</span>
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/products/edit/${product._id}`)}
                        className="p-2.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-200 hover:bg-black hover:text-white hover:border-black transition-all"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                        <span className="sr-only">Edit</span>
                      </button>
                      <button
                        onClick={() => openQuickEdit(product)}
                        className="p-2 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 inline-flex items-center"
                        title="Quick edit"
                      >
                        <MoreVertical size={14} />
                        <span className="sr-only">Quick edit</span>
                      </button>
                      <button
                        onClick={() => handleSoftDelete(product._id)}
                        className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100 inline-flex items-center"
                        title="Move to trash"
                      >
                        <Trash2 size={14} />
                        <span className="sr-only">Move to trash</span>
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(product._id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 inline-flex items-center"
                        title="Delete permanently"
                      >
                        <Trash2 size={14} />
                        <span className="sr-only">Delete permanently</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Search size={28} className="text-slate-300" />
                      <p className="text-sm">No products match your filters.</p>
                      <button
                        onClick={clearAll}
                        className="text-xs text-indigo-500 hover:underline mt-1"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Quick-edit modal ────────────────────────────────────── */}
      {quickEditProduct && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Quick edit</p>
                <h3 className="text-lg font-semibold text-slate-900">{quickEditProduct.productName}</h3>
              </div>
              <button onClick={() => setQuickEditProduct(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800">Price</label>
                <input
                  type="number"
                  value={quickForm.price}
                  onChange={(e) => setQuickForm({ ...quickForm, price: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  step="0.01" min="0"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800">Discount price</label>
                <input
                  type="number"
                  value={quickForm.discountPrice}
                  onChange={(e) => setQuickForm({ ...quickForm, discountPrice: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  step="0.01" min="0"
                />
              </div>
              <div className="space-y-1">
                <select
                  value={quickForm.categoryId}
                  onChange={(e) => setQuickForm({ ...quickForm, categoryId: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setQuickEditProduct(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickSave}
                className="px-6 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */

function Pill({ label, onRemove, color, status }) {
  const base =
    color === "status" && status === "active"
      ? "bg-emerald-50 border-emerald-100 text-emerald-700"
      : color === "status" && status === "draft"
      ? "bg-amber-50 border-amber-100 text-amber-700"
      : "bg-black border-black text-white";

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium ${base}`}>
      {label}
      <button onClick={onRemove} className="ml-0.5 hover:opacity-70">
        <X size={11} />
      </button>
    </span>
  );
}

function HighlightMatch({ text = "", query = "" }) {
  if (!query.trim()) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-yellow-100 text-yellow-900 rounded px-0.5 not-italic">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </span>
  );
}