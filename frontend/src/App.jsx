import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CartDrawer from "./components/CartDrawer.jsx";
import WishlistDrawer from "./components/WishlistDrawer.jsx";
import ProductView from "./pages/ProductView.jsx";
import Checkout from "./pages/Checkout.jsx";
import Shop from "./pages/Shop.jsx";
import NewArrivals from "./pages/NewArrivals.jsx";
import Sale from "./pages/Sale.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <CartDrawer />
      <WishlistDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Unified Auth Routes */}
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/admin/login" element={<AuthPage />} />
        <Route path="/admin/signup" element={<AuthPage />} />
        
        {/* Admin and User Dashboards protected by role */}
        <Route path="/dashboard/*" element={<ProtectedRoute requiredRole="admin"><Dashboard /></ProtectedRoute>} />
        <Route path="/user/dashboard/*" element={<ProtectedRoute requiredRole="user"><UserDashboard /></ProtectedRoute>} />

        {/* Other Routes */}
        <Route path="/product/:id" element={<ProductView />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;