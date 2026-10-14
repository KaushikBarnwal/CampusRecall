import { useState, useRef, useEffect, memo } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CheckCheck,
  Sparkles,
  Tag,
  MapPin,
  Calendar,
  Copy,
  Check,
  Printer,
  Trash2,
  HandHeart,
  Crown,
  Shield,
  ChevronDown,
  Loader2,
  Compass,
} from 'lucide-react';

function StatusDropdown({ currentStatus, isUpdating, onStatusChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const statusConfigs = {
    OPEN: {
      label: 'Mark Active',
      shortLabel: 'Active',
      icon: Sparkles,
      color: 'var(--found-color, #15803d)',
    },
    CLAIMED: {
      label: 'Mark Claimed',
      shortLabel: 'Claimed',
      icon: Clock,
      color: 'var(--claimed-color, #b45309)',
    },
    RESOLVED: {
      label: 'Mark Resolved',
      shortLabel: 'Resolved',
      icon: CheckCheck,
      color: 'var(--resolved-color, #4338ca)',
    },
  };

  const currentCfg = statusConfigs[currentStatus] || statusConfigs.OPEN;
  const CurrentIcon = currentCfg.icon;

  const options = [
    { value: 'OPEN', ...statusConfigs.OPEN },
    { value: 'CLAIMED', ...statusConfigs.CLAIMED },
    { value: 'RESOLVED', ...statusConfigs.RESOLVED },
  ];

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        disabled={isUpdating}
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          fontSize: '12px',
          padding: '6px 11px',
          borderRadius: '8px',
          cursor: isUpdating ? 'not-allowed' : 'pointer',
          border: '1px solid var(--border-subtle)',
          fontWeight: 600,
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.15s ease',
        }}
        title="Change Item Status (Authorized Poster / Admin)"
      >
        {isUpdating ? (
          <Loader2 size={13} className="spin-icon" style={{ color: 'var(--primary)' }} />
        ) : (
          <CurrentIcon size={13} style={{ color: currentCfg.color }} />
        )}
        <span>{currentCfg.shortLabel}</span>
        <ChevronDown
          size={13}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            color: 'var(--text-muted)',
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            zIndex: 100,
            minWidth: '175px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-lg)',
            padding: '5px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            animation: 'dropdownFadeIn 0.15s ease',
          }}
        >
          <div
            style={{
              padding: '4px 8px 6px',
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '2px',
            }}
          >
            Update Status
          </div>

          {options.map((opt) => {
            const isSelected = opt.value === currentStatus;
            const OptIcon = opt.icon;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (!isSelected) {
                    onStatusChange(opt.value);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: isSelected ? 'var(--primary-light)' : 'transparent',
                  color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                  fontSize: '12px',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'var(--bg-page)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <OptIcon size={14} style={{ color: opt.color }} />
                  {opt.label}
                </span>
                {isSelected && <Check size={13} style={{ color: 'var(--primary)' }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ItemCard({
  item,
  currentUser,
  onUpdateStatus,
  onDeleteItem,
  onOpenMatches,
  onOpenPoster,
  onOpenClaim,
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showClaims, setShowClaims] = useState(false);
  const isLost = item.type === 'LOST';
  const status = item.status || 'OPEN';

  // Ownership & Permission Checks
  const userEmail = currentUser?.email?.toLowerCase();
  const itemContact = item.contact?.toLowerCase();
  const createdByEmail = item.createdBy?.email?.toLowerCase();
  const isOwner = Boolean(userEmail && (userEmail === itemContact || userEmail === createdByEmail));
  const isAdmin = currentUser?.role === 'admin';
  const canManage = isOwner || isAdmin;

  const handleStatusChange = async (newStatus) => {
    if (!onUpdateStatus || isUpdating) return;
    setIsUpdating(true);
    try {
      await onUpdateStatus(item._id || item.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyContact = () => {
    if (item.contact) {
      navigator.clipboard.writeText(item.contact);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      onDeleteItem(item._id || item.id);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'CLAIMED':
        return (
          <span className="badge badge-claimed">
            <Clock size={13} /> Claim in Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="badge badge-resolved">
            <CheckCheck size={13} /> Resolved / Returned
          </span>
        );
      default:
        return (
          <span className="badge badge-open">
            <Sparkles size={13} /> Active Listing
          </span>
        );
    }
  };

  return (
    <div
      className={`item-card ${status === 'RESOLVED' ? 'is-resolved' : ''}`}
      style={{
        marginBottom: '18px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        border: isOwner ? '1.5px solid var(--primary)' : undefined,
      }}
    >
      {/* Header Row: Title + Badges + Ownership */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
              {isLost ? <AlertCircle size={13} /> : <CheckCircle2 size={13} />}
              {isLost ? 'Lost' : 'Found'}
            </span>
            {getStatusBadge()}
            <span
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                background: 'var(--bg-page)',
                border: '1px solid var(--border-subtle)',
                padding: '3px 8px',
                borderRadius: '6px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Tag size={12} /> {item.category}
            </span>

            {/* Geo-Tagged Badge */}
            {Boolean(item.isGeoTagged || (item.coordinates && item.coordinates.lat)) && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--found-color)',
                  background: 'var(--found-bg)',
                  border: '1px solid var(--found-border)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
                title={`Exact GPS coordinates: ${item.coordinates?.lat?.toFixed?.(4) || ''}, ${item.coordinates?.lng?.toFixed?.(4) || ''}`}
              >
                <MapPin size={11} /> Geo-Tagged
              </span>
            )}

            {/* Ownership Badges */}
            {isOwner && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  background: 'var(--primary-light)',
                  border: '1px solid var(--primary-light)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Crown size={11} /> Your Report
              </span>
            )}
            {!isOwner && isAdmin && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--lost-color)',
                  background: 'var(--lost-bg)',
                  border: '1px solid var(--lost-border)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Shield size={11} /> Admin Mode
              </span>
            )}

            {/* Claims Received Badge */}
            {Boolean(canManage && item.claims && item.claims.length > 0) && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--claimed-color)',
                  background: 'var(--claimed-bg)',
                  border: '1px solid var(--claimed-border)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => setShowClaims((prev) => !prev)}
                title="Click to view submitted proof of ownership"
              >
                <HandHeart size={11} /> {item.claims.length} Claim{item.claims.length > 1 ? 's' : ''} Received
              </span>
            )}
          </div>

          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
            {item.title}
          </h3>
        </div>

        {/* Status Switcher & Delete Controls (Only for Creator or Admin!) */}
        {canManage && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <StatusDropdown
              currentStatus={status}
              isUpdating={isUpdating}
              onStatusChange={handleStatusChange}
            />

            {onDeleteItem && (
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  background: 'var(--lost-bg)',
                  color: 'var(--lost-color)',
                  padding: '7px',
                  borderRadius: '8px',
                  border: '1px solid var(--lost-border)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                title="Delete this listing"
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--lost-border)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--lost-bg)')}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content Body: Image (if uploaded) + Description */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {item.imageUrl && (
          <div
            style={{
              width: '120px',
              height: '100px',
              borderRadius: '10px',
              overflow: 'hidden',
              flexShrink: 0,
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-page)',
            }}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div style={{ flex: 1, minWidth: '220px' }}>
          <p style={{ color: 'var(--text-main)', opacity: 0.88, fontSize: '14px', lineHeight: '1.6' }}>
            {item.description}
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              marginTop: '10px',
              fontSize: '13px',
              color: 'var(--text-muted)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
              <strong>Location:</strong> {item.location}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
              <strong>Date:</strong> {item.date}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Claims & Proof details (visible to owner/admin) */}
      {showClaims && item.claims && item.claims.length > 0 && (
        <div
          style={{
            background: 'var(--bg-page)',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'dropdownFadeIn 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HandHeart size={15} color="var(--primary)" />
              Submitted Proof of Ownership ({item.claims.length})
            </span>
            <button
              type="button"
              onClick={() => setShowClaims(false)}
              style={{
                fontSize: '11px',
                background: 'transparent',
                color: 'var(--text-muted)',
                padding: '2px 6px',
              }}
            >
              Hide
            </button>
          </div>
          {item.claims.map((claim, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-card)',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                fontSize: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
                <strong style={{ color: 'var(--text-main)', fontSize: '13px' }}>{claim.claimantName}</strong>
                <code style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-page)', padding: '2px 6px', borderRadius: '4px' }}>
                  {claim.claimantContact}
                </code>
              </div>
              <p style={{ margin: '4px 0 0', color: 'var(--text-main)', opacity: 0.9, lineHeight: 1.4 }}>
                <strong>Proof Details:</strong> {claim.proofDetails}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Footer Row: Contact Info & Action Triggers */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          <strong>Contact:</strong>{' '}
          <code
            style={{
              background: 'var(--bg-page)',
              border: '1px solid var(--border-subtle)',
              padding: '3px 8px',
              borderRadius: '6px',
              color: 'var(--text-main)',
              fontFamily: 'monospace',
              fontSize: '12px',
            }}
          >
            {item.contact}
          </code>
        </span>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Claim Button: Available when user is NOT the owner and item is not resolved */}
          {!canManage && status !== 'RESOLVED' && onOpenClaim && (
            <button
              type="button"
              onClick={() => onOpenClaim(item)}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                background: 'var(--claimed-bg)',
                color: 'var(--claimed-color)',
                border: '1px solid var(--claimed-border)',
                borderRadius: '8px',
                fontWeight: 700,
              }}
              title="Claim this item with proof of ownership"
            >
              <HandHeart size={13} />
              Claim Item
            </button>
          )}

          {/* Smart Match Suggestions Trigger */}
          {onOpenMatches && (
            <button
              type="button"
              onClick={() => onOpenMatches(item)}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                border: '1px solid var(--primary-light)',
                borderRadius: '8px',
              }}
              title="Search for matching items"
            >
              <Sparkles size={13} />
              Matches
            </button>
          )}

          {/* View Claims Trigger (Owner/Admin only) */}
          {Boolean(canManage && item.claims && item.claims.length > 0) && (
            <button
              type="button"
              onClick={() => setShowClaims((prev) => !prev)}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                background: 'var(--claimed-bg)',
                color: 'var(--claimed-color)',
                border: '1px solid var(--claimed-border)',
                borderRadius: '8px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
              }}
              title="View submitted proof of ownership from claimants"
            >
              <HandHeart size={13} />
              {showClaims ? 'Hide Claims' : `Claims (${item.claims.length})`}
            </button>
          )}

          {/* Geo-tagged Directions / Map Trigger */}
          {Boolean(item.coordinates?.lat && item.coordinates?.lng) && (
            <a
              href={`https://www.google.com/maps?q=${item.coordinates.lat},${item.coordinates.lng}`}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                background: 'var(--found-bg)',
                color: 'var(--found-color)',
                border: '1px solid var(--found-border)',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600,
              }}
              title="Open exact GPS pin in Google Maps"
            >
              <Compass size={13} />
              Directions
            </a>
          )}

          {/* Printable Lost Poster Trigger */}
          {onOpenPoster && (
            <button
              type="button"
              onClick={() => onOpenPoster(item)}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                background: 'var(--bg-page)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
              }}
              title="Generate printable noticeboard poster with QR code"
            >
              <Printer size={13} />
              Poster
            </button>
          )}

          {/* Copy Contact Button */}
          <button
            type="button"
            onClick={handleCopyContact}
            style={{
              fontSize: '12px',
              padding: '6px 12px',
              background: copied ? 'var(--found-color)' : 'var(--bg-page)',
              color: copied ? '#ffffff' : 'var(--text-main)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Contact'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ItemCard);