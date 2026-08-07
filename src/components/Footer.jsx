import React from 'react';
import { BookOpen, Heart } from 'lucide-react';
import { useApp } from '../context';

export default function Footer() {
  const { goHome, goSearch, setShowAuth, setShowSell, user, setStaticPage } = useApp();

  return (
    <footer style={{
      background: 'rgba(255,255,255,0.02)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      marginTop: '3rem',
      padding: '2.5rem 1.25rem 1.5rem'
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <BookOpen size={15} color="white" strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: '1.1rem', color: '#f1f5f9' }}>
                Book<span style={{ color: '#6c63ff' }}>Mart</span>
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 240 }}>
              India's peer-to-peer book exchange marketplace. Buy, sell, and discover books near you.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'Browse Books', action: () => goSearch('') },
                { label: 'Sell a Book', action: () => user ? setShowSell(true) : setShowAuth(true) },
                { label: 'How it Works', action: goHome },
              ].map(l => (
                <button key={l.label} onClick={l.action} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.88rem', textAlign: 'left', cursor: 'pointer', padding: 0, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#f1f5f9'}
                  onMouseLeave={e => e.target.style.color = '#64748b'}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Safety */}
          <div>
            <h4 style={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Safety Tips</h4>
            <ul style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.9, paddingLeft: '1.1rem', margin: 0 }}>
              <li>Meet in public places</li>
              <li>Inspect before paying</li>
              <li>Use UPI for safe payment</li>
              <li>Report suspicious sellers</li>
            </ul>
          </div>

          {/* Legal & Help */}
          <div>
            <h4 style={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Company & Help</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'About Us', page: 'about' },
                { label: 'FAQs', page: 'faqs' },
                { label: 'Terms & Conditions', page: 'terms' },
                { label: 'Privacy Policy', page: 'privacy' },
                { label: 'Contact Support', page: 'support' },
              ].map(l => (
                <button key={l.label} onClick={() => setStaticPage(l.page)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.88rem', textAlign: 'left', cursor: 'pointer', padding: 0, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#f1f5f9'}
                  onMouseLeave={e => e.target.style.color = '#64748b'}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ color: '#64748b', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Made with <Heart size={13} color="#ef4444" fill="#ef4444" /> for book lovers in India
          </p>
          <p style={{ color: '#64748b', fontSize: '0.8rem' }}>© 2025 BookMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
