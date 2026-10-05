import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          animation: 'modalFadeIn 0.2s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--lost-bg)',
              color: 'var(--lost-color)',
              border: '1px solid var(--lost-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={22} />
          </div>
          <div>
            <h4 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 800, color: 'var(--text-main)' }}>
              {title || 'Confirm Action'}
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {message}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              background: 'var(--bg-page)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: '8px 16px',
              background: '#ef4444',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
