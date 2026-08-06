import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [showAuth, setShowAuth] = useState(false);
  const [showSell, setShowSell] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [checkoutBook, setCheckoutBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState('home'); // 'home' | 'search' | 'book'

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const login = (userData) => {
    setUser(userData);
    setShowAuth(false);
    showToast(`Welcome back, ${userData.name}! 🎉`);
  };

  const logout = () => {
    setUser(null);
    showToast('You have been logged out.', 'info');
  };

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
      user, login, logout,
      books, addBook,
      showAuth, setShowAuth,
      showSell, setShowSell,
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

export const useApp = () => useContext(AppContext);
