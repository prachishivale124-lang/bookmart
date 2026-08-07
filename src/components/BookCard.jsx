import React from 'react';
import { Star, MapPin, Clock, ShoppingCart } from 'lucide-react';
import { useApp } from '../context';
import { getConditionClass } from '../data';

export default function BookCard({ book }) {
  const { openBook, addToCart } = useApp();
  const condClass = getConditionClass(book.condition);

  return (
    <div className="book-card" onClick={() => openBook(book)}>
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', background: '#1a2235' }}>
        <img
          src={book.images[0]}
          alt={book.title}
          className="book-card-img"
          loading="lazy"
          onError={e => {
            e.target.src = `https://via.placeholder.com/240x320/1a2235/6c63ff?text=${encodeURIComponent(book.title.slice(0,10))}`;
          }}
        />
        {/* Condition badge */}
        <div style={{ position: 'absolute', top: '0.6rem', left: '0.6rem' }}>
          <span className={`badge ${condClass}`}>{book.condition}</span>
        </div>
        {/* Price */}
        <div style={{
          position: 'absolute', bottom: '0.6rem', right: '0.6rem',
          background: 'rgba(10,14,26,0.85)', backdropFilter: 'blur(8px)',
          borderRadius: 8, padding: '0.3rem 0.65rem',
          fontSize: '1rem', fontWeight: 800, color: '#10b981'
        }}>
          ₹{book.price}
        </div>
        {/* Add to cart button */}
        <button
          onClick={e => { e.stopPropagation(); addToCart(book); }}
          title="Add to cart"
          style={{
            position: 'absolute', top: '0.55rem', right: '0.55rem',
            width: 30, height: 30, borderRadius: 8,
            background: 'rgba(108,99,255,0.85)', border: 'none',
            color: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0, transition: 'opacity 0.2s, transform 0.2s',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 8px rgba(108,99,255,0.5)'
          }}
          className="card-cart-btn"
        >
          <ShoppingCart size={14} />
        </button>
      </div>

      {/* Details */}
      <div style={{ padding: '0.85rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.15rem', lineHeight: 1.3 }} className="line-clamp-2">
          {book.title}
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>{book.author}</p>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.6rem' }}>
          <Star size={12} fill="#f59e0b" color="#f59e0b" />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f59e0b' }}>{book.rating}</span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({book.reviews})</span>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={11} color="#64748b" />
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{book.seller.city}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={11} color="#64748b" />
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{book.postedAt}</span>
          </div>
        </div>
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
