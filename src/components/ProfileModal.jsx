import React, { useState } from 'react';
import { X, User, MapPin, CreditCard, Calendar, BookOpen, Clock } from 'lucide-react';
import { useApp } from '../context';
import BookCard from './BookCard';

export default function ProfileModal() {
  const { user, setShowProfile, books } = useApp();
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'listings'
  
  if (!user) return null;
  
  // Find books listed by this user
  const userListings = books.filter(b => b.seller?.name === user.name || b.seller?.name === 'You');

  const formattedDate = user.joinedDate 
    ? new Date(user.joinedDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 650, padding: 0, overflow: 'hidden' }}>
        
        {/* Header Header */}
        <div style={{
          padding: '2rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(108,99,255,0.1) 0%, rgba(139,92,246,0.05) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'relative'
        }}>
          <button onClick={() => setShowProfile(false)} className="close-btn" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            <X size={20} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6c63ff, #10b981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 700, color: 'white',
              boxShadow: '0 8px 24px rgba(108,99,255,0.3)',
              border: '4px solid rgba(255,255,255,0.1)'
            }}>
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.2rem' }}>{user.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><User size={14} /> {user.email || user.phone}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={14} /> {user.city || 'India'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button 
            onClick={() => setActiveTab('details')}
            style={{ 
              flex: 1, padding: '1rem', background: 'none', border: 'none', cursor: 'pointer',
              color: activeTab === 'details' ? '#818cf8' : '#94a3b8',
              fontWeight: activeTab === 'details' ? 600 : 500,
              borderBottom: activeTab === 'details' ? '2px solid #818cf8' : '2px solid transparent',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}
          >
            <User size={16} /> Profile Details
          </button>
          <button 
            onClick={() => setActiveTab('listings')}
            style={{ 
              flex: 1, padding: '1rem', background: 'none', border: 'none', cursor: 'pointer',
              color: activeTab === 'listings' ? '#818cf8' : '#94a3b8',
              fontWeight: activeTab === 'listings' ? 600 : 500,
              borderBottom: activeTab === 'listings' ? '2px solid #818cf8' : '2px solid transparent',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}
          >
            <BookOpen size={16} /> My Listings ({userListings.length})
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', maxHeight: '50vh', overflowY: 'auto' }} className="custom-scrollbar">
          
          {activeTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ color: '#f1f5f9', marginBottom: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} color="#818cf8" /> Shipping Address
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {user.address || 'No primary address saved. You can add one during checkout.'}
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ color: '#f1f5f9', marginBottom: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={16} color="#818cf8" /> Saved Payment Methods
                </h4>
                {user.savedPaymentMethods?.length > 0 ? (
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Methods exist</div>
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    No payment methods saved yet. Pay securely via UPI on your next order.
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                <Calendar size={14} /> Member since {formattedDate}
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div>
              {userListings.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
                  {userListings.map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <BookOpen size={40} color="#334155" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ color: '#f1f5f9', fontSize: '1.1rem', marginBottom: '0.5rem' }}>No books listed yet</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Declutter your shelf and earn by selling books you've already read.</p>
                </div>
              )}
            </div>
          )}
          
        </div>
        
      </div>
    </div>
  );
}
