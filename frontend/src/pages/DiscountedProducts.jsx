import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BadgePercent, Search, TrendingDown, ArrowDownUp, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const SORT_OPTIONS = [
  { value: "default",       label: "Default" },
  { value: "discount_desc", label: "Highest discount" },
  { value: "discount_asc",  label: "Lowest discount" },
  { value: "name_asc",      label: "Name A → Z" },
  { value: "name_desc",     label: "Name Z → A" },
  { value: "price_desc",    label: "Price: high → low" },
  { value: "price_asc",     label: "Price: low → high" },
];

export default function DiscountedProducts() {
  const navigate = useNavigate();
  const { adminToken, logout } = useAuth();
  const [products, setProducts]         = useState([]);
  const [searchTerm, setSearchTerm]     = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy]             = useState("discount_desc");
  const [categories, setCategories]     = useState([]);

  /* ── fetch ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (!adminToken) return;
    (async () => {
      try {
        const res  = await fetch(`${API_BASE}/api/products?discounted=true`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        const data = await res.json();
        if (res.ok) {
          const list = data.products || [];
          setProducts(list);
          setCategories(
            Array.from(new Set(list.map((p) => p.categoryId?.categoryName || p.category).filter(Boolean)))
          );
        } else if (res.status === 401 || res.status === 403) {
          logout("admin");
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching discounted products:", err);
      }
    })();
  }, [adminToken]);

  /* ── helpers ────────────────────────────────────────────────── */
  const getDiscountPercent = (p) => {
    const base = Number(p.price ?? 0);
    if (!base) return 0;
    return Math.round(((base - Number(p.discountPrice ?? 0)) / base) * 100);
  };

  /* ── derived list (filter → search → sort) ─────────────────── */
  const filtered = useMemo(() => {
    let list = [...products];

    // category filter
    if (categoryFilter !== "all") {
      list = list.filter((p) => (p.categoryId?.categoryName || p.category) === categoryFilter);
    }

    // name search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((p) => p.productName?.toLowerCase().includes(q));
    }

    // sort
    switch (sortBy) {
      case "discount_desc":
        list.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a));
        break;
      case "discount_asc":
        list.sort((a, b) => getDiscountPercent(a) - getDiscountPercent(b));
        break;
      case "name_asc":
        list.sort((a, b) => (a.productName || "").localeCompare(b.productName || ""));
        break;
      case "name_desc":
        list.sort((a, b) => (b.productName || "").localeCompare(a.productName || ""));
        break;
      case "price_desc":
        list.sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0));
        break;
      case "price_asc":
        list.sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0));
        break;
      default:
        break;
    }

    return list;
  }, [products, searchTerm, categoryFilter, sortBy]);

  /* ── active-filter pills ────────────────────────────────────── */
  const activeFilters = [];
  if (searchTerm.trim())
    activeFilters.push({
      id: "search",
      label: `"${searchTerm}"`,
      clear: () => setSearchTerm(""),
    });
  if (categoryFilter !== "all")
    activeFilters.push({
      id: "cat",
      label: categoryFilter,
      clear: () => setCategoryFilter("all"),
    });
  if (sortBy !== "default")
    activeFilters.push({
      id: "sort",
      label: SORT_OPTIONS.find((o) => o.value === sortBy)?.label,
      clear: () => setSortBy("default"),
    });

  /* ── render ─────────────────────────────────────────────────── */
  return (
    <div className="space-y-6">

      {/* ── Header row ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="shrink-0">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Promotional Sales</p>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none whitespace-nowrap">
            Discounted Products
          </h1>
        </div>

        {/* ── Controls ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto sm:min-w-[560px]">

          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name…"
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category */}
          <div className="relative sm:w-44">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none w-full pl-3 pr-8 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            >
              <option value="all">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▾
            </span>
          </div>

          {/* Sort */}
          <div className="relative sm:w-52">
            <ArrowDownUp
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full pl-8 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:border-black focus:ring-4 focus:ring-slate-100 outline-none transition-all"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▾
            </span>
          </div>
        </div>
      </div>

      {/* ── Active filter pills ─────────────────────────────────── */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500">Active filters:</span>
          {activeFilters.map((f) => (
            <span
              key={f.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium"
            >
              {f.label}
              <button
                onClick={f.clear}
                className="ml-0.5 hover:text-indigo-900"
              >
                <X size={11} />
              </button>
            </span>
          ))}
          <button
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
              setSortBy("default");
            }}
            className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── Table card ─────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-800">On sale</span>
          <span className="text-xs text-slate-500">
            {filtered.length}{" "}
            {filtered.length === 1 ? "product" : "products"}
            {filtered.length !== products.length &&
              ` of ${products.length}`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Image</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Name</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Category</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Original price</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Discount price</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Savings</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const pct = getDiscountPercent(p);
                const categoryName = p.categoryId?.categoryName || p.category;
                const img = p.images?.[0] || p.image;
                return (
                  <tr
                    key={p._id}
                    className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Image */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/dashboard/products/view/${p._id}`)}
                        className="h-12 w-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 hover:ring-2 hover:ring-indigo-200 transition"
                        title="View details"
                      >
                        {img ? (
                          <img
                            src={img}
                            alt={p.productName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full grid place-items-center text-slate-400 text-xs">
                            —
                          </div>
                        )}
                      </button>
                    </td>

                    {/* Name — highlight search match */}
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <button
                        onClick={() => navigate(`/dashboard/products/view/${p._id}`)}
                        className="text-left hover:text-indigo-700"
                        title="View details"
                      >
                        <HighlightMatch text={p.productName} query={searchTerm} />
                      </button>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      {categoryName ? (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                          {categoryName}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Original price */}
                    <td className="px-4 py-3 text-slate-500 line-through">
                      Rs. {Number(p.price ?? 0).toFixed(2)}
                    </td>

                    {/* Discount price */}
                    <td className="px-4 py-3">
                      {p.discountPrice > 0 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full text-xs font-semibold">
                          <BadgePercent size={13} />
                          Rs. {Number(p.discountPrice).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Savings badge */}
                    <td className="px-4 py-3">
                      <DiscountBadge pct={pct} />
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <TrendingDown size={28} className="text-slate-300" />
                      <p className="text-sm">
                        No discounted products match your filters.
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setCategoryFilter("all");
                          setSortBy("default");
                        }}
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
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */

/** Highlights the matched portion of a product name */
function HighlightMatch({ text = "", query = "" }) {
  if (!query.trim()) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-yellow-100 text-yellow-900 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

/** Colour-coded savings badge based on discount magnitude */
function DiscountBadge({ pct }) {
  if (!pct) return <span className="text-slate-400 text-xs">—</span>;

  let cls =
    pct >= 50
      ? "bg-rose-50 text-rose-700 border-rose-100"
      : pct >= 25
      ? "bg-orange-50 text-orange-700 border-orange-100"
      : "bg-amber-50 text-amber-700 border-amber-100";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-bold ${cls}`}
    >
      -{pct}%
    </span>
  );
}