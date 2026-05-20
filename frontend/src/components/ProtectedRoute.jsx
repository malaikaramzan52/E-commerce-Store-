import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute with role-based isolation.
 * Logic:
 * 1. If requiredRole is "admin", check 'admin' state.
 * 2. If requiredRole is "user", check 'user' state.
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, admin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-black font-black uppercase tracking-[0.5em] text-[10px]">Verifying Clearance</p>
      </div>
    );
  }

  // Handle Admin Route
  if (requiredRole === "admin") {
    if (!admin) {
      console.log("[ProtectedRoute] Admin required. No admin session found.");
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return children;
  }

  // Handle User Route
  if (requiredRole === "user") {
    if (!user) {
      console.log("[ProtectedRoute] User required. No user session found.");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  }

  // Default: Require any authentication
  if (!user && !admin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}