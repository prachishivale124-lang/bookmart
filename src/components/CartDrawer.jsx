import React from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useApp } from '../context';

export default function CartDrawer() {
  const { cart, showCart, setShowCart, removeFromCart, updateCartQty, setCheckoutBook, user, setShowAuth } = useApp();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  if (!showCart) return null;

  const handleCheckout = (items) => {
    setShowCart(false);
    if (!user) { setShowAuth(true); return; }
    setCheckoutBook(Array.isArray(items) ? items : [items]);
  };

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 8900,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)'
        }}
        onClick={() => setShowCart(false)}
      />

      {/* Drawer panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(420px, 100vw)', zIndex: 8950,
        background: 'rgba(16,20,36,0.99)',
        border: '1px solid rgba(108,99,255,0.18)',
        borderRight: 'none',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.7)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.4rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(108,99,255,0.08), rgba(16,185,129,0.04))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShoppingCart size={22} color="#818cf8" />
            <div>
              <h2 style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '1.15rem' }}>Shopping Cart</h2>
              <p style={{ color: '#64748b', fontSize: '0.78rem' }}>{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={() => setShowCart(false)}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)', color: '#94a3b8',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {cart.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
              <h3 style={{ color: '#f1f5f9', fontWeight: 700, marginBottom: '0.5rem' }}>Your cart is empty</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Browse our collection and add books you love!</p>
              <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setShowCart(false)}>
                Browse Books
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, padding: '1rem', display: 'flex', gap: '0.85rem', alignItems: 'flex-start'
              }}>
                {/* Thumbnail */}
                <div style={{ width: 52, height: 72, borderRadius: 8, overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                  <img
                    src={item.images?.[0]}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.src = 'https://via.placeholder.com/52x72/1a2235/6c63ff?text=📚'; }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</h4>
                  <p style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: '0.5rem' }}>{item.author}</p>
                  <div style={{ fontWeight: 800, color: '#10b981', fontSize: '0.95rem', marginBottom: '0.6rem' }}>₹{item.price}</div>

                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => updateCartQty(item.id, -1)}
                      style={{
                        width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
                        background: 'rgba(255,255,255,0.06)', color: '#f1f5f9', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      <Minus size={13} />
                    </button>
                    <span style={{ color: '#f1f5f9', fontWeight: 700, minWidth: 20, textAlign: 'center', fontSize: '0.9rem' }}>{item.qty}</span>
                    <button
                      onClick={() => updateCartQty(item.id, 1)}
                      style={{
                        width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
                        background: 'rgba(255,255,255,0.06)', color: '#f1f5f9', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      width: 30, height: 30, borderRadius: 8, border: 'none',
                      background: 'rgba(239,68,68,0.08)', color: '#f87171', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                  >
                    <Trash2 size={14} />
                  </button>
                  <div style={{ color: '#94a3b8', fontSize: '0.78rem', textAlign: 'right', marginTop: '0.25rem' }}>
                    ₹{item.price * item.qty}
                  </div>
                  <button
                    onClick={() => handleCheckout(item)}
                    className="btn-primary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: 8, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    Buy <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer summary */}
        {cart.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.07)',
            flexShrink: 0, background: 'rgba(255,255,255,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Subtotal ({totalItems} items)</span>
              <span style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '1.1rem' }}>₹{total}</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: '1rem', textAlign: 'center' }}>
              🚚 Free shipping on all orders!
            </p>
            <button
              onClick={() => { if (cart.length > 0) handleCheckout(cart); }}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
