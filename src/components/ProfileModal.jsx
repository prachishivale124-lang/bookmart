import React, { useState } from 'react';
import {
  X, User, MapPin, Calendar, BookOpen, Package,
  Phone, Mail, Edit3, Save, LogOut, ChevronRight, Shield
} from 'lucide-react';
import { useApp } from '../context';
import BookCard from './BookCard';

/* ─── Avatar ─────────────────────────────── */
function Avatar({ name, size = 80 }) {
  const initials = (name && name.trim())
    ? name.trim().slice(0, 2).toUpperCase()
    : '??';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #6c63ff 0%, #10b981 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.3, fontWeight: 800, color: 'white',
      flexShrink: 0,
      boxShadow: '0 8px 24px rgba(108,99,255,0.35)',
      border: '3px solid rgba(255,255,255,0.12)',
      userSelect: 'none',
    }}>
      {initials}
    </div>
  );
}

/* ─── Editable field ─────────────────────── */
function Field({ icon, label, value, onChange, type = 'text', placeholder, readOnly = false, multiline = false }) {
  const [focused, setFocused] = useState(false);
  const sharedStyle = {
    width: '100%',
    background: readOnly ? 'rgba(255,255,255,0.02)' : (focused ? 'rgba(108,99,255,0.06)' : 'rgba(255,255,255,0.04)'),
    border: `1.5px solid ${focused ? 'rgba(108,99,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 10, color: readOnly ? '#64748b' : '#f1f5f9',
    padding: '0.7rem 0.9rem 0.7rem 2.6rem',
    fontSize: '0.9rem', fontFamily: 'Inter, sans-serif',
    outline: 'none', transition: 'all 0.2s',
    boxSizing: 'border-box',
    resize: multiline ? 'vertical' : 'none',
    cursor: readOnly ? 'default' : 'text',
  };

  return (
    <div style={{ position: 'relative' }}>
      <label style={{
        display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b',
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem'
      }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: focused ? '#818cf8' : '#475569', transition: 'color 0.2s', pointerEvents: 'none' }}>
          {icon}
        </span>
        {multiline ? (
          <textarea
            value={value ?? ''}
            onChange={onChange}
            placeholder={placeholder}
            rows={2}
            readOnly={readOnly}
            style={{ ...sharedStyle, paddingTop: '0.6rem' }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        ) : (
          <input
            type={type}
            value={value ?? ''}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            style={sharedStyle}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Quick nav card ─────────────────────── */
function QuickCard({ icon, label, sublabel, onClick, color = '#818cf8', danger }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.85rem',
        padding: '0.9rem 1rem', borderRadius: 12, width: '100%',
        background: hov
          ? (danger ? 'rgba(239,68,68,0.08)' : 'rgba(108,99,255,0.08)')
          : 'rgba(255,255,255,0.025)',
        border: `1px solid ${hov
          ? (danger ? 'rgba(239,68,68,0.2)' : 'rgba(108,99,255,0.2)')
          : 'rgba(255,255,255,0.06)'}`,
        cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: danger ? 'rgba(239,68,68,0.1)' : 'rgba(108,99,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {React.cloneElement(icon, { size: 18, color: danger ? '#f87171' : color })}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: danger ? '#f87171' : '#f1f5f9', fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.1rem' }}>{label}</div>
        {sublabel && <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{sublabel}</div>}
      </div>
      <ChevronRight size={15} color="#475569" />
    </button>
  );
}

/* ─── Main ProfileModal ──────────────────── */
export default function ProfileModal() {
  const { user, updateUser, logout, setShowProfile, setShowOrders, books } = useApp();
  const [activeTab, setActiveTab] = useState('details');
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    address: user?.address ?? '',
    city: user?.city ?? '',
  });
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const userListings = books.filter(b => b.seller?.name === (user?.name) || b.seller?.name === 'You');

  const formattedDate = user?.joinedDate
    ? new Date(user.joinedDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'Recently';

  const setField = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      updateUser({ ...form });
      setEditMode(false);
      setSaving(false);
    }, 600);
  };

  const handleLogout = () => {
    logout();
    setShowProfile(false);
  };

  const tabs = [
    { id: 'details', label: 'Profile', icon: <User size={15} /> },
    { id: 'listings', label: `Listings (${userListings.length})`, icon: <BookOpen size={15} /> },
  ];

  return (
    <div className="modal-overlay" onClick={() => setShowProfile(false)}>
      <div
        className="modal-content"
        style={{ maxWidth: 600, padding: 0, overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ─── Hero header ─── */}
        <div style={{
          padding: '1.75rem 1.5rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(108,99,255,0.12) 0%, rgba(16,185,129,0.05) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
        }}>
          <button
            onClick={() => setShowProfile(false)}
            className="close-btn"
            style={{ position: 'absolute', top: '1rem', right: '1rem' }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem', flexWrap: 'wrap' }}>
            <Avatar name={user?.name} size={72} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2 }}>
                  {user?.name || 'BookMart User'}
                </h2>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                  background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
                  color: '#10b981', fontSize: '0.68rem', fontWeight: 700,
                  padding: '0.15rem 0.55rem', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  <Shield size={10} /> Verified
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>
                {user?.email && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Mail size={12} /> {user.email}
                  </span>
                )}
                {user?.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Phone size={12} /> {user.phone}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={12} /> Member since {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Tabs ─── */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setEditMode(false); }}
              style={{
                flex: 1, padding: '0.85rem', background: 'none', border: 'none', cursor: 'pointer',
                color: activeTab === tab.id ? '#818cf8' : '#64748b',
                fontWeight: activeTab === tab.id ? 700 : 500,
                borderBottom: activeTab === tab.id ? '2px solid #818cf8' : '2px solid transparent',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                fontSize: '0.88rem',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Content ─── */}
        <div style={{ maxHeight: '54vh', overflowY: 'auto', padding: '1.25rem 1.5rem' }} className="custom-scrollbar">

          {/* ──── DETAILS TAB ──── */}
          {activeTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Personal Info form */}
              <div style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14, padding: '1.1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h4 style={{ color: '#f1f5f9', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <User size={15} color="#818cf8" /> Personal Information
                  </h4>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                        background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.25)',
                        color: '#818cf8', borderRadius: 8, padding: '0.3rem 0.8rem',
                        cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                      }}
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => { setEditMode(false); setForm({ name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '', address: user?.address ?? '', city: user?.city ?? '' }); }}
                        style={{
                          background: 'none', border: '1px solid rgba(255,255,255,0.1)',
                          color: '#94a3b8', borderRadius: 8, padding: '0.3rem 0.7rem',
                          cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                        }}
                      >Cancel</button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.3rem',
                          background: saving ? 'rgba(16,185,129,0.5)' : 'rgba(16,185,129,0.9)',
                          border: 'none', color: 'white', borderRadius: 8,
                          padding: '0.3rem 0.9rem', cursor: saving ? 'wait' : 'pointer',
                          fontSize: '0.8rem', fontWeight: 700,
                        }}
                      >
                        <Save size={13} /> {saving ? 'Saving…' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                  <Field
                    icon={<User size={14} />}
                    label="Full Name"
                    value={form.name}
                    onChange={setField('name')}
                    placeholder="Your full name"
                    readOnly={!editMode}
                  />
                  <Field
                    icon={<Mail size={14} />}
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={setField('email')}
                    placeholder="email@example.com"
                    readOnly={!editMode}
                  />
                  <Field
                    icon={<Phone size={14} />}
                    label="Phone Number"
                    type="tel"
                    value={form.phone}
                    onChange={setField('phone')}
                    placeholder="10-digit mobile"
                    readOnly={!editMode}
                  />
                  <Field
                    icon={<MapPin size={14} />}
                    label="City"
                    value={form.city}
                    onChange={setField('city')}
                    placeholder="Your city"
                    readOnly={!editMode}
                  />
                </div>

                <div style={{ marginTop: '0.85rem' }}>
                  <Field
                    icon={<MapPin size={14} />}
                    label="Default Shipping Address"
                    value={form.address}
                    onChange={setField('address')}
                    placeholder="House No., Street, Area, PIN Code"
                    readOnly={!editMode}
                    multiline
                  />
                </div>
              </div>

              {/* Quick Navigation */}
              <div style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14, padding: '1.1rem',
              }}>
                <h4 style={{ color: '#f1f5f9', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight size={15} color="#818cf8" /> Quick Navigation
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  <QuickCard
                    icon={<Package />}
                    label="My Orders"
                    sublabel="View your recent purchases"
                    onClick={() => { setShowProfile(false); setShowOrders(true); }}
                  />
                  <QuickCard
                    icon={<MapPin />}
                    label="Saved Addresses"
                    sublabel={form.address ? `${form.address.slice(0, 40)}…` : 'No address saved yet'}
                    onClick={() => setEditMode(true)}
                  />
                  <QuickCard
                    icon={<LogOut />}
                    label="Logout"
                    sublabel="Sign out of your account"
                    onClick={handleLogout}
                    danger
                  />
                </div>
              </div>
            </div>
          )}

          {/* ──── LISTINGS TAB ──── */}
          {activeTab === 'listings' && (
            <div>
              {userListings.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                  {userListings.map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.1rem',
                  }}>
                    <BookOpen size={30} color="#475569" />
                  </div>
                  <h3 style={{ color: '#f1f5f9', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    No books listed yet
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.87rem', lineHeight: 1.6 }}>
                    Declutter your shelf and earn by selling books you've already read.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
