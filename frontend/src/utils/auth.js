const USER_TOKEN = "user_token";
const USER_PROFILE = "user_profile";
const ADMIN_TOKEN = "admin_token";
const ADMIN_PROFILE = "admin_profile";

/**
 * Get keys based on role
 */
const getKeys = (role) => {
  if (role === "admin") {
    return { tokenKey: ADMIN_TOKEN, userKey: ADMIN_PROFILE };
  }
  return { tokenKey: USER_TOKEN, userKey: USER_PROFILE };
};

export const getStoredToken = (role = "user") => {
  const { tokenKey } = getKeys(role);
  return localStorage.getItem(tokenKey);
};

// Backward compatibility alias
export const clearStoredToken = () => {
  clearAllAuth();
};

export const getStoredUser = (role = "user") => {
  const { userKey } = getKeys(role);
  try {
    const raw = localStorage.getItem(userKey);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const storeAuthData = (token, user) => {
  const role = user.role || "user";
  const { tokenKey, userKey } = getKeys(role);
  
  localStorage.setItem(tokenKey, token);
  localStorage.setItem(userKey, JSON.stringify({
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }));
};

export const clearStoredAuth = (role = "user") => {
  const { tokenKey, userKey } = getKeys(role);
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
};

export const clearAllAuth = () => {
  localStorage.removeItem(USER_TOKEN);
  localStorage.removeItem(USER_PROFILE);
  localStorage.removeItem(ADMIN_TOKEN);
  localStorage.removeItem(ADMIN_PROFILE);
};

export const isJwtExpired = (token) => {
  if (!token || typeof token !== "string") return true;
  const parts = token.split(".");
  if (parts.length !== 3) return true;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

export const hasValidStoredToken = (role = "user") => {
  const token = getStoredToken(role);
  return token && !isJwtExpired(token);
};

export const getStoredRole = () => {
  // Check admin first, as it's more specific
  const admin = getStoredUser("admin");
  if (admin) return "admin";
  const user = getStoredUser("user");
  if (user) return "user";
  return null;
};