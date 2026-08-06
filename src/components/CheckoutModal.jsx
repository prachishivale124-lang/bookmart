import React, { useState } from 'react';
import { X, ShoppingBag, CreditCard, Truck, CheckCircle, Loader, Smartphone } from 'lucide-react';
import { useApp } from '../context';
import { getConditionClass } from '../data';

export default function CheckoutModal() {
  const { checkoutBook, setCheckoutBook, showToast, user } = useApp();
  const book = checkoutBook;

  const [payMethod, setPayMethod] = useState('upi');
  const [upiProvider, setUpiProvider] = useState('gpay');
  const [upiId, setUpiId] = useState('');
  const [address, setAddress] = useState({ name: user?.name || '', phone: user?.phone || '', address: '', city: '', pincode: '' });
  const [step, setStep] = useState(1); // 1: payment, 2: address, 3: success
  const [loading, setLoading] = useState(false);

  if (!book) return null;

  const condClass = getConditionClass(book.condition);
  const deliveryFee = payMethod === 'cod' ? 49 : 0;
  const total = book.price + deliveryFee;

  const upiProviders = [
    { id: 'gpay', label: 'Google Pay', color: '#4285f4', icon: '🔵' },
    { id: 'phonepe', label: 'PhonePe', color: '#5f259f', icon: '🟣' },
    { id: 'paytm', label: 'Paytm', color: '#00baf2', icon: '🔷' },
    { id: 'upi', label: 'UPI ID', color: '#ff6b35', icon: '📱' },
  ];

  const setAddr = (k) => (e) => setAddress(a => ({ ...a, [k]: e.target.value }));

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  const handleDone = () => {
    setCheckoutBook(null);
    showToast('Order placed successfully! 🎉 Seller will contact you soon.', 'success');
  };

  return (
    <div className="overlay" onClick={() => setCheckoutBook(null)} style={{ alignItems: 'flex-start', paddingTop: '2rem' }}>
      <div className="modal-content" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '1.5rem 1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="#6c63ff" />
            {step < 3 ? 'Checkout' : 'Order Placed!'}
          </h2>
          <button onClick={() => setCheckoutBook(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
          {step === 3 ? (
            /* Success Step */
            <div style={{ textAlign: 'center', padding: '1rem 0 0.5rem' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'rgba(16,185,129,0.15)', border: '2px solid #10b981',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <CheckCircle size={40} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.5rem' }}>Order Confirmed! 🎉</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Your order for <strong style={{ color: '#f1f5f9' }}>{book.title}</strong> has been placed successfully.
                The seller <strong style={{ color: '#818cf8' }}>{book.seller.name}</strong> will contact you shortly.
              </p>

              <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Payment Method</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>{payMethod === 'cod' ? 'Cash on Delivery' : 'UPI Payment'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Amount</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>₹{total}</span>
                </div>
              </div>

              <button onClick={handleDone} className="btn-primary" style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem' }}>
                Back to Home
              </button>
            </div>
          ) : (
            <>
              {/* Order Summary */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.85rem' }}>
                <img
                  src={book.images[0]}
                  alt={book.title}
                  style={{ width: 64, height: 80, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                  onError={e => { e.target.src = 'https://via.placeholder.com/64x80/1a2235/6c63ff?text=Book'; }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9', marginBottom: '0.2rem' }}>{book.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem' }}>by {book.author}</p>
                  <span className={`badge ${condClass}`}>{book.condition}</span>
                  <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Seller: {book.seller.name}</span>
                    <span style={{ fontWeight: 800, color: '#10b981', fontSize: '1rem' }}>₹{book.price}</span>
                  </div>
                </div>
              </div>

              {/* Price breakdown */}
              <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Book Price</span>
                  <span style={{ fontSize: '0.85rem', color: '#f1f5f9', fontWeight: 600 }}>₹{book.price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Delivery Fee</span>
                  <span style={{ fontSize: '0.85rem', color: deliveryFee === 0 ? '#10b981' : '#f1f5f9', fontWeight: 600 }}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0.4rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>Total</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>₹{total}</span>
                </div>
              </div>

              {step === 1 && (
                <>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
                    Select Payment Method
                  </p>

                  {/* Payment Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                    {/* UPI */}
                    <div
                      className={`payment-option ${payMethod === 'upi' ? 'selected' : ''}`}
                      onClick={() => setPayMethod('upi')}
                    >
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', border: '2px solid',
                        borderColor: payMethod === 'upi' ? '#6c63ff' : '#374151',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        {payMethod === 'upi' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6c63ff' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9rem' }}>UPI / Online Payment</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>GPay, PhonePe, Paytm, UPI ID</div>
                      </div>
                      <Smartphone size={18} color="#6c63ff" />
                    </div>

                    {/* COD */}
                    <div
                      className={`payment-option ${payMethod === 'cod' ? 'selected' : ''}`}
                      onClick={() => setPayMethod('cod')}
                    >
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', border: '2px solid',
                        borderColor: payMethod === 'cod' ? '#6c63ff' : '#374151',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        {payMethod === 'cod' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6c63ff' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9rem' }}>Cash on Delivery</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>+₹49 delivery charge</div>
                      </div>
                      <Truck size={18} color="#10b981" />
                    </div>
                  </div>

                  {/* UPI Sub-options */}
                  {payMethod === 'upi' && (
                    <div style={{ marginBottom: '1.25rem', padding: '1rem', background: 'rgba(108,99,255,0.05)', borderRadius: 12, border: '1px solid rgba(108,99,255,0.15)' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.75rem' }}>Choose UPI Option</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        {upiProviders.map(p => (
                          <button
                            key={p.id} type="button"
                            onClick={() => setUpiProvider(p.id)}
                            style={{
                              padding: '0.6rem 0.75rem', borderRadius: 9, border: '1.5px solid',
                              borderColor: upiProvider === p.id ? '#6c63ff' : 'rgba(255,255,255,0.08)',
                              background: upiProvider === p.id ? 'rgba(108,99,255,0.12)' : 'rgba(255,255,255,0.03)',
                              color: upiProvider === p.id ? '#818cf8' : '#94a3b8',
                              cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                              display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s'
                            }}
                          >
                            {p.icon} {p.label}
                          </button>
                        ))}
                      </div>

                      {upiProvider === 'upi' ? (
                        <div>
                          <label className="label">Enter UPI ID</label>
                          <input
                            className="input-field"
                            placeholder="yourname@upi"
                            value={upiId}
                            onChange={e => setUpiId(e.target.value)}
                          />
                        </div>
                      ) : (
                        /* Mock QR Code */
                        <div style={{ textAlign: 'center' }}>
                          <div style={{
                            width: 140, height: 140, margin: '0 auto',
                            background: 'white', borderRadius: 12, padding: 8,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <svg width="124" height="124" viewBox="0 0 124 124">
                              {/* QR code pattern (decorative) */}
                              <rect width="124" height="124" fill="white"/>
                              {[0,1,2,3,4,5,6].map(r => [0,1,2,3,4,5,6].map(c => {
                                const pattern = [[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,1,1,1,0,1],[1,0,1,0,1,0,1],[1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]];
                                return pattern[r][c] ? <rect key={`${r}-${c}`} x={4+c*8} y={4+r*8} width={7} height={7} fill="#1a1a2e"/> : null;
                              }))}
                              {[0,1,2,3,4,5,6].map(r => [0,1,2,3,4,5,6].map(c => {
                                const pattern = [[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,1,1,1,0,1],[1,0,1,0,1,0,1],[1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]];
                                return pattern[r][c] ? <rect key={`br-${r}-${c}`} x={64+c*8} y={64+r*8} width={7} height={7} fill="#1a1a2e"/> : null;
                              }))}
                              {[0,1,2,3,4,5,6].map(r => [0,1,2,3,4,5,6].map(c => {
                                const pattern = [[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,1,1,1,0,1],[1,0,1,0,1,0,1],[1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]];
                                return pattern[r][c] ? <rect key={`bl-${r}-${c}`} x={4+c*8} y={64+r*8} width={7} height={7} fill="#1a1a2e"/> : null;
                              }))}
                              {/* Random data dots */}
                              {Array.from({length: 30}, (_, i) => (
                                <rect key={`d-${i}`} x={20 + (i%6)*10} y={20 + Math.floor(i/6)*10} width={5} height={5} fill={Math.random() > 0.4 ? '#1a1a2e' : 'white'} />
                              ))}
                              <text x="62" y="115" textAnchor="middle" fontSize="9" fill="#6c63ff" fontWeight="bold">₹{book.price}</text>
                            </svg>
                          </div>
                          <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.6rem' }}>Scan with {upiProviders.find(p => p.id === upiProvider)?.label}</p>
                          <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', marginTop: '0.2rem' }}>bookmart@oksbi</p>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => setStep(2)}
                    className="btn-success"
                    disabled={payMethod === 'upi' && upiProvider === 'upi' && !upiId}
                  >
                    Continue to Delivery →
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
                    Delivery Address
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                      <div>
                        <label className="label">Full Name</label>
                        <input className="input-field" placeholder="Your name" value={address.name} onChange={setAddr('name')} />
                      </div>
                      <div>
                        <label className="label">Phone</label>
                        <input className="input-field" placeholder="10-digit" value={address.phone} onChange={setAddr('phone')} />
                      </div>
                    </div>
                    <div>
                      <label className="label">Street Address</label>
                      <input className="input-field" placeholder="House no., Street, Area" value={address.address} onChange={setAddr('address')} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                      <div>
                        <label className="label">City</label>
                        <input className="input-field" placeholder="City" value={address.city} onChange={setAddr('city')} />
                      </div>
                      <div>
                        <label className="label">PIN Code</label>
                        <input className="input-field" placeholder="6-digit PIN" value={address.pincode} onChange={setAddr('pincode')} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1 }}>
                      ← Back
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="btn-success"
                      style={{ flex: 2 }}
                      disabled={!address.name || !address.address || !address.city || !address.pincode}
                    >
                      {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Confirming...</> : `✅ Confirm Order · ₹${total}`}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
