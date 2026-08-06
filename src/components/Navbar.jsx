import React, { useState } from 'react';
import { Search, BookOpen, ShoppingBag, User, LogOut, Menu, X, ChevronDown, Plus } from 'lucide-react';
import { useApp } from '../context';

export default function Navbar() {
  const { user, logout, setShowAuth, setShowSell, goHome, goSearch, searchQuery, setSearchQuery, page } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

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
        position: 'sticky', top: 0, zIndex: 40,
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

            <button onClick={handleSell} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} /> Sell a Book
            </button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6c63ff, #10b981)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                  color: 'white'
                }}>
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <button onClick={logout} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <LogOut size={15} />
                </button>
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
              {user.name.slice(0, 2).toUpperCase()}
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

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {user ? (
            <button onClick={() => { logout(); setMobileOpen(false); }} className="nav-link" style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444' }}>
              <LogOut size={18} /> Logout
            </button>
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
