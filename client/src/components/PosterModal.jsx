import { QRCodeSVG } from 'qrcode.react';
import { Printer, X, MapPin, Calendar, Tag, Phone, Scissors } from 'lucide-react';

export default function PosterModal({ item, onClose }) {
  if (!item) return null;

  const isLost = item.type === 'LOST';
  const qrData =
    typeof window !== 'undefined'
      ? `${window.location.origin}?item=${item._id || item.id}&contact=${encodeURIComponent(item.contact)}`
      : item.contact;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="poster-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(20, 18, 16, 0.72)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        className="poster-modal-container"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          maxWidth: '580px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '94vh',
          animation: 'modalFadeIn 0.2s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls Bar (Hidden in print) */}
        <div
          className="no-print"
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-page)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={16} color="var(--primary)" />
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
              Printable Noticeboard Poster
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                padding: '6px 14px',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                fontSize: '13px',
                borderRadius: '8px',
                fontWeight: 600,
              }}
            >
              <Printer size={15} />
              Print Flyer
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'var(--border-subtle)',
                color: 'var(--text-muted)',
                padding: '6px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Poster Area */}
        <div
          id="printable-poster"
          className="printable-poster-area"
          style={{
            padding: '24px',
            overflowY: 'auto',
            background: '#ffffff',
            color: '#1c1917',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            border: '2px solid #1c1917',
            margin: '16px',
            borderRadius: '12px',
          }}
        >
          {/* Poster Header Banner */}
          <div
            style={{
              backgroundColor: isLost ? '#c2410c' : '#15803d',
              color: '#ffffff',
              textAlign: 'center',
              padding: '12px',
              borderRadius: '8px',
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: 900,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              {isLost ? 'LOST ITEM - PLEASE HELP' : 'FOUND ITEM - NOTICE'}
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.9 }}>
              {isLost ? 'Have you seen this item? Any clues appreciated!' : 'Claim from contact details below'}
            </p>
          </div>

          {/* Item Title & Category */}
          <div style={{ textAlign: 'center', borderBottom: '2px dashed #d6d0c4', paddingBottom: '12px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1c1917', margin: '0 0 6px' }}>
              {item.title}
            </h2>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#57534e',
                background: '#f5f3ee',
                padding: '3px 10px',
                borderRadius: '6px',
              }}
            >
              <Tag size={12} /> {item.category}
            </span>
          </div>

          {/* Item Photo (if present) */}
          {item.imageUrl && (
            <div
              style={{
                width: '100%',
                maxHeight: '180px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #e5e0d5',
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#faf8f5',
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          )}

          {/* Details Box */}
          <div
            style={{
              background: '#faf8f5',
              color: '#292524',
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid #e5e0d5',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '13px',
              lineHeight: '1.45',
            }}
          >
            <div style={{ color: '#292524' }}>
              <strong style={{ color: '#1c1917' }}>Description:</strong> {item.description}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', color: '#44403c' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#44403c' }}>
                <MapPin size={14} color="#c2410c" />
                <strong style={{ color: '#1c1917' }}>Last Seen:</strong> {item.location}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#44403c' }}>
                <Calendar size={14} color="#57534e" />
                <strong style={{ color: '#1c1917' }}>Date:</strong> {item.date}
              </span>
            </div>
          </div>

          {/* QR Code + Contact Row */}
          <div
            className="poster-qr-contact-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              padding: '12px 16px',
              border: '2px solid #1c1917',
              borderRadius: '8px',
              background: '#ffffff',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Phone size={14} color="#235d41" />
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#1c1917' }}>
                  PLEASE CONTACT:
                </span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#235d41', wordBreak: 'break-all' }}>
                {item.contact}
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#6b645c' }}>
                Scan the QR code to open listing and view live details.
              </p>
            </div>

            <div style={{ padding: '6px', background: '#fff', border: '1px solid #e5e0d5', borderRadius: '6px', flexShrink: 0 }}>
              <QRCodeSVG value={qrData} size={84} level="M" />
            </div>
          </div>

          {/* Tear-Off Contact Slips (Clean Perforated Campus Noticeboard Aesthetic) */}
          <div style={{ borderTop: '2px dashed #a8a29e', paddingTop: '10px', marginTop: '4px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#6b645c',
                marginBottom: '8px',
                letterSpacing: '0.5px',
              }}
            >
              <Scissors size={13} />
              <span>TEAR-OFF CONTACT SLIPS</span>
            </div>

            <div
              className="poster-tear-slips"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '6px',
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    border: '1px dashed #a8a29e',
                    borderTop: 'none',
                    borderRadius: '0 0 6px 6px',
                    padding: '8px 4px',
                    background: '#faf8f5',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <Phone size={11} color="#235d41" />
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#1c1917',
                      lineHeight: '1.2',
                      wordBreak: 'break-word',
                      maxWidth: '100%',
                    }}
                  >
                    {item.contact}
                  </span>
                  <span
                    style={{
                      fontSize: '9px',
                      color: '#78716c',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                      display: 'block',
                    }}
                  >
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
