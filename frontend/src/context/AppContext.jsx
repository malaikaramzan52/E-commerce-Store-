import React, { useState, useEffect } from 'react';
import { AppContext } from './AppContextCore';

const API_BASE_URL = "http://localhost:5000/api";

export const AppProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const parseStoredArray = (key) => {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) return [];
    try {
      const parsed = JSON.parse(rawValue);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn(`Invalid localStorage data for ${key}. Resetting it.`, error);
      localStorage.removeItem(key);
      return [];
    }
  };

  const [cartItems, setCartItems] = useState(() => parseStoredArray('cart'));
  const [wishlistItems, setWishlistItems] = useState(() => parseStoredArray('wishlist'));
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);


  // Fetch Products and Categories
  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products`),
        fetch(`${API_BASE_URL}/categories`)
      ]);
      
      const prodData = await prodRes.json();
      const catData = await catRes.json();

      if (prodData.success) setProducts(prodData.products);
      if (catData.success) setCategories(catData.categories);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [cartItems, wishlistItems]);

  const addToCart = (product, selectedSize = "M", openDrawer = true) => {
    setCartItems(prev => {
      const id = product._id || product.id;
      const cartItemId = `${id}-${selectedSize}`;
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, selectedSize, cartItemId, quantity: 1 }];
    });
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };
  
  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, quantity) => {
      if(quantity < 1) return;
      setCartItems(prev => prev.map(item => item.cartItemId === cartItemId ? {...item, quantity} : item))
  }

  const updateSize = (cartItemId, newSize) => {
      setCartItems(prev => prev.map(item => {
           if (item.cartItemId === cartItemId) {
               const id = item._id || item.id;
               const newCartItemId = `${id}-${newSize}`;
               return { ...item, selectedSize: newSize, cartItemId: newCartItemId };
           }
           return item;
      }));
  };

  const toggleWishlist = (product) => {
    setWishlistItems(prev => {
      const id = product._id || product.id;
      const existing = prev.find(item => (item._id || item.id) === id);
      if (existing) {
        return prev.filter(item => (item._id || item.id) !== id);
      }
      return [...prev, product];
    });
  };

  return (
    <AppContext.Provider value={{ 
        isCartOpen, setIsCartOpen, 
        isWishlistOpen, setIsWishlistOpen,
        cartItems, setCartItems, addToCart, removeFromCart, updateQuantity, updateSize,
        wishlistItems, toggleWishlist,
        products, categories, loading, fetchData
    }}>
      {children}
    </AppContext.Provider>
  );
};

