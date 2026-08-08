import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bookmart_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      // Ensure the user object has at minimum a name field
      if (!parsed || typeof parsed !== 'object') { localStorage.removeItem('bookmart_user'); return null; }
      return parsed;
    } catch (e) {
      localStorage.removeItem('bookmart_user');
      return null;
    }
  });
  
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('bookmart_orders');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      localStorage.removeItem('bookmart_orders');
      return [];
    }
  });

  const [books, setBooks] = useState([]);
  const [showAuth, setShowAuth] = useState(false);
  const [showSell, setShowSell] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState([]);
  const [trackOrder, setTrackOrder] = useState(null);
  const [staticPage, setStaticPage] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [checkoutBook, setCheckoutBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState('home');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const login = (userData) => {
    const fullUserData = {
      ...userData,
      joinedDate: new Date().toISOString(),
      savedPaymentMethods: [],
      listedBooks: []
    };
    setUser(fullUserData);
    localStorage.setItem('bookmart_user', JSON.stringify(fullUserData));
    
    // Add mock orders for demo if none exist
    if (orders.length === 0) {
      const mockOrders = [
        {
          id: 'ORD-8X9A21',
          date: new Date(Date.now() - 86400000 * 3).toISOString(),
          items: [
            {
              id: 9901,
              title: 'The Psychology of Money',
              seller: { name: 'Ramesh K.' },
              price: 299,
              qty: 1,
              images: ['https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=400&q=80']
            }
          ],
          totalAmount: 299,
          paymentStatus: 'Paid',
          orderStatus: 'Shipped',
          shippingAddress: { name: userData.name || 'You', address: '123 Main St', city: 'Mumbai', pincode: '400001', phone: userData.phone || '' },
          carrier: 'Delhivery',
          awb: 'AWB-56781234'
        }
      ];
      setOrders(mockOrders);
      localStorage.setItem('bookmart_orders', JSON.stringify(mockOrders));
    }
    
    setShowAuth(false);
    showToast(`Welcome back, ${userData?.name ?? 'there'}! 🎉`);
  };

  const updateUser = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('bookmart_user', JSON.stringify(updated));
    showToast('Profile updated successfully! ✅');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bookmart_user');
    showToast('You have been logged out.', 'info');
  };

  const addOrder = (order) => {
    const newOrder = {
      id: `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      date: new Date().toISOString(),
      // New consolidated structure
      items: order.items || [],
      totalAmount: order.totalAmount || 0,
      paymentStatus: order.paymentStatus || 'Processing',
      orderStatus: order.orderStatus || 'Processing',
      shippingAddress: order.shippingAddress || null,
      paymentId: order.paymentId || null,
      carrier: 'Delhivery',
      awb: `AWB-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };
    const newOrders = [newOrder, ...orders];
    setOrders(newOrders);
    localStorage.setItem('bookmart_orders', JSON.stringify(newOrders));
    return newOrder;
  };

  const addToCart = (book) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === book.id);
      if (existing) {
        showToast(`Qty updated for "${book.title}"`);
        return prev.map(i => i.id === book.id ? { ...i, qty: i.qty + 1 } : i);
      }
      showToast(`"${book.title}" added to cart 🛒`);
      return [...prev, { ...book, qty: 1 }];
    });
  };

  const removeFromCart = (bookId) => {
    setCart(prev => prev.filter(i => i.id !== bookId));
  };

  const updateCartQty = (bookId, delta) => {
    setCart(prev => prev
      .map(i => i.id === bookId ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );
  };

  const clearCart = () => setCart([]);

  const addBook = (book) => {
    const newBook = {
      ...book,
      id: Date.now(),
      rating: 5.0,
      reviews: 0,
      postedAt: 'Just now',
      seller: {
        name: user?.name || 'You',
        avatar: (user?.name || 'Y').slice(0, 2).toUpperCase(),
        city: user?.city || 'India',
        rating: 5.0,
        sales: 0
      }
    };
    setBooks(prev => [newBook, ...prev]);
    showToast('Your book has been listed! 📚');
    setShowSell(false);
  };

  const openBook = (book) => {
    setSelectedBook(book);
    setPage('book');
  };

  const goHome = () => {
    setSelectedBook(null);
    setPage('home');
    setSearchQuery('');
    setActiveCategory('All');
  };

  const goSearch = (q = '') => {
    setSearchQuery(q);
    setPage('search');
    setSelectedBook(null);
  };

  return (
    <AppContext.Provider value={{
      user, login, logout, updateUser,
      books, addBook,
      orders, addOrder,
      cart, addToCart, removeFromCart, updateCartQty, clearCart,
      showAuth, setShowAuth,
      showSell, setShowSell,
      showProfile, setShowProfile,
      showOrders, setShowOrders,
      showCart, setShowCart,
      trackOrder, setTrackOrder,
      staticPage, setStaticPage,
      selectedBook, setSelectedBook,
      checkoutBook, setCheckoutBook,
      searchQuery, setSearchQuery,
      activeCategory, setActiveCategory,
      toast, showToast,
      page, setPage,
      openBook, goHome, goSearch
    }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext);
