import React, { useState } from 'react';
import { X, Mail, Phone, Eye, EyeOff, Loader, BookOpen } from 'lucide-react';
import { useApp } from '../context';

export default function AuthModal() {
  const { setShowAuth, login } = useApp();
  const [mode, setMode] = useState('login'); // login | signup
  const [tab, setTab] = useState('email'); // email | phone
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', city: '' });

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      login({
        name: form.name || (tab === 'email' ? form.email.split('@')[0] : 'User' + form.phone.slice(-4)),
        email: form.email,
        phone: form.phone,
        city: form.city || 'India'
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="overlay" onClick={() => setShowAuth(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '1.75rem 1.75rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <BookOpen size={16} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: '1.15rem', color: '#f1f5f9' }}>
              Book<span style={{ color: '#6c63ff' }}>Mart</span>
            </span>
          </div>
          <button onClick={() => setShowAuth(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.25rem 1.75rem 1.75rem' }}>
          {/* Title */}
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.3rem' }}>
            {mode === 'login' ? 'Welcome back! 👋' : 'Create an account ✨'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            {mode === 'login' ? 'Login to buy & sell books on BookMart' : 'Join thousands of book lovers on BookMart'}
          </p>

          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: 10, marginBottom: '1.5rem' }}>
            {['login', 'signup'].map(m => (
              <button key={m} className={`tab-btn ${mode === m ? 'active' : ''}`} onClick={() => setMode(m)}>
                {m === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Tab: Email / Phone */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {[
              { key: 'email', label: 'Email', icon: <Mail size={15} /> },
              { key: 'phone', label: 'Phone', icon: <Phone size={15} /> }
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  flex: 1, padding: '0.55rem', borderRadius: 8, border: '1.5px solid',
                  borderColor: tab === t.key ? '#6c63ff' : 'rgba(255,255,255,0.08)',
                  background: tab === t.key ? 'rgba(108,99,255,0.1)' : 'transparent',
                  color: tab === t.key ? '#818cf8' : '#64748b',
                  cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                  transition: 'all 0.2s'
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'signup' && (
              <div>
                <label className="label">Full Name</label>
                <input required className="input-field" placeholder="e.g. Priya Sharma" value={form.name} onChange={set('name')} />
              </div>
            )}

            {tab === 'email' ? (
              <div>
                <label className="label">Email Address</label>
                <input required type="email" className="input-field" placeholder="you@example.com" value={form.email} onChange={set('email')} />
              </div>
            ) : (
              <div>
                <label className="label">Phone Number</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.07)',
                    borderRadius: 10, padding: '0.75rem 0.9rem', color: '#94a3b8', fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', whiteSpace: 'nowrap'
                  }}>+91</div>
                  <input required type="tel" pattern="[0-9]{10}" className="input-field" placeholder="10-digit number" value={form.phone} onChange={set('phone')} />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="label">City</label>
                <input className="input-field" placeholder="e.g. Mumbai" value={form.city} onChange={set('city')} />
              </div>
            )}

            <div>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  required
                  type={showPass ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Min 8 characters"
                  minLength={6}
                  value={form.password}
                  onChange={set('password')}
                  style={{ paddingRight: '2.8rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.82rem', color: '#6c63ff', cursor: 'pointer', fontWeight: 600 }}>Forgot password?</span>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.25rem', padding: '0.8rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> : (mode === 'login' ? '🔐 Login to BookMart' : '🚀 Create My Account')}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.83rem', color: '#64748b' }}>
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <span
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                style={{ color: '#818cf8', fontWeight: 600, cursor: 'pointer' }}
              >
                {mode === 'login' ? 'Sign Up' : 'Login'}
              </span>
            </p>
          </form>
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
