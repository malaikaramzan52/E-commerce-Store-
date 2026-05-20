import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Loader2, User, Shield, ArrowRight, CheckCircle, Briefcase, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, admin } = useAuth();

  // Determine initial mode and role from URL
  const isSignupPath = location.pathname.includes("signup");
  const isAdminPath = location.pathname.includes("admin");
  const [isLogin, setIsLogin] = useState(!isSignupPath);
  const [targetRole, setTargetRole] = useState(isAdminPath ? "admin" : "user"); 
  
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    confirmPassword: ""
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync mode and role with URL changes
  useEffect(() => {
    setIsLogin(!location.pathname.includes("signup"));
    
    // If the path contains 'admin', force targetRole to admin
    // This handles direct navigation or redirects to /admin/login
    if (location.pathname.includes("admin")) {
      setTargetRole("admin");
    } else if (location.pathname === "/login" || location.pathname === "/signup") {
      // Only set to user if we are on the explicit user paths
      // This prevents losing 'admin' state if some other path is visited
      setTargetRole("user");
    }
  }, [location.pathname]);

  // If already logged in for the TARGET role, redirect to appropriate dashboard
  useEffect(() => {
    if (targetRole === "admin" && admin) {
      navigate("/dashboard", { replace: true });
    } else if (targetRole === "user" && user) {
      navigate("/user/dashboard", { replace: true });
    }
  }, [user, admin, targetRole, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Adjust endpoint based on role and mode
    // If it's a login, we use the unified login endpoint but the backend handles roles
    // If it's signup, we use the specific signup endpoint
    const endpoint = isLogin 
      ? "/api/auth/login" 
      : (targetRole === "admin" ? "/api/auth/admin/signup" : "/api/auth/signup");
    
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Authentication failed");
        setLoading(false);
        return;
      }

      if (isLogin) {
        // Strict role check for separate login
        if (targetRole === "admin" && data.user.role !== "admin") {
            setError("Access denied. These credentials are not registered in the Management database.");
            setLoading(false);
            return;
        }
        if (targetRole === "user" && data.user.role === "admin") {
            setError("Management accounts must use the Admin switch below.");
            setLoading(false);
            return;
        }

        login(data.user.token, data.user);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setIsLogin(true);
          setSuccess(false);
          setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Connection failed. Please check server status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-page ${targetRole === 'admin' ? 'auth-page--admin' : ''}`}>
      <div className="auth-blob auth-blob--top" />
      <div className="auth-blob auth-blob--bottom" />

      <div className="auth-card-wrapper">
        <div className="auth-brand">
          <span className="auth-brand__label">ELEGANCE</span>
          <h1 className="auth-brand__name">Couture</h1>
          <div className="auth-portal-badge auth-portal-badge--user">
            <Shield size={11} /> 
            Secure Unified Access
          </div>
        </div>

        {/* Role Toggle Tabs */}
        <div className="auth-role-tabs">
            <button 
                className={`auth-role-tab ${targetRole === 'user' ? 'auth-role-tab--active' : ''}`}
                onClick={() => setTargetRole("user")}
            >
                <Users size={14} />
                Client Portal
            </button>
            <button 
                className={`auth-role-tab ${targetRole === 'admin' ? 'auth-role-tab--active' : ''}`}
                onClick={() => setTargetRole("admin")}
            >
                <Briefcase size={14} />
                Management
            </button>
        </div>

        <div className="auth-tabs">
          <button 
            type="button"
            onClick={() => { setIsLogin(true); navigate("/login"); }}
            className={`auth-tab ${isLogin ? 'auth-tab--active' : ''}`}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => { setIsLogin(false); navigate("/signup"); }}
            className={`auth-tab ${!isLogin ? 'auth-tab--active' : ''}`}
          >
            Create Account
          </button>
        </div>

        <div className="auth-card">
          <div className="auth-card__header">
             <h2 className="auth-card__title">
                {isLogin ? "Welcome Back" : "Join the Elite"}
             </h2>
             <p className="auth-card__subtitle">
                {targetRole === 'admin' ? "Administrative Control System" : "Premium Client Services"}
             </p>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {success && (
            <div className="auth-success-alert">
               <CheckCircle size={32} className="text-emerald-400 mb-2" />
               <p className="font-black uppercase tracking-widest text-center">Registration Verified</p>
               <p className="text-[8px] opacity-60 uppercase mt-1">Routing to authentication...</p>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="auth-field">
                  <label className="auth-label">Full Nomenclature</label>
                  <div className="auth-input-wrap">
                    <User size={14} className="auth-input-icon" />
                    <input
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="auth-input"
                    />
                  </div>
                </div>
              )}

              <div className="auth-field">
                <label className="auth-label">Email</label>
                <div className="auth-input-wrap">
                  <Mail size={14} className="auth-input-icon" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="logistics@couture.com"
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <Lock size={14} className="auth-input-icon" />
                  <input
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

              {!isLogin && (
                <div className="auth-field">
                  <label className="auth-label">Re-Verify Key</label>
                  <div className="auth-input-wrap">
                    <CheckCircle size={14} className="auth-input-icon" />
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="auth-input"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`auth-btn ${targetRole === 'admin' ? 'auth-btn--admin' : ''}`}
              >
                {loading ? (
                  <Loader2 size={16} className="auth-btn__spinner" />
                ) : (
                  <>
                    <span>{isLogin ? "Authenticate" : "Register Proxy"}</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          <footer className="auth-footer">
            <p className="auth-footer__text">
              {isLogin ? "New to the collective?" : "Identity already verified?"}{" "}
              <button 
                type="button"
                onClick={() => {
                  const newModeIsLogin = !isLogin;
                  setIsLogin(newModeIsLogin);
                  navigate(newModeIsLogin ? "/login" : "/signup");
                }}
                className="auth-footer__link"
              >
                {isLogin ? "Join now" : "Sign In"}
              </button>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
