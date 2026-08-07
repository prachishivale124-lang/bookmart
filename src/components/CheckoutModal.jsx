import React, { useState } from 'react';
import { X, ShoppingBag, Truck, CheckCircle, Loader, Smartphone } from 'lucide-react';
import { useApp } from '../context';

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutModal() {
  const { checkoutBook: items, setCheckoutBook, showToast, user, addOrder, clearCart, cart } = useApp();

  const [payMethod, setPayMethod] = useState('upi');
  const [address, setAddress] = useState({ name: user?.name || '', phone: user?.phone || '', address: '', city: '', pincode: '' });
  const [step, setStep] = useState(1); // 1: payment, 2: address, 3: success
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState(null);

  if (!items || items.length === 0) return null;

  const subtotal = items.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  const deliveryFee = payMethod === 'cod' ? 49 : 0;
  const total = subtotal + deliveryFee;

  const isCartCheckout = cart.length > 0 && cart.length === items.length && items.every((it, i) => it.id === cart[i]?.id);
  const displayTitle = items.length === 1 ? items[0].title : `${items.length} items from your cart`;
  const displaySeller = items.length === 1 ? (items[0].seller?.name || items[0].seller) : 'Multiple Sellers';

  const setAddr = (k) => (e) => setAddress(a => ({ ...a, [k]: e.target.value }));

  const processOrder = (status, pid = null) => {
    items.forEach(item => {
      addOrder({
        ...item,
        price: item.price * (item.qty || 1),
        status: status,
        paymentId: pid,
        date: new Date().toISOString()
      });
    });

    if (isCartCheckout) {
      clearCart();
    }

    setPaymentId(pid);
    setStep(3);
  };

  const handleConfirm = async () => {
    if (payMethod === 'cod') {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        processOrder('Processing');
        showToast('Order placed successfully! 🎉', 'success');
      }, 1500);
      return;
    }

    setLoading(true);
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      showToast('Razorpay SDK failed to load. Are you online?', 'error');
      setLoading(false);
      return;
    }

    const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    console.log("Razorpay Key:", rzpKey);
    if (!rzpKey) {
      console.warn('VITE_RAZORPAY_KEY_ID is missing from environment variables! Using fallback test key.');
    }

    try {
      const options = {
        key: rzpKey || 'rzp_test_TMx3mZonMbpt6P',
        amount: parseInt(Math.round(Number(total) * 100)), // strictly integer in paise
        currency: 'INR',
        name: 'BookMart',
        description: `Purchase Order #ORD-${Date.now()}`,
        prefill: {
          name: address.name || user.name,
          email: user.email || 'user@example.com',
          contact: address.phone || user.phone || '9999999999'
        },
        theme: {
          color: '#8B5CF6'
        },
        handler: function (response) {
          if (!response.razorpay_payment_id) {
             console.error('Payment handler returned without a payment ID!', response);
             showToast('Payment failed. Please try again.', 'error');
             setLoading(false);
             return;
          }
          setLoading(false);
          processOrder('Processing', response.razorpay_payment_id);
          showToast(`Payment successful! Ref: ${response.razorpay_payment_id}`, 'success');
        },
        modal: {
          ondismiss: function() {
            console.log('Razorpay modal dismissed by the user.');
            setLoading(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        console.error("Razorpay Error:", response.error);
        showToast(`Payment failed: ${response.error.description}`, 'error');
        setLoading(false);
      });

      paymentObject.open();

    } catch (error) {
      console.error('Failed to initialize Razorpay:', error);
      showToast('Payment system error. Please try again later.', 'error');
      setLoading(false);
    }
  };

  const handleDone = () => {
    setCheckoutBook(null);
  };

  return (
    <div className="modal-overlay" onClick={() => setCheckoutBook(null)} style={{ alignItems: 'flex-start', paddingTop: '2rem' }}>
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
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Your order for <strong style={{ color: '#f1f5f9' }}>{displayTitle}</strong> has been placed successfully.
              </p>

              <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Payment Method</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>{payMethod === 'cod' ? 'Cash on Delivery' : 'Online / UPI'}</span>
                </div>
                {paymentId && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Transaction ID</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', fontFamily: 'monospace' }}>{paymentId}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(16,185,129,0.2)' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Total Amount</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>₹{total}</span>
                </div>
              </div>

              <button onClick={handleDone} className="btn-primary" style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}>
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Order Summary */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.85rem' }}>
                {items.length === 1 ? (
                  <img
                    src={items[0].images?.[0]}
                    alt={items[0].title}
                    style={{ width: 56, height: 72, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                    onError={e => { e.target.src = 'https://via.placeholder.com/56x72/1a2235/6c63ff?text=Book'; }}
                  />
                ) : (
                  <div style={{ width: 56, height: 72, borderRadius: 8, background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBag size={24} color="#818cf8" />
                  </div>
                )}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9', marginBottom: '0.2rem' }}>{displayTitle}</h3>
                  <div style={{ marginTop: '0.3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Seller: <span style={{ color: '#cbd5e1' }}>{displaySeller}</span></span>
                  </div>
                </div>
              </div>

              {/* Price breakdown */}
              <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Items Subtotal</span>
                  <span style={{ fontSize: '0.85rem', color: '#f1f5f9', fontWeight: 600 }}>₹{subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Delivery Fee</span>
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
                    {/* UPI/Online */}
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
                        <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9rem' }}>UPI / Card / NetBanking</div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Pay instantly via Razorpay</div>
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
                        borderColor: payMethod === 'cod' ? '#10b981' : '#374151',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        {payMethod === 'cod' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9rem' }}>Cash on Delivery</div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>+₹49 delivery charge</div>
                      </div>
                      <Truck size={18} color="#10b981" />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="btn-success"
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
                    <button onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1, padding: '0.75rem' }} disabled={loading}>
                      ← Back
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="btn-success"
                      style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      disabled={!address.name || !address.address || !address.city || !address.pincode || loading}
                    >
                      {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> : `Confirm & Pay ₹${total}`}
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
