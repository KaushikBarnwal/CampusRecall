import { useState } from 'react';
import { AlertCircle, Send, MapPin, Compass, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';

export default function ReportLostItem({ onAddItem, onCancel, currentUser }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState(currentUser?.email || '');
  const [imageUrl, setImageUrl] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [isGeoTagged, setIsGeoTagged] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Handle GPS detection from photo EXIF
  const handleGeoLocationFound = (coords) => {
    if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
      setCoordinates({ lat: coords.lat, lng: coords.lng });
      setIsGeoTagged(true);
      setLocationNotice('Last seen coordinates extracted from photo EXIF metadata!');
    } else {
      setCoordinates({ lat: null, lng: null });
      setIsGeoTagged(false);
      setLocationNotice('');
    }
  };

  // Device Geolocation trigger
  const handleGetDeviceLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        setIsGeoTagged(true);
        setLocationNotice('Device location captured via GPS.');
        setIsLocating(false);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        alert('Could not access current location. Please check browser location permissions.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleClearGeoTag = () => {
    setCoordinates({ lat: null, lng: null });
    setIsGeoTagged(false);
    setLocationNotice('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !location || !contact) {
      alert('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await onAddItem({
        title,
        category,
        type: 'LOST',
        location,
        date: new Date().toISOString().split('T')[0],
        description,
        contact,
        imageUrl,
        coordinates: isGeoTagged && coordinates.lat && coordinates.lng ? coordinates : { lat: null, lng: null },
        isGeoTagged: Boolean(isGeoTagged && coordinates.lat && coordinates.lng),
        status: 'OPEN',
        createdBy: currentUser
          ? { name: currentUser.name, email: currentUser.email, role: currentUser.role }
          : { name: 'Anonymous', email: contact, role: 'user' },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-main)',
        padding: '30px',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <span className="badge badge-lost" style={{ marginBottom: '8px' }}>
            <AlertCircle size={13} />
            Lost Item Report
          </span>
          <h2 style={{ color: 'var(--lost-color)', margin: 0, fontSize: '24px', fontWeight: 800 }}>
            Report a Lost Item
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Provide accurate details to help campus or community members recognize and return it to you.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
            Item Title *
          </label>
          <input
            type="text"
            placeholder="e.g., Black Dell XPS Laptop or Blue Metal Bottle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              Category *
            </label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Electronics">Electronics</option>
              <option value="Personal Items">Personal Items</option>
              <option value="Wallets">Wallets</option>
              <option value="Keys">Keys</option>
              <option value="Documents">Documents</option>
              <option value="Clothing">Clothing</option>
              <option value="Bags">Bags</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              Last Seen Location *
            </label>
            <input
              type="text"
              placeholder="e.g., Library Reading Hall, 2nd Floor"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
            Contact Email or Mobile Number *
          </label>
          <input
            type="text"
            placeholder="e.g., student@college.edu or +91 98765 43210"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
            Detailed Description
          </label>
          <textarea
            placeholder="Include color, scratches, stickers, brand name, keychain features, or contents..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
        </div>

        {/* Image Uploader with Instant EXIF GPS Extraction */}
        <ImageUploader
          imageUrl={imageUrl}
          onImageChange={setImageUrl}
          onGeoLocationFound={handleGeoLocationFound}
        />

        {/* Geo-Tagging Section */}
        <div
          style={{
            background: 'var(--bg-page)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  background: isGeoTagged ? 'var(--lost-bg)' : 'var(--primary-light)',
                  color: isGeoTagged ? 'var(--lost-color)' : 'var(--primary)',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MapPin size={18} />
              </span>
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>
                  Pinpoint Last Known Location (Optional)
                </strong>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                  Pin exact coordinates to show on the campus map where you lost it.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={isLocating}
              onClick={handleGetDeviceLocation}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: isLocating ? 'not-allowed' : 'pointer',
                fontWeight: 600,
              }}
            >
              {isLocating ? <Loader2 size={13} className="spin-icon" /> : <Compass size={14} color="var(--primary)" />}
              {isLocating ? 'Locating...' : 'Use My Current Location'}
            </button>
          </div>

          {/* Active Geo-Tag Confirmation Box */}
          {isGeoTagged && coordinates.lat && coordinates.lng ? (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      background: 'var(--lost-color)',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                    }}
                  >
                    📍 Geo-Tagged
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
                    {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
                  </span>
                </div>
                {locationNotice && (
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {locationNotice}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <a
                  href={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '12px',
                    color: 'var(--primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  <ExternalLink size={13} /> View on Map
                </a>
                <button
                  type="button"
                  onClick={handleClearGeoTag}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--lost-color)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}
                  title="Remove coordinates"
                >
                  <Trash2 size={13} /> Clear
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              flex: 1,
              padding: '12px 20px',
              backgroundColor: 'var(--lost-color)',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 700,
              borderRadius: '8px',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            <Send size={16} />
            {submitting ? 'Submitting...' : 'Submit Lost Report'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '12px 18px',
                backgroundColor: 'var(--bg-page)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}