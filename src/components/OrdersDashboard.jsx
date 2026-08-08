import React, { useState } from 'react';
import {
  X, Package, Clock, Truck, CheckCircle, ChevronRight,
  BookOpen, Download, MessageCircle, XCircle, Printer,
  MapPin, CreditCard, ShoppingBag, AlertCircle
} from 'lucide-react';
import { useApp } from '../context';

/* ─────────────────────────────────────────────
   Helper: resolve the display shape of an order
   Supports both old single-book shape and new
   consolidated items[] shape.
───────────────────────────────────────────────*/
function normalizeOrder(order) {
  if (!order) return null;
  // New shape: has items array
  if (Array.isArray(order.items) && order.items.length > 0) {
    return {
      ...order,
      _normalized: true,
      displayTitle: order.items.length === 1
        ? (order.items[0].title || 'Untitled Book')
        : `${order.items.length} books`,
      displaySeller: order.items.length === 1
        ? (order.items[0].seller?.name || order.items[0].seller || 'BookMart Seller')
        : 'Multiple Sellers',
      displayPrice: order.totalAmount ?? order.items.reduce((s, i) => s + (i.price * (i.qty || 1)), 0),
      displayThumb: order.items[0]?.images?.[0] || null,
      orderStatus: order.orderStatus || order.status || 'Processing',
    };
  }
  // Old/legacy shape: flat single book fields
  return {
    ...order,
    _normalized: true,
    displayTitle: order.title || 'Untitled Book',
    displaySeller: typeof order.seller === 'string' ? order.seller : (order.seller?.name || 'BookMart Seller'),
    displayPrice: order.totalAmount ?? order.price ?? 0,
    displayThumb: order.thumbnail || order.images?.[0] || null,
    orderStatus: order.orderStatus || order.status || 'Processing',
    items: order.items || [{
      title: order.title,
      price: order.price,
      qty: 1,
      images: order.thumbnail ? [order.thumbnail] : [],
      seller: { name: typeof order.seller === 'string' ? order.seller : order.seller?.name },
    }],
  };
}

/* ─────────────────────────────────────────────
   Status config
───────────────────────────────────────────────*/
function getStatusInfo(status) {
  switch (status) {
    case 'Processing':       return { bg: 'rgba(245,158,11,0.14)',  text: '#f59e0b', icon: <Clock size={13} />,         label: 'Processing' };
    case 'Shipped':          return { bg: 'rgba(56,189,248,0.14)',  text: '#38bdf8', icon: <Package size={13} />,       label: 'Shipped' };
    case 'Out for Delivery': return { bg: 'rgba(192,132,252,0.14)', text: '#c084fc', icon: <Truck size={13} />,         label: 'Out for Delivery' };
    case 'Delivered':        return { bg: 'rgba(16,185,129,0.14)', text: '#10b981', icon: <CheckCircle size={13} />,    label: 'Delivered' };
    case 'Cancelled':        return { bg: 'rgba(239,68,68,0.14)',   text: '#f87171', icon: <XCircle size={13} />,       label: 'Cancelled' };
    default:                 return { bg: 'rgba(255,255,255,0.08)', text: '#94a3b8', icon: <Clock size={13} />,         label: status || 'Processing' };
  }
}

function getPaymentBadge(paymentStatus) {
  if (paymentStatus === 'Paid')
    return { bg: 'rgba(16,185,129,0.12)', text: '#10b981', border: 'rgba(16,185,129,0.25)', label: '✓ Paid' };
  if (paymentStatus === 'COD')
    return { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b', border: 'rgba(245,158,11,0.25)', label: '₹ COD' };
  return { bg: 'rgba(100,116,139,0.12)', text: '#94a3b8', border: 'rgba(100,116,139,0.25)', label: paymentStatus || 'Pending' };
}

/* ─────────────────────────────────────────────
   Confirm cancel dialog
───────────────────────────────────────────────*/
function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10001,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: 'rgba(20,26,45,0.99)', border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: 16, padding: '2rem', maxWidth: 400, width: '100%',
        boxShadow: '0 25px 60px rgba(0,0,0,0.7)', animation: 'fadeInUp 0.25s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <AlertCircle size={20} color="#f87171" />
          <h3 style={{ color: '#f1f5f9', fontSize: '1.1rem', fontWeight: 700 }}>{title}</h3>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '0.7rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
            background: 'none', color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem'
          }}>Keep Order</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '0.7rem', borderRadius: 10, border: 'none',
            background: 'rgba(239,68,68,0.8)', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem'
          }}>Confirm Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Contact seller modal
───────────────────────────────────────────────*/
function ContactSellerModal({ order, onClose }) {
  const norm = normalizeOrder(order);
  const [msg, setMsg] = useState(`Hi, I'm writing regarding my order ${norm?.id ?? ''} for "${norm?.displayTitle ?? 'my order'}". `);
  const { showToast } = useApp();

  const handleSend = () => {
    showToast('Message sent to seller! 📩');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10001,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: 'rgba(20,26,45,0.99)', border: '1px solid rgba(108,99,255,0.25)',
        borderRadius: 20, padding: '0', maxWidth: 500, width: '100%',
        boxShadow: '0 25px 60px rgba(0,0,0,0.7)', overflow: 'hidden', animation: 'fadeInUp 0.25s ease'
      }}>
        <div style={{
          padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(16,185,129,0.05))',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.1rem' }}>Contact Seller</h3>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
              Re: {norm?.id} — <span style={{ color: '#cbd5e1' }}>{norm?.displaySeller ?? 'Seller'}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Your Message</label>
          <textarea
            value={msg}
            onChange={e => setMsg(e.target.value)}
            rows={5}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)',
              borderRadius: 12, color: '#f1f5f9', padding: '0.9rem 1rem', fontSize: '0.9rem',
              fontFamily: 'Inter, sans-serif', resize: 'vertical', outline: 'none',
              lineHeight: 1.6, marginBottom: '1.25rem', transition: 'border-color 0.2s', boxSizing: 'border-box'
            }}
            onFocus={e => e.target.style.borderColor = '#6c63ff'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={onClose} style={{
              flex: 1, padding: '0.7rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
              background: 'none', color: '#94a3b8', cursor: 'pointer', fontWeight: 600
            }}>Cancel</button>
            <button onClick={handleSend} className="btn-primary" style={{ flex: 2 }}>
              Send Message 📩
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Invoice modal
───────────────────────────────────────────────*/
function InvoiceModal({ order, onClose }) {
  const norm = normalizeOrder(order);
  if (!norm) return null;

  const invoiceDate = new Date(norm.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10001,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, maxWidth: 520, width: '100%',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.7)', animation: 'fadeInUp 0.25s ease'
      }}>
        <div style={{ padding: '2rem', color: '#111' }} id="invoice-print">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '2px solid #6c63ff', paddingBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#6c63ff' }}>BookMart</div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>India's Book Exchange Platform</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>INVOICE</div>
              <div style={{ fontSize: '0.85rem', color: '#555' }}>{norm.id}</div>
              <div style={{ fontSize: '0.8rem', color: '#777' }}>{invoiceDate}</div>
            </div>
          </div>

          {/* Billed to / Seller */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '0.3rem', color: '#555' }}>BILLED TO</div>
              <div style={{ fontWeight: 700 }}>{norm.shippingAddress?.name || 'Customer'}</div>
              {norm.shippingAddress?.address && <div style={{ color: '#666' }}>{norm.shippingAddress.address}</div>}
              {norm.shippingAddress?.city && <div style={{ color: '#666' }}>{norm.shippingAddress.city} {norm.shippingAddress.pincode}</div>}
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '0.3rem', color: '#555' }}>SELLER</div>
              <div style={{ fontWeight: 700 }}>{norm.displaySeller}</div>
              <div style={{ color: '#666' }}>Verified Seller</div>
            </div>
          </div>

          {/* Items table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 600, color: '#555' }}>Item</th>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center', fontWeight: 600, color: '#555' }}>Qty</th>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 600, color: '#555' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(norm.items || []).map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{item.title || 'Book'}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', color: '#666' }}>×{item.qty || 1}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{(item.price * (item.qty || 1))}</td>
                </tr>
              ))}
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.75rem', color: '#666' }}>Shipping Charges</td>
                <td></td>
                <td style={{ padding: '0.75rem', textAlign: 'right', color: '#10b981', fontWeight: 600 }}>FREE</td>
              </tr>
              <tr style={{ background: '#f9fafb' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700 }}>TOTAL</td>
                <td></td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 800, color: '#6c63ff', fontSize: '1.05rem' }}>₹{norm.displayPrice}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ textAlign: 'center', color: '#999', fontSize: '0.78rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
            Thank you for using BookMart! For support: support@bookmart.in
          </div>
        </div>

        <div style={{ padding: '1rem 2rem 1.5rem', display: 'flex', gap: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '0.7rem', borderRadius: 10, border: '1px solid #e5e7eb',
            background: 'none', color: '#555', cursor: 'pointer', fontWeight: 600
          }}>Close</button>
          <button onClick={() => window.print()} style={{
            flex: 2, padding: '0.7rem', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)', color: 'white',
            cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
          }}>
            <Printer size={16} /> Print / Download
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Empty state
───────────────────────────────────────────────*/
function EmptyOrders({ onClose }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '3rem 1.5rem', textAlign: 'center'
    }}>
      {/* Animated icon */}
      <div style={{
        width: 100, height: 100, borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(16,185,129,0.07))',
        border: '1px solid rgba(108,99,255,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1.5rem',
        animation: 'float 4s ease-in-out infinite',
      }}>
        <ShoppingBag size={40} color="#818cf8" strokeWidth={1.5} />
      </div>
      <h3 style={{ color: '#f1f5f9', fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.6rem' }}>
        No orders yet
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 300, marginBottom: '2rem' }}>
        Start exploring our library of books and place your first order to see it here.
      </p>
      <button className="btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }} onClick={onClose}>
        Browse Books →
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Single order card
───────────────────────────────────────────────*/
function OrderCard({ order, onTrack, onInvoice, onContact, onCancel }) {
  const norm = normalizeOrder(order);
  if (!norm) return null;

  const si = getStatusInfo(norm.orderStatus);
  const pb = getPaymentBadge(norm.paymentStatus);
  const orderDate = new Date(norm.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 18,
      overflow: 'hidden',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.2)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Card header */}
      <div style={{
        padding: '1rem 1.25rem',
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem'
      }}>
        {/* Left: ID + date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.15rem' }}>Order ID</div>
            <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'monospace' }}>{norm.id}</div>
          </div>
          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.08)' }} />
          <div>
            <div style={{ color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.15rem' }}>Placed</div>
            <div style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.85rem' }}>{orderDate}</div>
          </div>
        </div>
        {/* Right: status badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            background: si.bg, color: si.text,
            padding: '0.3rem 0.8rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700
          }}>
            {si.icon} {si.label}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            background: pb.bg, color: pb.text,
            border: `1px solid ${pb.border}`,
            padding: '0.25rem 0.65rem', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700
          }}>
            {pb.label}
          </span>
        </div>
      </div>

      {/* Items list */}
      <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {(norm.items || []).map((item, idx) => {
          const thumb = item.images?.[0] || item.thumbnail || null;
          const sellerName = item.seller?.name || item.seller || 'BookMart Seller';
          const itemTotal = (item.price || 0) * (item.qty || 1);

          return (
            <div key={idx} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
              {/* Thumbnail */}
              <div style={{
                width: 52, height: 74, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                background: 'rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {thumb
                  ? <img src={thumb} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none'; }} />
                  : <BookOpen size={20} color="#475569" />
                }
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3, marginBottom: '0.2rem',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title || 'Book'}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                  Sold by <span style={{ color: '#94a3b8' }}>{sellerName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.95rem' }}>₹{itemTotal}</span>
                  {(item.qty || 1) > 1 && (
                    <span style={{ color: '#64748b', fontSize: '0.78rem' }}>
                      ₹{item.price} × {item.qty}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Total + address footer */}
        <div style={{
          marginTop: '0.25rem', paddingTop: '0.85rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem'
        }}>
          {/* Shipping address */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', flex: 1, minWidth: 0 }}>
            <MapPin size={13} color="#64748b" style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ color: '#64748b', fontSize: '0.78rem', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {norm.shippingAddress
                ? `${norm.shippingAddress.address || ''}, ${norm.shippingAddress.city || ''} ${norm.shippingAddress.pincode || ''}`.trim().replace(/^,\s*/, '')
                : 'Address not available'}
            </span>
          </div>
          {/* Order total */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Order Total</div>
            <div style={{ color: '#10b981', fontWeight: 800, fontSize: '1.05rem' }}>₹{norm.displayPrice}</div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{
        padding: '0.85rem 1.25rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', gap: '0.5rem', flexWrap: 'wrap'
      }}>
        <ActionBtn icon={<Truck size={13} />} label="Track Shipment" accent onClick={() => onTrack(order)} />
        <ActionBtn icon={<Download size={13} />} label="Invoice" onClick={() => onInvoice(order)} />
        <ActionBtn icon={<MessageCircle size={13} />} label="Contact Seller" tinted onClick={() => onContact(order)} />
        {norm.orderStatus !== 'Delivered' && norm.orderStatus !== 'Cancelled' && (
          <ActionBtn icon={<XCircle size={13} />} label="Cancel" danger onClick={() => onCancel(order)} />
        )}
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, onClick, accent, tinted, danger }) {
  const base = {
    display: 'flex', alignItems: 'center', gap: '0.35rem',
    padding: '0.5rem 0.85rem', fontSize: '0.8rem', borderRadius: 9,
    cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s', border: 'none',
  };
  if (accent) {
    return (
      <button onClick={onClick} className="btn-primary" style={{ ...base, padding: '0.5rem 0.85rem', fontSize: '0.8rem', borderRadius: 9 }}>
        {icon} {label}
      </button>
    );
  }
  if (tinted) {
    return (
      <button onClick={onClick} style={{
        ...base, background: 'rgba(99,102,241,0.07)', color: '#818cf8',
        border: '1px solid rgba(99,102,241,0.25)',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.14)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.07)'}
      >{icon} {label}</button>
    );
  }
  if (danger) {
    return (
      <button onClick={onClick} style={{
        ...base, background: 'rgba(239,68,68,0.06)', color: '#f87171',
        border: '1px solid rgba(239,68,68,0.22)',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.13)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
      >{icon} {label}</button>
    );
  }
  return (
    <button onClick={onClick} style={{
      ...base, background: 'rgba(255,255,255,0.04)', color: '#e2e8f0',
      border: '1px solid rgba(255,255,255,0.1)',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
    >{icon} {label}</button>
  );
}

/* ─────────────────────────────────────────────
   Main Orders Dashboard modal
───────────────────────────────────────────────*/
export default function OrdersDashboard() {
  const { user, orders, setShowOrders, setTrackOrder, showToast } = useApp();
  const [confirm, setConfirm] = useState(null);
  const [contactOrder, setContactOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  if (!user) return null;

  const safeOrders = Array.isArray(orders) ? orders : [];

  const confirmCancel = () => {
    showToast(`Order ${confirm?.id ?? ''} cancellation requested.`);
    setConfirm(null);
  };

  return (
    <>
      {/* Backdrop */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          background: 'rgba(13,17,32,0.99)',
          border: '1px solid rgba(108,99,255,0.18)',
          borderRadius: 22, width: '100%', maxWidth: 860,
          maxHeight: '92vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
          animation: 'fadeInUp 0.3s ease',
        }}>
          {/* ─── Header ─── */}
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(108,99,255,0.06) 0%, transparent 100%)',
            borderRadius: '22px 22px 0 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                padding: '0.55rem', background: 'rgba(108,99,255,0.12)',
                borderRadius: 12, border: '1px solid rgba(108,99,255,0.2)'
              }}>
                <Package size={22} color="#818cf8" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2 }}>My Orders</h2>
                <p style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.1rem' }}>
                  {safeOrders.length} order{safeOrders.length !== 1 ? 's' : ''} in total
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowOrders(false)}
              style={{
                width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: 'rgba(255,255,255,0.06)', color: '#94a3b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* ─── Scrollable content ─── */}
          <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
            {safeOrders.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {safeOrders.map((order, idx) => (
                  <OrderCard
                    key={order?.id ?? idx}
                    order={order}
                    onTrack={o => setTrackOrder(o)}
                    onInvoice={o => setInvoiceOrder(o)}
                    onContact={o => setContactOrder(o)}
                    onCancel={o => setConfirm(o)}
                  />
                ))}
              </div>
            ) : (
              <EmptyOrders onClose={() => setShowOrders(false)} />
            )}
          </div>
        </div>
      </div>

      {/* Sub-modals */}
      {confirm && (
        <ConfirmDialog
          title="Cancel / Return Order"
          message={`Are you sure you want to cancel order ${confirm?.id ?? ''}? A refund will be initiated within 5–7 business days.`}
          onConfirm={confirmCancel}
          onCancel={() => setConfirm(null)}
        />
      )}
      {contactOrder && <ContactSellerModal order={contactOrder} onClose={() => setContactOrder(null)} />}
      {invoiceOrder && <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />}
    </>
  );
}
