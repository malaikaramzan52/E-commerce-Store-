import Cart from "../models/cart.js";

// GET USER CART
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate("products.productId");
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, products: [] });
    }
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;
    if (!productId || !size) {
      return res.status(400).json({ success: false, message: "Product ID and size are required" });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        products: [{ productId, quantity: quantity || 1, size }],
      });
    } else {
      const existingIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId && p.size === size
      );

      if (existingIndex > -1) {
        cart.products[existingIndex].quantity += quantity || 1;
      } else {
        cart.products.push({ productId, quantity: quantity || 1, size });
      }
      await cart.save();
    }

    res.status(200).json({ success: true, cart, message: "Added to cart" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// REMOVE FROM CART
export const removeFromCart = async (req, res) => {
  try {
    const { productId, size } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      cart.products = cart.products.filter(
        (p) => !(p.productId.toString() === productId && p.size === size)
      );
      await cart.save();
    }

    res.status(200).json({ success: true, cart, message: "Removed from cart" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CLEAR CART
export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.products = [];
      await cart.save();
    }
    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
