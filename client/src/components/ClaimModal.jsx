import { useState } from 'react';
import { X, HandHeart, CheckCircle, ShieldCheck, Tag } from 'lucide-react';

export default function ClaimModal({ item, currentUser, onSubmitClaim, onClose }) {
  const [claimantName, setClaimantName] = useState(currentUser?.name || '');
  const [claimantContact, setClaimantContact] = useState(currentUser?.email || '');
  const [proofDetails, setProofDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofDetails.trim()) {
      alert('Please describe proof of ownership so the finder can verify you.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitClaim(item._id || item.id, {
        claimantName,
        claimantContact,
        proofDetails,
      });
      setIsSuccess(true);
    } catch (err) {
      console.error('Claim error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          maxWidth: '520px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'modalFadeIn 0.2s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-page)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HandHeart size={18} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
              Claim This Belonging
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--border-subtle)',
              border: 'none',
              padding: '6px',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }}>
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'var(--found-bg)',
                  color: 'var(--found-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                  border: '1px solid var(--found-border)',
                }}
              >
                <CheckCircle size={32} />
              </div>
              <h4 style={{ margin: '0 0 6px', fontSize: '18px', color: 'var(--text-main)', fontWeight: 800 }}>
                Claim Request Submitted!
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '380px', margin: '0 auto 16px', lineHeight: 1.5 }}>
                The item has been marked as <strong>"⏳ Claim in Progress"</strong>. The poster can verify your proof and reach out to complete the handover.
              </p>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '8px 24px',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '8px',
                }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Item Summary Banner */}
              <div
                style={{
                  padding: '12px 14px',
                  background: 'var(--bg-page)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                    Claiming Item:
                  </span>
                  <h4 style={{ margin: '2px 0 0', fontSize: '15px', color: 'var(--text-main)', fontWeight: 700 }}>
                    {item.title}
                  </h4>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600,
                  }}
                >
                  <Tag size={11} /> {item.category}
                </span>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '5px' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '5px' }}>
                  Your Contact Email or Phone
                </label>
                <input
                  type="text"
                  value={claimantContact}
                  onChange={(e) => setClaimantContact(e.target.value)}
                  placeholder="e.g. student@college.edu or 9876543210"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '5px' }}>
                  Proof of Ownership / Identifying Details *
                </label>
                <textarea
                  rows="3"
                  value={proofDetails}
                  onChange={(e) => setProofDetails(e.target.value)}
                  placeholder="Describe hidden details: passcode, scratches, stickers, brand, contents inside, or unique markings only the owner would know..."
                  required
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '5px' }}>
                  <ShieldCheck size={13} color="var(--found-color)" /> This verification prevents false claims by unknown persons.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                    borderRadius: '8px',
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  <HandHeart size={15} />
                  {isSubmitting ? 'Submitting...' : 'Submit Claim Request'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '10px 16px',
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
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
