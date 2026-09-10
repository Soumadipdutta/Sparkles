import React, { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { registeredComponents } from './componentRegistry';

export default function WorkbenchLayout() {
  const [selectedId, setSelectedId] = useState(registeredComponents[0]?.id || '');
  const [viewport, setViewport] = useState('responsive'); // 'responsive', 'laptop', 'tablet', 'mobile'
  const [themeBg, setThemeBg] = useState('dark'); // 'dark', 'light', 'slate', 'midnight'
  const [showHelp, setShowHelp] = useState(false);
  const [resetCount, setResetCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const activeComponentObj = registeredComponents.find(c => c.id === selectedId) || registeredComponents[0];
  const ActiveComponent = activeComponentObj?.component || (() => <div>No component selected</div>);

  // Background map
  const bgStyles = {
    dark: { bg: '#0b0f19', color: '#f3f4f6' },
    light: { bg: '#ffffff', color: '#0f172a' },
    slate: { bg: '#f1f5f9', color: '#1e293b' },
    midnight: { bg: '#030712', color: '#f9fafb' }
  };

  // Viewport width map
  const viewportWidths = {
    responsive: '100%',
    laptop: '1280px',
    tablet: '768px',
    mobile: '375px'
  };

  const filteredComponents = registeredComponents.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#090d16', color: '#f3f4f6' }}>
      
      {/* SIDEBAR: Component Selector */}
      <aside style={{
        width: '320px',
        backgroundColor: '#0d1322',
        borderRight: '1px solid #1f293d',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10
      }}>
        {/* Header Branding */}
        <div style={{ padding: '20px', borderBottom: '1px solid #1f293d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🧪</span>
              <h1 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#f3f4f6', letterSpacing: '-0.02em' }}>
                Frontend Workbench
              </h1>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '4px 0 0 0' }}>
              Isolated `.jsx` Component Tester
            </p>
          </div>
          <span style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            Sandbox
          </span>
        </div>

        {/* Search */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #1f293d' }}>
          <input
            type="text"
            placeholder="🔍 Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: '#161e31',
              border: '1px solid #283552',
              borderRadius: '8px',
              color: '#f3f4f6',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>

        {/* List of Components */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Registered Candidates ({filteredComponents.length})
          </div>

          {filteredComponents.length === 0 ? (
            <div style={{ padding: '16px', textStyle: 'italic', color: '#6b7280', fontSize: '0.85rem', textAlign: 'center' }}>
              No candidates found matching "{searchQuery}"
            </div>
          ) : (
            filteredComponents.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 14px',
                    marginBottom: '8px',
                    backgroundColor: isSelected ? '#1e293b' : 'transparent',
                    border: isSelected ? '1px solid #6366f1' : '1px solid transparent',
                    borderRadius: '10px',
                    color: isSelected ? '#ffffff' : '#d1d5db',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: isSelected ? 700 : 600, fontSize: '0.9rem', color: isSelected ? '#818cf8' : '#f3f4f6' }}>
                      {item.title}
                    </span>
                    <span style={{
                      fontSize: '0.65rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: isSelected ? '#4f46e5' : '#1f293d',
                      color: isSelected ? '#ffffff' : '#9ca3af',
                      fontWeight: 600
                    }}>
                      {item.version || 'v1.0'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0, lineHeight: '1.3' }}>
                    {item.description}
                  </p>
                </button>
              );
            })
          )}
        </div>

        {/* Quick Add Instructions Footer */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid #1f293d', backgroundColor: '#090d16' }}>
          <button
            onClick={() => setShowHelp(true)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              border: '1px dashed #6366f1',
              borderRadius: '8px',
              color: '#818cf8',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>➕ How to test a new .jsx file</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#090d16' }}>
        
        {/* TOP CONTROL TOOLBAR */}
        <header style={{
          height: '60px',
          backgroundColor: '#0d1322',
          borderBottom: '1px solid #1f293d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 5
        }}>
          {/* Active Component Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '18px' }}>📄</span>
            <div>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f3f4f6' }}>
                {activeComponentObj?.title}
              </span>
              <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: '#6b7280', fontFamily: 'monospace' }}>
                [{activeComponentObj?.category}]
              </span>
            </div>
          </div>

          {/* Viewport Frame Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#161e31', padding: '4px', borderRadius: '8px', border: '1px solid #283552' }}>
            {[
              { id: 'responsive', label: '🖥️ Full / Fluid' },
              { id: 'laptop', label: '💻 Laptop (1280px)' },
              { id: 'tablet', label: '📱 Tablet (768px)' },
              { id: 'mobile', label: '📱 Mobile (375px)' }
            ].map(vp => (
              <button
                key={vp.id}
                onClick={() => setViewport(vp.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: viewport === vp.id ? '#4f46e5' : 'transparent',
                  color: viewport === vp.id ? '#ffffff' : '#9ca3af',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {vp.label}
              </button>
            ))}
          </div>

          {/* Theme & Actions Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Theme Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#9ca3af' }}>
              <span>Theme:</span>
              <select
                value={themeBg}
                onChange={(e) => setThemeBg(e.target.value)}
                style={{
                  backgroundColor: '#161e31',
                  color: '#f3f4f6',
                  border: '1px solid #283552',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.8rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="dark">Dark (#0b0f19)</option>
                <option value="light">Light (#ffffff)</option>
                <option value="slate">Slate (#f1f5f9)</option>
                <option value="midnight">Midnight (#030712)</option>
              </select>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => setResetCount(c => c + 1)}
              title="Re-render component state"
              style={{
                padding: '6px 12px',
                backgroundColor: '#161e31',
                border: '1px solid #283552',
                borderRadius: '6px',
                color: '#f3f4f6',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🔄 Reset State
            </button>
          </div>
        </header>

        {/* CANVASES / PREVIEW CONTAINER */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: viewport === 'responsive' ? 'stretch' : 'flex-start',
          padding: viewport === 'responsive' ? '0' : '32px 16px',
          backgroundColor: '#060911'
        }}>
          <div style={{
            width: viewportWidths[viewport],
            maxWidth: '100%',
            backgroundColor: bgStyles[themeBg].bg,
            color: bgStyles[themeBg].color,
            minHeight: viewport === 'responsive' ? '100%' : '800px',
            borderRadius: viewport === 'responsive' ? '0px' : '16px',
            boxShadow: viewport === 'responsive' ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            overflow: 'auto',
            transition: 'width 0.25s ease, background-color 0.2s ease',
            position: 'relative'
          }}>
            <ErrorBoundary resetKey={`${selectedId}-${resetCount}`} componentName={activeComponentObj?.title}>
              <ActiveComponent key={`${selectedId}-${resetCount}`} />
            </ErrorBoundary>
          </div>
        </div>

        {/* FOOTER RESOLUTION STATUS BAR */}
        <footer style={{
          height: '28px',
          backgroundColor: '#0d1322',
          borderTop: '1px solid #1f293d',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#6b7280'
        }}>
          <span>Viewport Mode: <strong style={{ color: '#9ca3af' }}>{viewport} ({viewportWidths[viewport]})</strong></span>
          <span>Hot Module Replacement (HMR) Active ⚡</span>
        </footer>
      </main>

      {/* QUICK HELP MODAL */}
      {showHelp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#0d1322',
            border: '1px solid #283552',
            borderRadius: '16px',
            width: '560px',
            maxWidth: '90vw',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
            color: '#f3f4f6'
          }}>
            <h2 style={{ margin: '0 0 12px 0', fontSize: '1.25rem', color: '#818cf8' }}>
              🚀 How to Test Your .jsx Files
            </h2>
            <ol style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '0.9rem', color: '#d1d5db' }}>
              <li>
                <strong>Add your file:</strong> Drop your <code>.jsx</code> file into:
                <br />
                <code style={{ background: '#161e31', padding: '2px 6px', borderRadius: '4px', color: '#38bdf8' }}>
                  Frontend_Sandbox/src/test_components/MyNewPage.jsx
                </code>
              </li>
              <li>
                <strong>Register it:</strong> Open <code style={{ background: '#161e31', padding: '2px 6px', borderRadius: '4px', color: '#38bdf8' }}>src/sandbox/componentRegistry.js</code> and add your component import & array entry:
                <pre style={{ background: '#161e31', padding: '10px', borderRadius: '8px', marginTop: '8px', fontSize: '0.8rem', color: '#a7f3d0' }}>
{`import MyNewPage from '../test_components/MyNewPage';

registeredComponents.push({
  id: 'my-new-page',
  title: 'My New Page Candidate',
  category: 'Pages',
  description: 'Version 2 design candidate',
  component: MyNewPage
});`}
                </pre>
              </li>
              <li>
                <strong>Instant Live Preview:</strong> Your new candidate page will immediately appear in the sidebar list for testing!
              </li>
            </ol>
            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <button
                onClick={() => setShowHelp(false)}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
