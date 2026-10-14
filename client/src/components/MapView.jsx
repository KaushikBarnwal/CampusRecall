import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Location mappings for campus landmarks with fallback coordinates
const LANDMARK_COORDINATES = {
  library: [18.6515, 73.7618],
  reading: [18.6517, 73.762],
  lab: [18.6522, 73.7612],
  canteen: [18.6508, 73.7615],
  ground: [18.6528, 73.7625],
  basketball: [18.653, 73.7628],
  auditorium: [18.6511, 73.7624],
  gate: [18.6505, 73.7608],
  hostel: [18.6535, 73.7615],
  default: [18.6518, 73.7618], // Center of PCCOE campus
};

function getCoordinatesForItem(item, index) {
  // If item has explicit coordinates (e.g. from photo EXIF or device GPS)
  if (
    item.coordinates &&
    typeof item.coordinates.lat === 'number' &&
    typeof item.coordinates.lng === 'number' &&
    item.coordinates.lat !== 0 &&
    item.coordinates.lng !== 0
  ) {
    return [item.coordinates.lat, item.coordinates.lng];
  }

  const loc = (item.location || '').toLowerCase();
  let baseCoords = LANDMARK_COORDINATES.default;

  for (const [key, coords] of Object.entries(LANDMARK_COORDINATES)) {
    if (loc.includes(key)) {
      baseCoords = coords;
      break;
    }
  }

  // Add deterministic slight offset based on index so fallback pins in the same building don't overlap completely
  const jitterLat = ((index % 5) - 2) * 0.0003;
  const jitterLng = (((index * 3) % 5) - 2) * 0.0003;

  return [baseCoords[0] + jitterLat, baseCoords[1] + jitterLng];
}

export default function MapView({ items }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: LANDMARK_COORDINATES.default,
      zoom: 17,
    });
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Add Markers
    const bounds = L.latLngBounds();

    items.forEach((item, index) => {
      const isLost = item.type === 'LOST';
      const hasExactGps = Boolean(
        item.isGeoTagged ||
          (item.coordinates && typeof item.coordinates.lat === 'number' && item.coordinates.lat !== 0)
      );
      const coords = getCoordinatesForItem(item, index);
      bounds.extend(coords);

      // Pin Color: Red for lost, Green for found
      const pinColor = isLost ? '#c2410c' : '#15803d';
      const shadowEffect = hasExactGps
        ? '0 0 14px rgba(21, 128, 61, 0.8), 0 4px 10px rgba(0,0,0,0.35)'
        : '0 4px 10px rgba(0,0,0,0.35)';

      // Custom SVG Div Icon with Geo-Tag indication
      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div style="
            background-color: ${pinColor};
            width: ${hasExactGps ? '32px' : '28px'};
            height: ${hasExactGps ? '32px' : '28px'};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: ${hasExactGps ? '2.5px solid #ffffff' : '2px solid #ffffff'};
            box-shadow: ${shadowEffect};
            position: relative;
          ">
            <div style="
              width: ${hasExactGps ? '12px' : '10px'};
              height: ${hasExactGps ? '12px' : '10px'};
              background-color: #ffffff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              ${hasExactGps ? '<span style="font-size: 8px; transform: rotate(45deg);">📍</span>' : ''}
            </div>
          </div>
        `,
        iconSize: [hasExactGps ? 32 : 28, hasExactGps ? 32 : 28],
        iconAnchor: [hasExactGps ? 16 : 14, hasExactGps ? 32 : 28],
        popupAnchor: [0, hasExactGps ? -32 : -28],
      });

      const marker = L.marker(coords, { icon: customIcon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="font-family: inherit; min-width: 190px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
            <span style="
              font-size: 10px;
              font-weight: 800;
              padding: 2px 6px;
              border-radius: 4px;
              background: ${isLost ? 'var(--lost-bg)' : 'var(--found-bg)'};
              color: ${isLost ? 'var(--lost-color)' : 'var(--found-color)'}; border: 1px solid ${isLost ? 'var(--lost-border)' : 'var(--found-border)'};
            ">
              ${isLost ? 'LOST' : 'FOUND'}
            </span>
            <span style="font-size: 11px; color: var(--text-muted); font-weight: 600;">
              ${item.category}
            </span>
          </div>

          <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: var(--text-main);">
            ${item.title}
          </h4>

          <p style="margin: 0 0 6px; font-size: 12px; color: var(--text-muted);">
            📍 ${item.location}
          </p>

          ${
            hasExactGps
              ? `<div style="
                  margin-bottom: 8px;
                  padding: 4px 8px;
                  background: var(--found-bg);
                  border: 1px solid var(--found-border);
                  border-radius: 6px;
                  font-size: 11px;
                  color: var(--found-color);
                  font-weight: 700;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                ">
                  <span>📍 Exact GPS Pinned</span>
                  <a href="https://www.google.com/maps?q=${coords[0]},${coords[1]}" target="_blank" rel="noreferrer" style="color: var(--primary); text-decoration: none; font-size: 10px; font-weight: 700;">Google Maps ↗</a>
                </div>`
              : ''
          }

          ${
            item.imageUrl
              ? `<div style="width: 100%; height: 85px; border-radius: 6px; overflow: hidden; margin-bottom: 8px;">
                  <img src="${item.imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
                 </div>`
              : ''
          }

          <div style="font-size: 11px; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 6px;">
            Contact: <strong style="color: var(--text-main);">${item.contact}</strong>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
    });

    if (items.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [items]);

  return (
    <div style={{ position: 'relative' }}>
      <div ref={mapContainerRef} className="leaflet-container" />

      {/* Map Legend Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          background: 'rgba(28, 25, 23, 0.92)',
          backdropFilter: 'blur(6px)',
          color: '#fff',
          padding: '8px 14px',
          borderRadius: '8px',
          zIndex: 1000,
          fontSize: '11px',
          display: 'flex',
          gap: '14px',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#c2410c', display: 'inline-block' }} />
          <span>Lost</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#15803d', display: 'inline-block' }} />
          <span>Found</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '11px' }}>📍</span>
          <span>Exact GPS</span>
        </div>
      </div>
    </div>
  );
}
