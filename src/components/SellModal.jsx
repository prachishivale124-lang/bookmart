import React, { useState } from 'react';
import { X, Upload, ImagePlus, Loader, BookOpen, ChevronDown, Tag, FileText, DollarSign } from 'lucide-react';
import { useApp } from '../context';
import { GENRES, CONDITIONS } from '../data';

export default function SellModal() {
  const { setShowSell, addBook, user } = useApp();
  const [step, setStep] = useState(1); // 1: form, 2: preview
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [dragover, setDragover] = useState(false);
  const [form, setForm] = useState({
    title: '', author: '', genre: '', edition: '',
    condition: '', price: '', description: ''
  });

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleImageDrop = (e) => {
    e.preventDefault();
    setDragover(false);
    const files = Array.from(e.dataTransfer?.files || e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files) => {
    files.slice(0, 5 - images.length).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => setImages(prev => [...prev, ev.target.result]);
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  const isFormValid = form.title && form.author && form.genre && form.condition && form.price && form.description;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setStep(2); // show preview
  };

  const handlePublish = () => {
    setLoading(true);
    setTimeout(() => {
      addBook({
        ...form,
        price: parseInt(form.price),
        images: images.length > 0 ? images : ['https://via.placeholder.com/240x320/1a2235/6c63ff?text=' + encodeURIComponent(form.title.slice(0, 10))]
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="overlay" onClick={() => setShowSell(false)} style={{ alignItems: 'flex-start', paddingTop: '2rem' }}>
      <div
        className="modal-content"
        style={{ maxWidth: 560 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '1.5rem 1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f1f5f9' }}>
              {step === 1 ? '📚 List Your Book' : '👁 Preview Listing'}
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.15rem' }}>
              {step === 1 ? 'Fill in the details below to reach thousands of readers.' : 'Review your listing before publishing.'}
            </p>
          </div>
          <button onClick={() => setShowSell(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        {/* Step indicator */}
        <div style={{ padding: '1rem 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {[1, 2].map(s => (
            <React.Fragment key={s}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700,
                background: step >= s ? '#6c63ff' : 'rgba(255,255,255,0.07)',
                color: step >= s ? 'white' : '#64748b'
              }}>{s}</div>
              {s < 2 && <div style={{ flex: 1, height: 2, background: step > 1 ? '#6c63ff' : 'rgba(255,255,255,0.07)', borderRadius: 2 }} />}
            </React.Fragment>
          ))}
          <span style={{ fontSize: '0.78rem', color: '#64748b', marginLeft: '0.25rem' }}>{step === 1 ? 'Details' : 'Preview'}</span>
        </div>

        <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
          {step === 1 ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Two col */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Book Title *</label>
                  <input required className="input-field" placeholder="e.g. Atomic Habits" value={form.title} onChange={set('title')} />
                </div>
                <div>
                  <label className="label">Author *</label>
                  <input required className="input-field" placeholder="e.g. James Clear" value={form.author} onChange={set('author')} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Genre / Category *</label>
                  <select required className="input-field" value={form.genre} onChange={set('genre')} style={{ appearance: 'none' }}>
                    <option value="">Select genre</option>
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Edition</label>
                  <input className="input-field" placeholder="e.g. 2nd Edition" value={form.edition} onChange={set('edition')} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Condition *</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {CONDITIONS.map(c => (
                      <button
                        type="button" key={c}
                        onClick={() => setForm(f => ({ ...f, condition: c }))}
                        style={{
                          padding: '0.4rem 0.8rem', borderRadius: 8, border: '1.5px solid',
                          borderColor: form.condition === c ? '#6c63ff' : 'rgba(255,255,255,0.08)',
                          background: form.condition === c ? 'rgba(108,99,255,0.12)' : 'transparent',
                          color: form.condition === c ? '#818cf8' : '#64748b',
                          cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s'
                        }}
                      >{c}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Selling Price (₹) *</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#10b981', fontWeight: 700 }}>₹</span>
                    <input
                      required type="number" min={1} max={99999}
                      className="input-field" placeholder="0"
                      value={form.price} onChange={set('price')}
                      style={{ paddingLeft: '2rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="label">Book Images (up to 5)</label>
                <div
                  className={`drop-zone ${dragover ? 'dragover' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragover(true); }}
                  onDragLeave={() => setDragover(false)}
                  onDrop={handleImageDrop}
                  onClick={() => document.getElementById('img-upload').click()}
                >
                  <ImagePlus size={28} color="#6c63ff" style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ color: '#94a3b8', fontSize: '0.88rem', fontWeight: 500 }}>Drag & drop or click to upload</p>
                  <p style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.25rem' }}>PNG, JPG up to 5 images</p>
                  <input id="img-upload" type="file" accept="image/*" multiple hidden onChange={handleImageDrop} />
                </div>

                {images.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                    {images.map((img, i) => (
                      <div key={i} style={{ position: 'relative', width: 68, height: 68 }}>
                        <img src={img} alt="" style={{ width: 68, height: 68, objectFit: 'cover', borderRadius: 8, border: '1.5px solid rgba(108,99,255,0.3)' }} />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                          style={{
                            position: 'absolute', top: -6, right: -6,
                            width: 20, height: 20, borderRadius: '50%',
                            background: '#ef4444', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                          }}
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="label">Description *</label>
                <textarea
                  required
                  className="input-field"
                  placeholder="Describe the book's condition, any marks, if you've read it, etc."
                  value={form.description}
                  onChange={set('description')}
                  rows={3}
                  style={{ resize: 'vertical', minHeight: 80 }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                👁 Preview Listing
              </button>
            </form>
          ) : (
            /* Preview Step */
            <div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.25rem' }}>
                {images.length > 0 && (
                  <img src={images[0]} alt="Cover" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                )}
                <div style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#f1f5f9' }}>{form.title}</h3>
                      <p style={{ color: '#64748b', fontSize: '0.85rem' }}>by {form.author}</p>
                    </div>
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>₹{form.price}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    <span className="badge" style={{ background: 'rgba(108,99,255,0.15)', color: '#818cf8', border: '1px solid rgba(108,99,255,0.3)' }}>{form.genre}</span>
                    <span className={`badge cond-${form.condition.toLowerCase().replace(' ', '-')}`}>{form.condition}</span>
                    {form.edition && <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}>{form.edition}</span>}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>{form.description}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1, padding: '0.8rem' }}>
                  ← Edit Details
                </button>
                <button onClick={handlePublish} className="btn-success" style={{ flex: 1.5 }}>
                  {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Publishing...</> : '🚀 Publish Listing'}
                </button>
              </div>
            </div>
          )}
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
