import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { User, Mail, Lock, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState(location.state?.portal || "user"); // 'user' | 'admin'
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
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

    const endpoint = selectedRole === 'admin' ? '/api/auth/admin/signup' : '/api/auth/signup';

    try {
      const res  = await fetch(`${API_BASE}${endpoint}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed. Please try again.");
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
      console.error("Signup Error:", err);
      setError("Connection error. Please try again.");
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
             {isAdmin ? 'Admin Registration' : 'New Client Registration'}
          </span>
        </div>

        {/* Role Selector Toggle */}
        <div className="auth-role-toggle">
          <button 
            type="button"
            onClick={() => setSelectedRole('user')}
            className={`auth-role-btn ${!isAdmin ? 'auth-role-btn--active' : ''}`}
          >
            Client Signup
          </button>
          <button 
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`auth-role-btn ${isAdmin ? 'auth-role-btn--active-admin' : ''}`}
          >
            Admin Signup
          </button>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <Link to="/login" className="auth-tab">Login</Link>
          <span className="auth-tab auth-tab--active">Sign Up</span>
        </div>

        <div className="auth-card">
          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Full Name */}
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <div className="auth-input-wrap">
                <User size={15} className="auth-input-icon" />
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="auth-input"
                />
              </div>
            </div>

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label">{isAdmin ? 'Admin Email' : 'Email Address'}</label>
              <div className="auth-input-wrap">
                <Mail size={15} className="auth-input-icon" />
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={isAdmin ? "hq@elegance.com" : "you@example.com"}
                  className="auth-input"
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <Lock size={15} className="auth-input-icon" />
                <input
                  id="signup-password"
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
              id="signup-submit"
              type="submit"
              disabled={loading}
              className={`auth-btn ${isAdmin ? 'auth-btn--admin' : ''}`}
            >
              {loading ? (
                <Loader2 size={18} className="auth-btn__spinner" />
              ) : (
                isAdmin ? "Register Admin Account" : "Create Your Account"
              )}
            </button>
          </form>

          <footer className="auth-footer">
            <p className="auth-footer__text">
              Already have an account?{" "}
              <Link to="/login" className="auth-footer__link">Login here</Link>
            </p>
            <div className="auth-divider" />
            <p className="auth-footer__text auth-footer__text--muted">
              {isAdmin 
                ? "Restricted to authorized organizational partners." 
                : "Enrollment is open to all new couture enthusiasts."}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}