import React from 'react';
import { X, Info, HelpCircle, FileText, Shield, LifeBuoy } from 'lucide-react';
import { useApp } from '../context';

export default function StaticInfoModal() {
  const { staticPage, setStaticPage } = useApp();

  if (!staticPage) return null;

  const contentMap = {
    'about': {
      title: 'About Us',
      icon: <Info size={24} color="#6c63ff" />,
      body: (
        <>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            Welcome to BookMart, India's leading peer-to-peer book exchange platform. Our mission is to make reading accessible and affordable for everyone by connecting book lovers across the country.
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Founded in 2025, we've helped thousands of readers find their next favorite book, declutter their shelves, and connect with a community of like-minded individuals. Happy reading!
          </p>
        </>
      )
    },
    'faqs': {
      title: 'Frequently Asked Questions',
      icon: <HelpCircle size={24} color="#6c63ff" />,
      body: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h4 style={{ color: '#f1f5f9', fontSize: '1rem', marginBottom: '0.4rem', fontWeight: 600 }}>How does shipping work?</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>Buyers and sellers can coordinate shipping directly or opt for local meetups. We recommend using trusted courier services for inter-city exchanges.</p>
          </div>
          <div>
            <h4 style={{ color: '#f1f5f9', fontSize: '1rem', marginBottom: '0.4rem', fontWeight: 600 }}>Is there a fee to list a book?</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>No! Listing a book on BookMart is completely free. We do not charge any commission on your sales.</p>
          </div>
          <div>
            <h4 style={{ color: '#f1f5f9', fontSize: '1rem', marginBottom: '0.4rem', fontWeight: 600 }}>How do I pay?</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>You can pay the seller directly using UPI, PhonePe, Google Pay, or Cash on Delivery depending on what you agree upon in the chat.</p>
          </div>
        </div>
      )
    },
    'terms': {
      title: 'Terms & Conditions',
      icon: <FileText size={24} color="#6c63ff" />,
      body: (
        <>
          <h4 style={{ color: '#f1f5f9', fontSize: '1rem', marginBottom: '0.5rem' }}>1. Acceptance of Terms</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>By accessing and using BookMart, you accept and agree to be bound by the terms and provision of this agreement.</p>
          
          <h4 style={{ color: '#f1f5f9', fontSize: '1rem', marginBottom: '0.5rem' }}>2. User Responsibilities</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>Users must provide accurate information when listing books. Misrepresentation of book condition is strictly prohibited and may result in account suspension.</p>
        </>
      )
    },
    'privacy': {
      title: 'Privacy Policy',
      icon: <Shield size={24} color="#6c63ff" />,
      body: (
        <>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            Your privacy is important to us. It is BookMart's policy to respect your privacy regarding any information we may collect from you across our website.
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7 }}>
            We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We don't share any personally identifying information publicly or with third-parties, except when required to by law.
          </p>
        </>
      )
    },
    'support': {
      title: 'Contact Support',
      icon: <LifeBuoy size={24} color="#6c63ff" />,
      body: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Need help? Our support team is here for you. We typically respond within 24 hours.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Email Us</div>
            <div style={{ color: '#f1f5f9', fontWeight: 600 }}>support@bookmart.in</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Call Us (Mon-Fri, 9AM-6PM)</div>
            <div style={{ color: '#f1f5f9', fontWeight: 600 }}>1800-123-4567</div>
          </div>
        </div>
      )
    }
  };

  const content = contentMap[staticPage] || {
    title: 'Information',
    icon: <Info size={24} color="#6c63ff" />,
    body: <p style={{ color: '#94a3b8' }}>Content not found.</p>
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 600, padding: 0, overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{
          padding: '2rem 1.5rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(108,99,255,0.1) 0%, rgba(139,92,246,0.05) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative'
        }}>
          <button onClick={() => setStaticPage(null)} className="close-btn" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            <X size={20} />
          </button>
          
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {content.icon}
          </div>
          
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f1f5f9' }}>
            {content.title}
          </h2>
        </div>

        {/* Content Body */}
        <div style={{ padding: '2rem 1.5rem', maxHeight: '60vh', overflowY: 'auto' }} className="custom-scrollbar">
          {content.body}
        </div>
        
      </div>
    </div>
  );
}
