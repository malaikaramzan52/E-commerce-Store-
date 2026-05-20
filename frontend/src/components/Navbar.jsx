import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, Heart, User, LogOut } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartItems, setIsCartOpen, wishlistItems, setIsWishlistOpen } = useApp();
  const { user, admin, logout } = useAuth();
  const navigate = useNavigate();

  // Active profile is either admin or user
  const activeUser = admin || user;

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Transparent only on home page when not scrolled
  const isTransparent = isHome && !scrolled;

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', isLink: true, to: '/' },
    { label: 'Shop', isLink: true, to: '/shop' },
    { label: 'Sale', isLink: true, to: '/sale' },
    { label: 'About Us', isLink: true, to: '/about' },
    { label: 'Contact Us', isLink: true, to: '/contact' },
  ];

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 50,
          transition: 'background 0.5s ease, box-shadow 0.5s ease',
          background: isTransparent ? 'transparent' : 'rgba(20,18,16,0.97)',
          backdropFilter: isTransparent ? 'none' : 'blur(8px)',
          borderBottom: isTransparent ? 'none' : '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>

            {/* ── Left Nav Links ── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                flex: 1,
                transition: 'opacity 0.3s, transform 0.3s',
                opacity: isSearchOpen ? 0 : 1,
                pointerEvents: isSearchOpen ? 'none' : 'auto',
              }}
              className="hidden-mobile"
            >
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return link.isLink ? (
                  <Link
                    key={link.label}
                    to={link.to}
                    style={{
                      ...navLinkStyle,
                      color: isActive ? '#f43f5e' : 'rgba(255,255,255,0.92)',
                      fontWeight: isActive ? '700' : '600',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = isActive ? '#f43f5e' : 'rgba(255,255,255,0.6)'}
                    onMouseLeave={e => e.currentTarget.style.color = isActive ? '#f43f5e' : 'rgba(255,255,255,0.92)'}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.label}
                    onClick={link.action}
                    style={navLinkStyle}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.92)'}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* ── Center Logo ── */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                transition: 'opacity 0.3s, transform 0.3s',
                opacity: isSearchOpen ? 0 : 1,
                pointerEvents: isSearchOpen ? 'none' : 'auto',
              }}
            >
              <Link to="/" style={{ textDecoration: 'none', textAlign: 'center' }}>
                <span style={{
                  display: 'block',
                  fontSize: '9px',
                  letterSpacing: '0.45em',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.80)',
                  textTransform: 'uppercase',
                  marginBottom: '1px',
                  fontFamily: "'Outfit', sans-serif",
                }}>
                  ELEGANCE
                </span>
                <span style={{
                  display: 'block',
                  fontSize: '26px',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: '#ffffff',
                  letterSpacing: '0.04em',
                  lineHeight: 1.1,
                }}>
                  Couture
                </span>
                {/* Decorative line */}
                <span style={{
                  display: 'block',
                  width: '28px',
                  height: '1px',
                  background: 'rgba(255,255,255,0.55)',
                  margin: '5px auto 0',
                }} />
              </Link>
            </div>

            {/* ── Right Icons ── */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '1.25rem',
              }}
            >
              {/* Expanding Search */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.4s ease',
                ...(isSearchOpen
                  ? { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', padding: '0 14px', width: '260px' }
                  : { width: '28px' })
              }}>
                {isSearchOpen && (
                  <input
                    type="text"
                    placeholder="Search couture..."
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#fff',
                      fontSize: '13px',
                      flex: 1,
                      padding: '8px 0',
                    }}
                  />
                )}
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  style={{ ...iconBtnStyle, color: 'rgba(255,255,255,0.88)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.88)'}
                >
                  {isSearchOpen
                    ? <X size={17} style={{ transition: 'transform 0.3s' }} />
                    : <Search size={18} />}
                </button>
              </div>

              {!isSearchOpen && (
                <>
                  {/* Account / User */}
                    <button
                      onClick={() => {
                        if (admin) {
                          navigate('/dashboard');
                        } else if (user) {
                          navigate('/user/dashboard');
                        } else {
                          navigate('/login');
                        }
                      }}
                      style={{ ...iconBtnStyle, color: 'rgba(255,255,255,0.88)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.88)'}
                      title={admin ? `Admin Portal: ${admin.name}` : (user ? `User Profile: ${user.name}` : "Login")}
                    >
                      <User size={18} />
                    </button>

                    {activeUser && (
                      <button
                        onClick={() => {
                          // Logout both roles to ensure clean slate
                          logout("admin");
                          logout("user");
                          // If we were on admin path, go to admin login, else regular login
                          if (location.pathname.includes("dashboard") && !location.pathname.includes("user")) {
                            navigate('/admin/login');
                          } else {
                            navigate('/login');
                          }
                        }}
                        style={{ ...iconBtnStyle, color: 'rgba(244,63,94,0.88)' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'rgba(244,63,94,0.55)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(244,63,94,0.88)'}
                        title="Logout"
                      >
                        <LogOut size={18} />
                      </button>
                    )}

                  {/* Wishlist */}
                  <button
                    onClick={() => setIsWishlistOpen(true)}
                    style={{ ...iconBtnStyle, color: 'rgba(255,255,255,0.88)', position: 'relative' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.88)'}
                  >
                    <Heart size={18} />
                    {wishlistCount > 0 && (
                      <span style={badgeStyle}>{wishlistCount}</span>
                    )}
                  </button>

                  {/* Cart */}
                  <button
                    onClick={() => setIsCartOpen(true)}
                    style={{ ...iconBtnStyle, color: 'rgba(255,255,255,0.88)', position: 'relative' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.88)'}
                  >
                    <ShoppingBag size={18} />
                    <span style={cartBadgeStyle}>{cartCount}</span>
                  </button>
                </>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{ ...iconBtnStyle, color: 'rgba(255,255,255,0.88)', display: 'none' }}
                className="show-mobile"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <div style={{
          overflow: 'hidden',
          maxHeight: isMobileMenuOpen ? '300px' : '0',
          transition: 'max-height 0.35s ease',
          background: 'rgba(20,18,16,0.97)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ padding: '1rem 2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return link.isLink ? (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    padding: '12px 14px',
                    color: isActive ? '#f43f5e' : 'rgba(255,255,255,0.85)',
                    fontSize: '11px',
                    fontWeight: isActive ? '800' : '600',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontFamily: "'Outfit', sans-serif",
                    borderRadius: '6px',
                    transition: 'background 0.2s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={link.action}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    padding: '12px 14px',
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontFamily: "'Outfit', sans-serif",
                    borderRadius: '6px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Responsive helpers */}
      <style>{`
        .hidden-mobile { display: flex !important; }
        .show-mobile { display: none !important; }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
};

/* ── Shared style objects ── */
const navLinkStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'rgba(255,255,255,0.92)',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  fontFamily: "'Outfit', sans-serif",
  textDecoration: 'none',
  transition: 'color 0.2s',
  padding: 0,
  whiteSpace: 'nowrap',
};

const iconBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'color 0.2s',
  padding: '2px',
};

const badgeStyle = {
  position: 'absolute',
  top: '-6px',
  right: '-6px',
  background: '#c0392b',
  color: '#fff',
  fontSize: '9px',
  fontWeight: 700,
  width: '15px',
  height: '15px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const cartBadgeStyle = {
  position: 'absolute',
  top: '-6px',
  right: '-6px',
  background: '#fff',
  color: '#111',
  fontSize: '9px',
  fontWeight: 700,
  minWidth: '15px',
  height: '15px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 2px',
};

export default Navbar;