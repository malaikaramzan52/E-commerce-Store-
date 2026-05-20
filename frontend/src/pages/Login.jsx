import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { User, Mail, Lock, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState(location.state?.portal || "user"); // 'user' | 'admin'
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res  = await fetch(`${API_BASE}/api/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      // Strict Role Verification
      if (data.user.role !== selectedRole) {
        setError(`Access Denied: This account is not authorized as ${selectedRole === 'admin' ? 'an Administrator' : 'a regular User'}.`);
        setLoading(false);
        return;
      }

      /* Store token + user data via context */
      login(data.user.token, data.user);
      
      // Navigate based on role
      if (data.user.role === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }

    } catch (err) {
      console.error("Login Error:", err);
      setError("Connection failed. Please check server status.");
      setLoading(false);
    }
  };

  const isAdmin = selectedRole === "admin";

  return (
    <div className={`auth-page ${isAdmin ? 'auth-page--admin' : ''}`}>
      <div className="auth-blob auth-blob--top"    />
      <div className="auth-blob auth-blob--bottom" />

      <div className="auth-card-wrapper">
        {/* Brand */}
        <div className="auth-brand">
          <span className="auth-brand__label">ELEGANCE</span>
          <h1 className="auth-brand__name">Couture</h1>
          <span className={`auth-portal-badge ${isAdmin ? 'auth-portal-badge--admin' : 'auth-portal-badge--user'}`}>
            {isAdmin ? <ShieldCheck size={11} /> : <User size={11} />} 
            {isAdmin ? 'Admin Portal' : 'User Portal'}
          </span>
        </div>

        {/* Role Selector Toggle */}
        <div className="auth-role-toggle">
          <button 
            type="button"
            onClick={() => setSelectedRole('user')}
            className={`auth-role-btn ${!isAdmin ? 'auth-role-btn--active' : ''}`}
          >
            User Access
          </button>
          <button 
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`auth-role-btn ${isAdmin ? 'auth-role-btn--active-admin' : ''}`}
          >
            Admin Access
          </button>
        </div>

        {/* Tab switcher (Login/Signup) */}
        <div className="auth-tabs">
          <span className="auth-tab auth-tab--active">Login</span>
          <Link to="/signup" className="auth-tab">Sign Up</Link>
        </div>

        <div className="auth-card">
          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">{isAdmin ? 'Admin Email' : 'Email Address'}</label>
              <div className="auth-input-wrap">
                <Mail size={15} className="auth-input-icon" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={isAdmin ? "admin@elegance.com" : "you@example.com"}
                  className="auth-input"
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <Lock size={15} className="auth-input-icon" />
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="auth-input"
                />
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className={`auth-btn ${isAdmin ? 'auth-btn--admin' : ''}`}
            >
              {loading ? (
                <Loader2 size={18} className="auth-btn__spinner" />
              ) : (
                isAdmin ? "Access Admin Dashboard" : "Login to Your Account"
              )}
            </button>
          </form>

          <footer className="auth-footer">
            <p className="auth-footer__text">
              Don't have an account?{" "}
              <Link to="/signup" className="auth-footer__link">Create one</Link>
            </p>
            <div className="auth-divider" />
            <p className="auth-footer__text auth-footer__text--muted">
              {isAdmin 
                ? "Restricted access for administrative personnel only." 
                : "Join the Elegance Couture elite membership today."}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}