import { useState } from 'react';
import { UploadCloud, Link2, Camera, X, MapPin } from 'lucide-react';
import exifr from 'exifr';

export default function ImageUploader({ imageUrl, onImageChange, onGeoLocationFound }) {
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
  const [urlInput, setUrlInput] = useState('');
  const [exifLocation, setExifLocation] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP, etc.)');
      return;
    }
    // Limit client-side preview to 4MB
    if (file.size > 4 * 1024 * 1024) {
      alert('Image is larger than 4MB. Please choose a smaller photo.');
      return;
    }

    // Try extracting EXIF GPS coordinates from the photo
    try {
      const gps = await exifr.gps(file);
      if (gps && typeof gps.latitude === 'number' && typeof gps.longitude === 'number') {
        const coords = { lat: gps.latitude, lng: gps.longitude };
        setExifLocation(coords);
        if (onGeoLocationFound) {
          onGeoLocationFound({ ...coords, source: 'exif' });
        }
      } else {
        setExifLocation(null);
      }
    } catch {
      // Image doesn't contain EXIF or format doesn't support it - safe to ignore
      setExifLocation(null);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onImageChange(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageChange(urlInput.trim());
      setUrlInput('');
      setExifLocation(null);
    }
  };

  const handleRemove = () => {
    onImageChange('');
    setExifLocation(null);
    if (onGeoLocationFound) {
      onGeoLocationFound(null);
    }
  };

  return (
    <div style={{ marginTop: '4px', marginBottom: '8px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
        Item Photo (Optional but Recommended)
      </label>

      {imageUrl ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="image-preview-wrapper" style={{ width: '100%', maxWidth: '320px' }}>
            <img src={imageUrl} alt="Preview" />
            <button
              type="button"
              className="image-remove-btn"
              onClick={handleRemove}
              title="Remove photo"
            >
              <X size={14} />
            </button>
          </div>

          {exifLocation && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--found-color, #15803d)',
                background: 'var(--found-bg)',
                border: '1px solid var(--found-border)',
                padding: '4px 10px',
                borderRadius: '8px',
                maxWidth: 'fit-content',
              }}
            >
              <MapPin size={13} />
              <span>
                GPS detected in photo: {exifLocation.lat.toFixed(4)}, {exifLocation.lng.toFixed(4)}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <button
              type="button"
              onClick={() => setUploadMode('file')}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '6px',
                background: uploadMode === 'file' ? 'var(--primary)' : 'var(--bg-page)',
                color: uploadMode === 'file' ? '#fff' : 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <UploadCloud size={14} />
              Upload from Device
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('url')}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '6px',
                background: uploadMode === 'url' ? 'var(--primary)' : 'var(--bg-page)',
                color: uploadMode === 'url' ? '#fff' : 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Link2 size={14} />
              Image URL
            </button>
          </div>

          {uploadMode === 'file' ? (
            <div className="image-upload-zone">
              <label style={{ cursor: 'pointer', display: 'block' }}>
                <span style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                  <Camera size={26} color="var(--primary)" />
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>
                  Click to browse photo
                </span>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  PNG, JPG, or WEBP • Smartphone camera GPS will be auto-detected
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="url"
                placeholder="https://example.com/item-photo.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                style={{
                  padding: '8px 14px',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '13px',
                  whiteSpace: 'nowrap',
                }}
              >
                Add URL
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
