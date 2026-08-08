import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[BookMart ErrorBoundary]', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0e1a 0%, #111827 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: "'Inter', sans-serif",
        }}>
          <div style={{
            maxWidth: 480,
            width: '100%',
            textAlign: 'center',
            animation: 'fadeInUp 0.4s ease',
          }}>
            {/* Icon */}
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(239,68,68,0.12)',
              border: '2px solid rgba(239,68,68,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2rem',
            }}>
              ⚠️
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#f1f5f9',
              marginBottom: '0.75rem',
              lineHeight: 1.3,
            }}>
              Something went wrong
            </h1>

            <p style={{
              color: '#94a3b8',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              marginBottom: '0.5rem',
            }}>
              BookMart encountered an unexpected error. Don't worry — your data is safe.
            </p>

            {/* Error detail (dev-friendly) */}
            {this.state.error && (
              <details style={{ marginBottom: '1.75rem', textAlign: 'left' }}>
                <summary style={{
                  color: '#64748b',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  marginBottom: '0.5rem',
                  userSelect: 'none',
                }}>
                  Technical details
                </summary>
                <pre style={{
                  background: 'rgba(239,68,68,0.06)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 10,
                  padding: '0.85rem 1rem',
                  fontSize: '0.75rem',
                  color: '#fca5a5',
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            {/* Reload button */}
            <button
              onClick={this.handleReload}
              style={{
                background: 'linear-gradient(135deg, #6c63ff 0%, #8b5cf6 100%)',
                color: 'white',
                fontWeight: 700,
                padding: '0.8rem 2rem',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                boxShadow: '0 4px 15px rgba(108,99,255,0.4)',
                transition: 'all 0.25s ease',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(108,99,255,0.55)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(108,99,255,0.4)';
              }}
            >
              Reload BookMart
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
