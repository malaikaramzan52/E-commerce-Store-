import Product from "../models/Product.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      categoryId,
      price,
      discountPrice,
      sizes,
      colors,
      fabricType,
      description,
      stockQuantity,
      images,
      status,
    } = req.body;

    if (!productName || !categoryId || !price || !description || !images || images.length === 0) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const product = await Product.create({
      productName,
      categoryId,
      price,
      discountPrice: discountPrice || 0,
      sizes: sizes || ["M"],
      colors: colors || [],
      fabricType,
      description,
      stockQuantity: stockQuantity || 0,
      images,
      status: status || "active",
      createdBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product failed:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while creating product",
    });
  }
};

// GET ALL PRODUCTS with Filtering
export const getAllProducts = async (req, res) => {
  try {
    const { category, size, minPrice, maxPrice, status, discounted } = req.query;
    
    // Include docs where isDeleted is missing (legacy records) and exclude only explicit true.
    let query = { isDeleted: { $ne: true } };
    
    if (category) query.categoryId = category;
    if (size) query.sizes = { $in: [size] };
    if (status) query.status = status;
    if (discounted === "true") query.discountPrice = { $gt: 0 };
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .populate("categoryId", "categoryName")
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET PRODUCTS BY CATEGORY
export const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const products = await Product.find({ categoryId, isDeleted: { $ne: true } }).populate("categoryId", "categoryName");
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("categoryId", "categoryName");

    if (!product || product.isDeleted === true) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const product = await Product.findByIdAndUpdate(id, updates, { returnDocument: "after", runValidators: true });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product, message: "Product updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SOFT DELETE PRODUCT
export const softDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { isDeleted: true }, { returnDocument: "after" });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Moved to trash", product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PERMANENT DELETE PRODUCT
export const permanentDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product permanently deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
