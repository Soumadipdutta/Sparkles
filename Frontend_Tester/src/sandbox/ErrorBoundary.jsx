import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Sandbox Error Boundary Caught An Error:", error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null, errorInfo: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          margin: '2rem',
          backgroundColor: '#1e1b4b',
          border: '1px solid #6366f1',
          borderRadius: '12px',
          color: '#e0e7ff',
          fontFamily: 'sans-serif'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#f87171' }}>
              Candidate Component Error
            </h2>
          </div>
          <p style={{ marginBottom: '1rem', opacity: 0.9, fontSize: '0.95rem' }}>
            An exception occurred while rendering <strong>{this.props.componentName || 'this component'}</strong>.
          </p>
          <div style={{
            backgroundColor: '#0f172a',
            padding: '1rem',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            overflowX: 'auto',
            color: '#fca5a5',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {this.state.error && this.state.error.toString()}
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            style={{
              marginTop: '1.25rem',
              padding: '8px 16px',
              backgroundColor: '#4f46e5',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            🔄 Try Re-rendering
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
