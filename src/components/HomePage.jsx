import React, { useMemo } from 'react';
import { Search, TrendingUp, Zap, BookOpen, ArrowRight, Star, Users, ShieldCheck } from 'lucide-react';
import BookCard from './BookCard';
import { useApp } from '../context';
import { BOOKS, CATEGORIES } from '../data';

const TRENDING = BOOKS.slice(0, 4);
const RECENT = BOOKS.slice(4, 8);

const StatCard = ({ icon, value, label }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
    padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14
  }}>
    <div style={{ fontSize: '1.3rem' }}>{icon}</div>
    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#f1f5f9' }}>{value}</div>
    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{label}</div>
  </div>
);

export default function HomePage() {
  const { books: userBooks, goSearch, setShowSell, setShowAuth, user, activeCategory, setActiveCategory } = useApp();
  const allBooks = useMemo(() => [...userBooks, ...BOOKS], [userBooks]);

  const [localQ, setLocalQ] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    goSearch(localQ);
  };

  return (
    <div>
      {/* =========== HERO SECTION =========== */}
      <div className="hero-bg" style={{ padding: 'clamp(2rem, 6vw, 4.5rem) 1.25rem clamp(3rem, 7vw, 5rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '-80px', left: '10%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '5%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', maxWidth: 780, margin: '0 auto' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.3)',
            borderRadius: 999, padding: '0.3rem 0.9rem', marginBottom: '1.25rem',
            fontSize: '0.8rem', fontWeight: 600, color: '#818cf8'
          }}>
            <Zap size={13} fill="#818cf8" color="#818cf8" /> India's #1 Book Exchange Platform
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            fontWeight: 800, color: '#f1f5f9', lineHeight: 1.15,
            marginBottom: '1rem'
          }}>
            Buy & Sell Books
            <br />
            <span className="shimmer-text">Smarter, Not Harder.</span>
          </h1>

          <p style={{ color: '#94a3b8', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 2rem' }}>
            Connect with thousands of readers across India. Find rare books, sell your collection, and discover your next great read — all in one place.
          </p>

          {/* Hero Search Bar */}
          <form onSubmit={handleSearch} style={{ maxWidth: 600, margin: '0 auto 1.5rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(255,255,255,0.07)',
              border: '1.5px solid rgba(255,255,255,0.12)',
              borderRadius: 16, padding: '0.5rem 0.5rem 0.5rem 1.25rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
              onFocus={() => {}}
            >
              <Search size={20} color="#6c63ff" />
              <input
                type="text"
                placeholder="Search by title, author, or genre..."
                value={localQ}
                onChange={e => setLocalQ(e.target.value)}
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  color: '#f1f5f9', fontSize: '1rem', fontFamily: 'Inter, sans-serif'
                }}
              />
              <button type="submit" className="btn-primary" style={{ borderRadius: 10, padding: '0.65rem 1.25rem', whiteSpace: 'nowrap' }}>
                Search →
              </button>
            </div>
          </form>

          {/* Quick search tags */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Self-Help', 'Finance', 'Fiction', 'Fantasy', 'History'].map(tag => (
              <button
                key={tag}
                onClick={() => goSearch(tag)}
                style={{
                  padding: '0.35rem 0.9rem', borderRadius: 999,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8', fontSize: '0.82rem', cursor: 'pointer',
                  transition: 'all 0.2s', fontFamily: 'Inter, sans-serif'
                }}
                onMouseEnter={e => { e.target.style.background = 'rgba(108,99,255,0.15)'; e.target.style.color = '#818cf8'; }}
                onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.color = '#94a3b8'; }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========== STATS =========== */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem 1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
          <StatCard icon="📚" value={`${allBooks.length}+`} label="Books Listed" />
          <StatCard icon="👤" value="2,400+" label="Active Readers" />
          <StatCard icon="🔄" value="1,200+" label="Exchanges Made" />
          <StatCard icon="⭐" value="4.8/5" label="Avg. Rating" />
        </div>
      </div>

      {/* =========== MAIN CONTENT =========== */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.25rem' }}>

        {/* User's newly added books */}
        {userBooks.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h2 className="section-title" style={{ fontSize: '1.5rem' }}>Your Listed Books</h2>
                <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '0.2rem' }}>Books you've recently listed</p>
              </div>
              <button onClick={() => goSearch('')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                View All <ArrowRight size={14} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.1rem' }}>
              {userBooks.slice(0, 4).map(book => <BookCard key={book.id} book={book} />)}
            </div>
          </section>
        )}

        {/* Categories */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>Browse by Category</h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.25rem' }}>Explore books in your favorite genre</p>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => { setActiveCategory(cat); goSearch(''); }}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Trending Books */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <TrendingUp size={18} color="#f59e0b" />
                <h2 className="section-title" style={{ fontSize: '1.5rem' }}>Trending Now</h2>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Most sought-after books this week</p>
            </div>
            <button onClick={() => goSearch('')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              See All <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.1rem' }}>
            {TRENDING.map(book => <BookCard key={book.id} book={book} />)}
          </div>
        </section>

        {/* Recently Added */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <Zap size={18} color="#6c63ff" />
                <h2 className="section-title" style={{ fontSize: '1.5rem' }}>Recently Added</h2>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Fresh listings from our community</p>
            </div>
            <button onClick={() => goSearch('')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              See All <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.1rem' }}>
            {RECENT.map(book => <BookCard key={book.id} book={book} />)}
          </div>
        </section>

        {/* Sell CTA Banner */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(16,185,129,0.1) 100%)',
          border: '1px solid rgba(108,99,255,0.25)',
          borderRadius: 20, padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem',
          position: 'relative', overflow: 'hidden', marginBottom: '2rem'
        }}>
          {/* BG decoration */}
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ fontSize: '3rem' }} className="float-anim">📚</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 800, color: '#f1f5f9' }}>
            Have Books to Sell?
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: 480, lineHeight: 1.7, fontSize: '0.95rem' }}>
            List your books in under 2 minutes. Reach thousands of readers across India and declutter your shelf while earning money.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => user ? setShowSell(true) : setShowAuth(true)}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
            >
              <BookOpen size={17} /> Start Selling Today
            </button>
            <button
              onClick={() => goSearch('')}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
            >
              Browse Books <ArrowRight size={15} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
            {['Free to list', 'No commission', 'Direct contact'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: '#10b981', fontWeight: 600 }}>
                <ShieldCheck size={14} /> {f}
              </div>
            ))}
          </div>
        </section>

        {/* How it Works */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 className="section-title" style={{ marginBottom: '0.4rem' }}>How BookMart Works</h2>
            <p style={{ color: '#64748b' }}>Simple, fast, and trustworthy</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {[
              { step: '01', icon: '🔍', title: 'Search & Browse', desc: 'Find books by title, author, or genre. Filter by condition and price.' },
              { step: '02', icon: '📞', title: 'Contact Seller', desc: 'Click "Contact Seller" to connect directly. No middlemen involved.' },
              { step: '03', icon: '💰', title: 'Pay Securely', desc: 'Pay via UPI, PhonePe, Google Pay, or opt for Cash on Delivery.' },
              { step: '04', icon: '📬', title: 'Get Your Book', desc: 'Arrange delivery or meetup with the seller at your convenience.' },
            ].map(item => (
              <div key={item.step} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, padding: '1.5rem',
                transition: 'transform 0.3s, border-color 0.3s'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6c63ff', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>STEP {item.step}</div>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <h3 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1rem', marginBottom: '0.4rem' }}>{item.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
