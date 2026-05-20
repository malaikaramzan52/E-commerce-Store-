import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { categoryName, description, image, status } = req.body;
    if (!categoryName) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const existing = await Category.findOne({ categoryName: categoryName.trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Category already exists" });
    }

    const category = await Category.create({ 
        categoryName: categoryName.trim(), 
        description, 
        image, 
        status: status || "active" 
    });
    res.status(201).json({ success: true, category, message: "Category created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (_req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, description, image, status } = req.body;
    const category = await Category.findByIdAndUpdate(
      id,
      { categoryName, description, image, status },
      { returnDocument: "after", runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, category, message: "Category updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
