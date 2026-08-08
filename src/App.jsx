import React from 'react';
import { AppProvider, useApp } from './context';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import BookDetailsPage from './components/BookDetailsPage';
import AuthModal from './components/AuthModal';
import SellModal from './components/SellModal';
import CheckoutModal from './components/CheckoutModal';
import ProfileModal from './components/ProfileModal';
import OrdersDashboard from './components/OrdersDashboard';
import TrackShipmentModal from './components/TrackShipmentModal';
import StaticInfoModal from './components/StaticInfoModal';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import { CheckCircle } from 'lucide-react';

/* Per-modal error boundary — if one modal crashes, only IT shows
   an error panel; the rest of the app stays alive. */
class ModalErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { err: null }; }
  static getDerivedStateFromError(e) { return { err: e }; }
  componentDidCatch(e) { console.error('[ModalErrorBoundary]', e); }
  render() {
    if (this.state.err) {
      return (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            background: '#111827', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 18, padding: '2rem', maxWidth: 400, width: '100%',
            textAlign: 'center', fontFamily: 'Inter, sans-serif'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ color: '#f1f5f9', fontWeight: 700, marginBottom: '0.5rem' }}>
              Something went wrong
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              This panel couldn't load. Your data is safe — please try again.
            </p>
            <button
              onClick={() => this.setState({ err: null })}
              style={{
                background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', color: 'white',
                border: 'none', borderRadius: 10, padding: '0.7rem 1.8rem',
                fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem'
              }}
            >
              Close
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className="toast">
      <CheckCircle size={20} color="#10b981" />
      <span style={{ color: '#f1f5f9', fontSize: '0.9rem', fontWeight: 500 }}>{toast.msg}</span>
    </div>
  );
}

function AppInner() {
  const {
    page, showAuth, showSell, checkoutBook,
    showProfile, showOrders, trackOrder, staticPage, showCart
  } = useApp();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        {page === 'home' && <HomePage />}
        {page === 'search' && <SearchPage />}
        {page === 'book' && <BookDetailsPage />}
      </main>

      {page !== 'book' && <Footer />}

      {/* Modals — each has its own error boundary so one crash
          cannot blank-screen the entire app */}
      <ModalErrorBoundary key="auth">{showAuth && <AuthModal />}</ModalErrorBoundary>
      <ModalErrorBoundary key="sell">{showSell && <SellModal />}</ModalErrorBoundary>
      <ModalErrorBoundary key="checkout">{checkoutBook && <CheckoutModal />}</ModalErrorBoundary>
      <ModalErrorBoundary key="profile">{showProfile && <ProfileModal />}</ModalErrorBoundary>
      <ModalErrorBoundary key="orders">{showOrders && <OrdersDashboard />}</ModalErrorBoundary>
      <ModalErrorBoundary key="track">{trackOrder && <TrackShipmentModal />}</ModalErrorBoundary>
      <ModalErrorBoundary key="static">{staticPage && <StaticInfoModal />}</ModalErrorBoundary>
      <ModalErrorBoundary key="cart">{showCart && <CartDrawer />}</ModalErrorBoundary>

      {/* Toast */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
