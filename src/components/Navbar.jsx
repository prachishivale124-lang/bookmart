import React, { useState, useRef, useEffect } from 'react';
import { Search, BookOpen, ShoppingCart, User, LogOut, Menu, X, ChevronDown, Plus, Package } from 'lucide-react';
import { useApp } from '../context';

export default function Navbar() {
  const { user, logout, setShowAuth, setShowSell, goHome, goSearch, page, setShowProfile, setShowOrders, cart, setShowCart } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      goSearch(localSearch.trim());
    }
  };

  const handleSell = () => {
    if (!user) {
      setShowAuth(true);
    } else {
      setShowSell(true);
    }
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop / Tablet Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,14,26,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', height: 64 }}>

          {/* Logo */}
          <div onClick={goHome} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(108,99,255,0.4)'
            }}>
              <BookOpen size={18} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: '1.25rem', color: '#f1f5f9' }}>
              Book<span style={{ color: '#6c63ff' }}>Mart</span>
            </span>
          </div>

          {/* Search bar — center */}
          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 520, display: 'flex' }} className="hidden-mobile">
            <div className="search-bar-wrapper" style={{ width: '100%' }}>
              <Search size={18} color="#64748b" />
              <input
                type="text"
                className="search-bar-input"
                placeholder="Search by title, author, or genre..."
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              {localSearch && (
                <button type="submit" className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                  Search
                </button>
              )}
            </div>
          </form>

          {/* Right actions */}
          <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
            <button onClick={() => { goSearch(''); }} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Search size={16} /> Browse
            </button>

            {/* Cart button with badge */}
            <button
              onClick={() => setShowCart(true)}
              style={{
                position: 'relative', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                color: '#f1f5f9', cursor: 'pointer', padding: '0.5rem 0.65rem',
                display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            >
              <ShoppingCart size={17} />
              {cart.length > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
                  color: 'white', borderRadius: '50%', width: 18, height: 18,
                  fontSize: '0.65rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(108,99,255,0.5)'
                }}>
                  {cart.reduce((s, i) => s + i.qty, 0)}
                </span>
              )}
            </button>

            <button onClick={handleSell} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} /> Sell a Book
            </button>

            {user ? (
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                {/* Avatar button */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen(prev => !prev)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    cursor: 'pointer', padding: '0.2rem 0.4rem', borderRadius: 999,
                    background: 'none', border: 'none',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6c63ff, #10b981)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700, color: 'white',
                    flexShrink: 0
                  }}>
                    {(user?.name ?? '??').slice(0, 2).toUpperCase()}
                  </div>
                  <ChevronDown
                    size={14}
                    color="#94a3b8"
                    style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>

                {/* Transparent backdrop to capture outside-clicks on any z-layer */}
                {dropdownOpen && (
                  <div
                    style={{
                      position: 'fixed', inset: 0,
                      zIndex: 9998
                    }}
                    onClick={() => setDropdownOpen(false)}
                  />
                )}

                {/* Dropdown panel */}
                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    width: 230, zIndex: 9999,
                    background: 'rgba(13,11,30,0.98)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(108,99,255,0.25)',
                    borderRadius: 14,
                    boxShadow: '0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(108,99,255,0.1)',
                    display: 'flex', flexDirection: 'column',
                    padding: '0.4rem',
                    pointerEvents: 'auto'
                  }}>
                    {/* User info header */}
                    <div style={{
                      padding: '0.6rem 0.8rem 0.8rem',
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                      marginBottom: '0.35rem'
                    }}>
                      <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9rem', marginBottom: '0.15rem' }}>{user.name}</div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email || user.phone}</div>
                    </div>

                    {/* My Profile */}
                    <button
                      type="button"
                      onClick={() => { setShowProfile(true); setDropdownOpen(false); }}
                      style={{
                        width: '100%', textAlign: 'left',
                        padding: '0.65rem 0.8rem',
                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                        borderRadius: 10, border: 'none', cursor: 'pointer',
                        background: 'none',
                        color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 500,
                        transition: 'background 0.15s, color 0.15s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.18)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#e2e8f0'; }}
                    >
                      <User size={16} color="#818cf8" /> My Profile
                    </button>

                    {/* My Orders */}
                    <button
                      type="button"
                      onClick={() => { setShowOrders(true); setDropdownOpen(false); }}
                      style={{
                        width: '100%', textAlign: 'left',
                        padding: '0.65rem 0.8rem',
                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                        borderRadius: 10, border: 'none', cursor: 'pointer',
                        background: 'none',
                        color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 500,
                        transition: 'background 0.15s, color 0.15s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.18)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#e2e8f0'; }}
                    >
                      <Package size={16} color="#818cf8" /> My Orders
                    </button>

                    {/* Separator */}
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0.3rem 0.4rem' }} />

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      style={{
                        width: '100%', textAlign: 'left',
                        padding: '0.65rem 0.8rem',
                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                        borderRadius: 10, border: 'none', cursor: 'pointer',
                        background: 'none',
                        color: '#f87171', fontSize: '0.9rem', fontWeight: 500,
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <LogOut size={16} color="#f87171" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowAuth(true)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={15} /> Login
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="show-mobile"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              gap: '5px', padding: '4px'
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} color="#f1f5f9" /> : <Menu size={22} color="#f1f5f9" />}
          </button>
        </div>

        {/* Mobile search bar */}
        <div className="show-mobile" style={{ padding: '0 1rem 0.75rem' }}>
          <form onSubmit={handleSearch}>
            <div className="search-bar-wrapper">
              <Search size={16} color="#64748b" />
              <input
                type="text"
                className="search-bar-input"
                placeholder="Search books..."
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                style={{ fontSize: '0.9rem' }}
              />
              {localSearch && (
                <button type="submit" className="btn-primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.78rem' }}>
                  Go
                </button>
              )}
            </div>
          </form>
        </div>
      </nav>

      {/* Mobile Side Nav Overlay */}
      <div className={`mobile-nav-overlay ${mobileOpen ? 'show' : ''}`} onClick={() => setMobileOpen(false)} />

      {/* Mobile Side Nav */}
      <nav className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(108,99,255,0.08)', borderRadius: 12, marginBottom: '1rem' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6c63ff, #10b981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 700, color: 'white'
            }}>
              {(user?.name ?? '??').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9' }}>{user.name}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{user.email || user.phone}</div>
            </div>
          </div>
        )}

        <button onClick={() => { goHome(); setMobileOpen(false); }} className="nav-link" style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BookOpen size={18} /> Home
        </button>
        <button onClick={() => { goSearch(''); setMobileOpen(false); }} className="nav-link" style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Search size={18} /> Browse Books
        </button>
        <button onClick={handleSell} className="nav-link" style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#6c63ff' }}>
          <Plus size={18} /> Sell a Book
        </button>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {user ? (
            <>
              <button onClick={() => { setShowProfile(true); setMobileOpen(false); }} className="nav-link" style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <User size={18} /> My Profile
              </button>
              <button onClick={() => { setShowOrders(true); setMobileOpen(false); }} className="nav-link" style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Package size={18} /> My Orders
              </button>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="nav-link" style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444' }}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <button onClick={() => { setShowAuth(true); setMobileOpen(false); }} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <User size={16} /> Login / Sign Up
            </button>
          )}
        </div>
      </nav>

      <style>{`
        @media (min-width: 640px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 639px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}
