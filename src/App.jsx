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
import { CheckCircle, Info } from 'lucide-react';

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

      {/* Modals */}
      {showAuth && <AuthModal />}
      {showSell && <SellModal />}
      {checkoutBook && <CheckoutModal />}
      {showProfile && <ProfileModal />}
      {showOrders && <OrdersDashboard />}
      {trackOrder && <TrackShipmentModal />}
      {staticPage && <StaticInfoModal />}
      {showCart && <CartDrawer />}

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
