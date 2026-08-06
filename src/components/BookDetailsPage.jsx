import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Clock, ShoppingBag, MessageCircle, ChevronLeft, ChevronRight, Shield, Award, Share2 } from 'lucide-react';
import { useApp } from '../context';
import { getConditionClass } from '../data';

export default function BookDetailsPage() {
  const { selectedBook: book, goHome, setCheckoutBook, setShowAuth, user } = useApp();
  const [imgIdx, setImgIdx] = useState(0);

  if (!book) return null;

  const condClass = getConditionClass(book.condition);
  const images = book.images && book.images.length > 0 ? book.images : ['https://via.placeholder.com/400x500/1a2235/6c63ff?text=No+Image'];

  const handleBuy = () => {
    if (!user) {
      setShowAuth(true);
    } else {
      setCheckoutBook(book);
    }
  };

  const handleContact = () => {
    if (!user) {
      setShowAuth(true);
    } else {
      alert(`Seller contact:\n📞 ${book.seller.phone || 'Contact via chat'}\n🏙 Located in ${book.seller.city}`);
    }
  };

  const stars = Math.round(book.rating);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem 1.25rem' }}>
      {/* Back button */}
      <button
        onClick={goHome}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
          color: '#94a3b8', padding: '0.5rem 1rem', borderRadius: 9,
          cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500,
          marginBottom: '1.5rem', transition: 'all 0.2s'
        }}
        onMouseEnter={e => e.target.style.color = '#f1f5f9'}
        onMouseLeave={e => e.target.style.color = '#94a3b8'}
      >
        <ArrowLeft size={16} /> Back to listings
      </button>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>

        {/* Left: Image Carousel */}
        <div>
          <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
            <img
              src={images[imgIdx]}
              alt={book.title}
              style={{ width: '100%', maxHeight: 460, objectFit: 'contain', display: 'block' }}
              onError={e => { e.target.src = `https://via.placeholder.com/400x460/1a2235/6c63ff?text=${encodeURIComponent(book.title.slice(0,10))}`; }}
            />

            {/* Condition overlay */}
            <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
              <span className={`badge ${condClass}`} style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}>{book.condition}</span>
            </div>

            {/* Nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                  style={{
                    position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
                    width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setImgIdx(i => (i + 1) % images.length)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
                    width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Dots */}
            {images.length > 1 && (
              <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                {images.map((_, i) => (
                  <div key={i} className={`carousel-dot ${i === imgIdx ? 'active' : ''}`} onClick={() => setImgIdx(i)} />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              {images.map((img, i) => (
                <img
                  key={i} src={img} alt=""
                  onClick={() => setImgIdx(i)}
                  style={{
                    width: 64, height: 72, objectFit: 'cover', borderRadius: 8, cursor: 'pointer',
                    border: `2px solid ${i === imgIdx ? '#6c63ff' : 'rgba(255,255,255,0.08)'}`,
                    transition: 'border-color 0.2s', opacity: i === imgIdx ? 1 : 0.6
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div>
          {/* Genre */}
          <div style={{ marginBottom: '0.75rem' }}>
            <span className="badge" style={{ background: 'rgba(108,99,255,0.12)', color: '#818cf8', border: '1px solid rgba(108,99,255,0.25)' }}>
              {book.genre}
            </span>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.25, marginBottom: '0.4rem' }}>
            {book.title}
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1rem' }}>by <span style={{ color: '#94a3b8', fontWeight: 600 }}>{book.author}</span>
            {book.edition && <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>· {book.edition}</span>}
          </p>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex' }}>
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={16} fill={s <= stars ? '#f59e0b' : 'none'} color={s <= stars ? '#f59e0b' : '#374151'} />
              ))}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b' }}>{book.rating}</span>
            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>({book.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span className="price-tag" style={{ fontSize: '2rem' }}>₹{book.price}</span>
            <span style={{ fontSize: '0.85rem', color: '#64748b', textDecoration: 'line-through' }}>₹{Math.round(book.price * 1.6)}</span>
            <span style={{
              background: 'rgba(16,185,129,0.15)', color: '#10b981',
              border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6,
              padding: '0.2rem 0.5rem', fontSize: '0.78rem', fontWeight: 700
            }}>
              {Math.round((1 - book.price / (book.price * 1.6)) * 100)}% OFF
            </span>
          </div>

          {/* Info chips */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Condition', value: book.condition, icon: '📗' },
              { label: 'Category', value: book.genre, icon: '📚' },
              { label: 'Location', value: book.seller.city, icon: '📍' },
              { label: 'Listed', value: book.postedAt, icon: '🕐' },
            ].map(info => (
              <div key={info.label} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10, padding: '0.7rem 0.9rem'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
                  {info.icon} {info.label}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>{info.value}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
              About this Book
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.7 }}>{book.description}</p>
          </div>

          {/* Seller card */}
          <div style={{
            background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.2)',
            borderRadius: 14, padding: '1rem', marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              Seller Information
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6c63ff, #10b981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', fontWeight: 700, color: 'white', flexShrink: 0
              }}>
                {book.seller.avatar || book.seller.name.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem' }}>{book.seller.name}</span>
                  <Shield size={13} color="#10b981" title="Verified Seller" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Star size={12} fill="#f59e0b" color="#f59e0b" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f59e0b' }}>{book.seller.rating}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    <MapPin size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.2rem' }} />
                    {book.seller.city}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{book.seller.sales} sales</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleBuy}
              className="btn-success"
              style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem', padding: '0.9rem' }}
            >
              <ShoppingBag size={18} /> Buy Now
            </button>
            <button
              onClick={handleContact}
              className="btn-secondary"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <MessageCircle size={16} /> Contact
            </button>
          </div>

          {/* Safety note */}
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.85rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
            <Shield size={13} /> Meet in a safe public place for in-person transactions
          </p>
        </div>
      </div>
    </div>
  );
}
