import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import BookCard from './BookCard';
import { useApp } from '../context';
import { BOOKS, CATEGORIES, CONDITIONS } from '../data';

export default function SearchPage() {
  const { books: userBooks, searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useApp();
  const [condition, setCondition] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);

  const allBooks = useMemo(() => [...userBooks, ...BOOKS], [userBooks]);

  const filtered = useMemo(() => {
    let result = allBooks;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q)
      );
    }

    if (activeCategory !== 'All') {
      result = result.filter(b => b.genre === activeCategory);
    }

    if (condition !== 'All') {
      result = result.filter(b => b.condition === condition);
    }

    result = result.filter(b => b.price >= priceRange[0] && b.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-asc': return [...result].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...result].sort((a, b) => b.price - a.price);
      case 'rating': return [...result].sort((a, b) => b.rating - a.rating);
      default: return result;
    }
  }, [allBooks, searchQuery, activeCategory, condition, priceRange, sortBy]);

  const clearFilters = () => {
    setActiveCategory('All');
    setCondition('All');
    setPriceRange([0, 2000]);
    setSortBy('recent');
    setSearchQuery('');
  };

  const hasFilters = activeCategory !== 'All' || condition !== 'All' || searchQuery || sortBy !== 'recent';

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '1.5rem 1.25rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.3rem' }}>
          {searchQuery ? `Results for "${searchQuery}"` : 'Browse All Books'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          {filtered.length} book{filtered.length !== 1 ? 's' : ''} found
          {hasFilters && (
            <button onClick={clearFilters} style={{ marginLeft: '0.75rem', color: '#6c63ff', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
              Clear filters ×
            </button>
          )}
        </p>
      </div>

      {/* Category chips */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* Sort */}
        <div style={{ position: 'relative' }}>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="input-field"
            style={{ paddingRight: '2rem', fontSize: '0.85rem', padding: '0.55rem 2rem 0.55rem 0.85rem', appearance: 'none', minWidth: 150 }}
          >
            <option value="recent">Most Recent</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
        </div>

        {/* Condition filter */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['All', ...CONDITIONS].map(c => (
            <button
              key={c}
              onClick={() => setCondition(c)}
              style={{
                padding: '0.45rem 0.85rem', borderRadius: 8, border: '1.5px solid',
                borderColor: condition === c ? '#6c63ff' : 'rgba(255,255,255,0.08)',
                background: condition === c ? 'rgba(108,99,255,0.12)' : 'transparent',
                color: condition === c ? '#818cf8' : '#64748b',
                cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s'
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.25rem'
        }}>
          {filtered.map(book => <BookCard key={book.id} book={book} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <h3 style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem' }}>No books found</h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
        </div>
      )}
    </div>
  );
}
