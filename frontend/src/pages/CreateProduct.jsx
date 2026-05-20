import { useEffect, useState } from "react";
import { ChevronDown, Image as ImageIcon, Loader2, ShieldCheck, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/useApp";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const formatPrice = (value) => {
  const num = parseFloat(value);
  return Number.isFinite(num) ? num.toFixed(2) : "0.00";
};

export default function CreateProduct() {
  const navigate = useNavigate();
  const { adminToken } = useAuth();
  const { fetchData, categories: globalCategories } = useApp();
  const [product, setProduct] = useState({
    productName: "",
    price: "",
    discountPrice: "",
    description: "",
    categoryId: "",
    status: "active",
    images: [],
  });

  const [localCategories, setLocalCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories`);
        const data = await res.json();
        if (res.ok) {
          setLocalCategories(data.categories || []);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    if (!globalCategories || globalCategories.length === 0) {
       loadCategories();
    }
  }, [globalCategories]);

  const displayCategories = globalCategories && globalCategories.length > 0 ? globalCategories : localCategories;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    setError("");
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!product.productName || !product.price || !product.description || !product.categoryId || !product.images || product.images.length === 0) {
      setError("Please fill all required fields and upload at least one image");
      return;
    }

    if (
      product.discountPrice &&
      parseFloat(product.discountPrice) > parseFloat(product.price)
    ) {
      setError("Discount price cannot be greater than product price");
      return;
    }

    if (!adminToken) {
      setError("You must be logged in as an administrator to create a product");
      return;
    }

    const payload = {
      productName: product.productName,
      price: parseFloat(product.price),
      discountPrice: product.discountPrice ? parseFloat(product.discountPrice) : 0,
      description: product.description,
      categoryId: product.categoryId,
      status: product.status,
      images: product.images,
    };

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to create product");
      }

      setProduct({
        productName: "",
        price: "",
        discountPrice: "",
        description: "",
        categoryId: "",
        status: "active",
        images: [],
      });
      setSuccess("Product created successfully");

      if (fetchData) await fetchData();

      setTimeout(() => navigate("/dashboard/products"), 600);
    } catch (err) {
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setProduct({
      productName: "",
      price: "",
      discountPrice: "",
      description: "",
      categoryId: "",
      status: "active",
      images: [],
    });
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-100/70 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Inventory Generation</p>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Create product</h1>
            <p className="text-slate-600 mt-4 leading-relaxed max-w-lg font-normal">Upload imagery, set pricing, and publish to the global catalog with a single click.</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600 bg-white rounded-full px-4 py-2 shadow">
            <ShieldCheck size={18} className="text-emerald-600" />
            Auto-save ready
          </div>
        </header>

        <div className="max-w-4xl mx-auto items-start">
          <div className="w-full">
            <form
              onSubmit={handleAddProduct}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6"
            >
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-semibold">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-semibold">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800">Product name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    name="productName"
                    value={product.productName}
                    onChange={handleChange}
                    placeholder="e.g. Lawn Embroidered Suit"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-inner focus:border-black focus:ring-4 focus:ring-slate-100 transition outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">Price <span className="text-rose-500">*</span></label>
                    <input
                      type="number"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      placeholder="129.00"
                      step="0.01"
                      min="0"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-inner focus:border-black focus:ring-4 focus:ring-slate-100 transition outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">Discount (optional)</label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={product.discountPrice}
                      onChange={handleChange}
                      placeholder="99.00"
                      step="0.01"
                      min="0"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-inner focus:border-black focus:ring-4 focus:ring-slate-100 transition outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800">Category <span className="text-rose-500">*</span></label>
                  <select
                    name="categoryId"
                    value={product.categoryId}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-black focus:ring-4 focus:ring-slate-100 transition outline-none"
                    required
                  >
                    <option value="">Select category</option>
                    {displayCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.categoryName || "Unnamed Category"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800">Status</label>
                  <select
                    name="status"
                    value={product.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-black focus:ring-4 focus:ring-slate-100 transition outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">Description <span className="text-rose-500">*</span></label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-inner focus:border-black focus:ring-4 focus:ring-slate-100 transition outline-none"
                  placeholder="Short marketing copy for the product"
                  required
                />
              </div>

              {/* Image Upload Gallery */}
              <div className="space-y-4 pt-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Product Images Gallery <span className="text-rose-500">*</span></p>
                  <p className="text-xs text-slate-500">Upload multiple images by selecting several files at once, or add them one by one. The first image will be the primary main photo.</p>
                </div>

                {/* Grid UI once images are uploaded */}
                {product.images && product.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-in fade-in zoom-in duration-300">
                    {product.images.map((img, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm relative group aspect-[3/4]">
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover bg-slate-50"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-bold text-white uppercase tracking-widest"
                        >
                          Remove
                        </button>
                        {idx === 0 && (
                          <div className="absolute top-3 left-3 bg-white text-black text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                            Main Cover
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add More Button inside grid */}
                    <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/70 hover:border-black hover:bg-slate-100 transition cursor-pointer aspect-[3/4] group">
                      <input
                        type="file"
                        name="images"
                        onChange={handleImageChange}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                      <div className="text-slate-600 text-sm flex flex-col items-center gap-3 group-hover:scale-110 transition-transform">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-200">
                          <Upload size={18} className="text-black group-hover:-translate-y-1 transition-transform" />
                        </div>
                        <span className="font-medium text-[10px] uppercase tracking-widest text-slate-800">Add More</span>
                      </div>
                    </label>
                  </div>
                )}

                {/* Empty State Upload Box */}
                {(!product.images || product.images.length === 0) && (
                  <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/70 hover:border-black hover:bg-slate-50 transition cursor-pointer px-4 py-16 text-center group">
                    <input
                      type="file"
                      name="images"
                      onChange={handleImageChange}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <div className="text-slate-600 text-sm">
                      <strong className="text-slate-800 inline-flex items-center gap-2 text-base group-hover:-translate-y-1 transition-transform">
                        <div className="w-10 h-10 bg-white shadow-sm border border-slate-200 rounded-full flex items-center justify-center mr-2">
                           <Upload size={18} className="text-black" />
                        </div>
                        Click to upload multiple images
                      </strong>
                    </div>
                    <p className="text-xs text-slate-500 mt-4 leading-relaxed max-w-sm mx-auto">
                      Hold down Ctrl (Windows) or Cmd (Mac) while picking files to select multiple pictures for your gallery view.
                    </p>
                  </label>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] inline-flex items-center justify-center rounded-full bg-black text-white text-[11px] font-semibold uppercase tracking-[0.2em] px-8 py-5 shadow-2xl hover:bg-neutral-800 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Publish to Catalog"}
                </button>
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="flex-1 rounded-full border-2 border-black text-black text-[11px] font-semibold uppercase tracking-[0.2em] px-8 py-5 hover:bg-black hover:text-white transition-all active:scale-95 shadow-sm"
                >
                  Clear Details
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
);
}