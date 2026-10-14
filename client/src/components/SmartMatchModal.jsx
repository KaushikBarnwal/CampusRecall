import { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, CheckCircle2, MapPin, Calendar, Copy, Check } from 'lucide-react';
import { itemService } from '../services/itemService';

export default function SmartMatchModal({ item, allItems, onClose }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    async function findMatches() {
      if (!item) return;
      setLoading(true);
      try {
        const results = await itemService.getMatches(item, allItems);
        setMatches(results || []);
      } catch (err) {
        console.error('Error finding matches:', err);
      } finally {
        setLoading(false);
      }
    }
    findMatches();
  }, [item, allItems]);

  if (!item) return null;

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
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
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '18px',
          maxWidth: '650px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          animation: 'modalFadeIn 0.2s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-page)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '8px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={20} />
            </span>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                Smart Match Suggestions
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                Potential {item.type === 'LOST' ? 'FOUND' : 'LOST'} matches for{' '}
                <strong>"{item.title}"</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--border-subtle)',
              color: 'var(--text-muted)',
              border: 'none',
              padding: '6px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>
        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Target Item Summary Banner */}
          <div
            style={{
              background: item.type === 'LOST' ? 'var(--lost-bg)' : 'var(--found-bg)',
              border: `1px solid ${item.type === 'LOST' ? 'var(--lost-border)' : 'var(--found-border)'}`,
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: item.type === 'LOST' ? 'var(--lost-color)' : 'var(--found-color)',
                  textTransform: 'uppercase',
                }}
              >
                Target {item.type} Item
              </span>
              <h4 style={{ margin: '2px 0 0', fontSize: '15px', color: 'var(--text-main)' }}>{item.title}</h4>
            </div>
            <span
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                background: 'var(--bg-card)',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {item.category}
            </span>
          </div>

          {/* Results list */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
              <Sparkles size={28} color="var(--primary)" className="spin-icon" style={{ margin: '0 auto 8px' }} />
              <p style={{ fontSize: '14px' }}>Scanning directory for matching reports...</p>
            </div>
          ) : matches.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'var(--bg-page)',
                borderRadius: '12px',
                border: '1px dashed var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
            >
              <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                No direct matches found yet
              </p>
              <p style={{ fontSize: '13px' }}>
                We'll continue checking incoming reports against your listing. Keep this listing active!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                Found {matches.length} Potential Match{matches.length > 1 ? 'es' : ''}:
              </span>

              {matches.map((match) => (
                <div
                  key={match._id || match.id}
                  style={{
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '16px',
                    background: 'var(--bg-card)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {match.imageUrl && (
                        <div
                          style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-page)',
                          }}
                        >
                          <img
                            src={match.imageUrl}
                            alt={match.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <span className={`badge ${match.type === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
                            {match.type === 'LOST' ? <AlertCircle size={11} /> : <CheckCircle2 size={11} />}
                            {match.type}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                            Category Match
                          </span>
                        </div>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                          {match.title}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)', opacity: 0.85, lineHeight: '1.5' }}>
                    {match.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      paddingTop: '6px',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} /> {match.location}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} /> {match.date}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'var(--bg-page)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '13px',
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>
                      Contact: <strong style={{ color: 'var(--text-main)' }}>{match.contact}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(match._id || match.id, match.contact)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '12px',
                        background: copiedId === (match._id || match.id) ? 'var(--found-color)' : 'var(--bg-card)',
                        color: copiedId === (match._id || match.id) ? '#fff' : 'var(--text-main)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                      }}
                    >
                      {copiedId === (match._id || match.id) ? <Check size={12} /> : <Copy size={12} />}
                      {copiedId === (match._id || match.id) ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
            background: 'var(--bg-page)',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 20px',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '8px',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
