import React, { useState } from 'react';
import {
  X, Package, Clock, Truck, CheckCircle, ChevronRight,
  Search, BookOpen, Download, MessageCircle, XCircle, Printer
} from 'lucide-react';
import { useApp } from '../context';

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
        boxShadow: '0 25px 60px rgba(0,0,0,0.7)'
      }}>
        <h3 style={{ color: '#f1f5f9', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>{title}</h3>
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

function ContactSellerModal({ order, onClose }) {
  const [msg, setMsg] = useState(`Hi, I'm writing regarding my order ${order.id} for "${order.title}". `);
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
        boxShadow: '0 25px 60px rgba(0,0,0,0.7)', overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(16,185,129,0.05))',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.1rem' }}>Contact Seller</h3>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Re: {order.id} — <span style={{ color: '#cbd5e1' }}>{order.seller}</span></div>
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
              lineHeight: 1.6, marginBottom: '1.25rem',
              transition: 'border-color 0.2s'
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

function InvoiceModal({ order, onClose }) {
  const invoiceDate = new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10001,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, maxWidth: 520, width: '100%',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.7)'
      }}>
        {/* Invoice content - white background for printing */}
        <div style={{ padding: '2rem', color: '#111' }} id="invoice-print">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '2px solid #6c63ff', paddingBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#6c63ff' }}>BookMart</div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>India's Book Exchange Platform</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>INVOICE</div>
              <div style={{ fontSize: '0.85rem', color: '#555' }}>{order.id}</div>
              <div style={{ fontSize: '0.8rem', color: '#777' }}>{invoiceDate}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '0.3rem', color: '#555' }}>BILLED TO</div>
              <div style={{ fontWeight: 700 }}>Customer</div>
              <div style={{ color: '#666' }}>BookMart Member</div>
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '0.3rem', color: '#555' }}>SELLER</div>
              <div style={{ fontWeight: 700 }}>{order.seller}</div>
              <div style={{ color: '#666' }}>Verified Seller</div>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 600, color: '#555' }}>Item</th>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 600, color: '#555' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>{order.title}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{order.price}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.75rem', color: '#666' }}>Shipping Charges</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', color: '#10b981', fontWeight: 600 }}>FREE</td>
              </tr>
              <tr style={{ background: '#f9fafb' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700 }}>TOTAL</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 800, color: '#6c63ff', fontSize: '1.05rem' }}>₹{order.price}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ textAlign: 'center', color: '#999', fontSize: '0.78rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
            Thank you for using BookMart! For support: support@bookmart.in
          </div>
        </div>

        {/* Action buttons - outside print area */}
        <div style={{ padding: '1rem 2rem 1.5rem', display: 'flex', gap: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '0.7rem', borderRadius: 10, border: '1px solid #e5e7eb',
            background: 'none', color: '#555', cursor: 'pointer', fontWeight: 600
          }}>Close</button>
          <button onClick={handlePrint} style={{
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

export default function OrdersDashboard() {
  const { user, orders, setShowOrders, setTrackOrder, showToast } = useApp();
  const [confirm, setConfirm] = useState(null); // order to cancel
  const [contactOrder, setContactOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  if (!user) return null;

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Processing': return { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', icon: <Clock size={13} /> };
      case 'Shipped':    return { bg: 'rgba(56,189,248,0.15)',  text: '#38bdf8', icon: <Package size={13} /> };
      case 'Out for Delivery': return { bg: 'rgba(192,132,252,0.15)', text: '#c084fc', icon: <Truck size={13} /> };
      case 'Delivered':  return { bg: 'rgba(16,185,129,0.15)', text: '#10b981', icon: <CheckCircle size={13} /> };
      default: return { bg: 'rgba(255,255,255,0.08)', text: '#94a3b8', icon: <Clock size={13} /> };
    }
  };

  const handleCancel = (order) => {
    setConfirm(order);
  };

  const confirmCancel = () => {
    showToast(`Order ${confirm.id} cancellation requested.`);
    setConfirm(null);
  };

  return (
    <>
      {/* Main modal */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          background: 'rgba(20,26,45,0.99)', border: '1px solid rgba(108,99,255,0.2)',
          borderRadius: 22, width: '100%', maxWidth: 820,
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 30px 80px rgba(0,0,0,0.7)'
        }}>
          {/* Header */}
          <div style={{
            padding: '1.4rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(108,99,255,0.12)', borderRadius: 10 }}>
                <Package size={22} color="#818cf8" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f1f5f9' }}>My Orders</h2>
                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
              </div>
            </div>
            <button
              onClick={() => setShowOrders(false)}
              style={{
                width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: 'rgba(255,255,255,0.06)', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable content */}
          <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1 }}>
            {orders.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {orders.map(order => {
                  const si = getStatusInfo(order.status);
                  const orderDate = new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

                  return (
                    <div key={order.id} style={{
                      background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 18, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem'
                    }}>
                      {/* Top row: meta + status */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                          <div>
                            <div style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Order ID</div>
                            <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.88rem', fontFamily: 'monospace' }}>{order.id}</div>
                          </div>
                          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.08)' }} />
                          <div>
                            <div style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Placed</div>
                            <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.88rem' }}>{orderDate}</div>
                          </div>
                        </div>
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                          background: si.bg, color: si.text,
                          padding: '0.3rem 0.85rem', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700
                        }}>
                          {si.icon} {order.status}
                        </div>
                      </div>

                      {/* Book info row */}
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div style={{ width: 58, height: 82, borderRadius: 9, overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>
                          {order.thumbnail
                            ? <img src={order.thumbnail} alt={order.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <div style={{ width: '100%', height: '100%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={22} color="#64748b" /></div>
                          }
                        </div>
                        <div style={{ flex: 1, minWidth: 160 }}>
                          <h3 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.2rem', lineHeight: 1.3 }}>{order.title}</h3>
                          <p style={{ color: '#94a3b8', fontSize: '0.83rem', marginBottom: '0.4rem' }}>Sold by: <span style={{ color: '#cbd5e1' }}>{order.seller}</span></p>
                          <div style={{ fontWeight: 800, color: '#10b981', fontSize: '1.05rem' }}>₹{order.price}</div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                        <button
                          onClick={() => setTrackOrder(order)}
                          className="btn-primary"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', fontSize: '0.82rem', borderRadius: 10 }}
                        >
                          <Truck size={14} /> Track Shipment
                        </button>
                        <button
                          onClick={() => setInvoiceOrder(order)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem',
                            fontSize: '0.82rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)',
                            background: 'rgba(255,255,255,0.04)', color: '#e2e8f0', cursor: 'pointer', fontWeight: 600,
                            transition: 'background 0.15s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                        >
                          <Download size={14} /> Invoice
                        </button>
                        <button
                          onClick={() => setContactOrder(order)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem',
                            fontSize: '0.82rem', borderRadius: 10, border: '1px solid rgba(99,102,241,0.3)',
                            background: 'rgba(99,102,241,0.07)', color: '#818cf8', cursor: 'pointer', fontWeight: 600,
                            transition: 'background 0.15s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.07)'}
                        >
                          <MessageCircle size={14} /> Contact Seller
                        </button>
                        {order.status !== 'Delivered' && (
                          <button
                            onClick={() => handleCancel(order)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem',
                              fontSize: '0.82rem', borderRadius: 10, border: '1px solid rgba(239,68,68,0.25)',
                              background: 'rgba(239,68,68,0.06)', color: '#f87171', cursor: 'pointer', fontWeight: 600,
                              transition: 'background 0.15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                          >
                            <XCircle size={14} /> Cancel / Return
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <Search size={32} color="#64748b" />
                </div>
                <h3 style={{ color: '#f1f5f9', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No orders yet</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: 280 }}>Start exploring books and place your first order!</p>
                <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setShowOrders(false)}>Browse Books</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-modals */}
      {confirm && <ConfirmDialog
        title="Cancel / Return Order"
        message={`Are you sure you want to cancel your order ${confirm.id} for "${confirm.title}"? A refund will be initiated within 5–7 business days.`}
        onConfirm={confirmCancel}
        onCancel={() => setConfirm(null)}
      />}
      {contactOrder && <ContactSellerModal order={contactOrder} onClose={() => setContactOrder(null)} />}
      {invoiceOrder && <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />}
    </>
  );
}
