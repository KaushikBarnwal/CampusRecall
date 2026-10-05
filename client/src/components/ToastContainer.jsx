import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 120,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxWidth: '360px',
        width: '100%',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        return (
          <div
            key={toast.id}
            className="toast-item"
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: '#0f172a',
              color: '#ffffff',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              border: `1px solid ${isSuccess ? '#10b981' : isError ? '#ef4444' : '#3b82f6'}`,
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isSuccess && <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0 }} />}
              {isError && <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />}
              {!isSuccess && !isError && <Info size={16} color="#60a5fa" style={{ flexShrink: 0 }} />}
              <span>{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                padding: '2px',
                cursor: 'pointer',
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
