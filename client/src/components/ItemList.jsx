import { SearchX } from 'lucide-react';
import ItemCard from './ItemCard';

export default function ItemList({
  items,
  currentUser,
  onUpdateStatus,
  onDeleteItem,
  onOpenMatches,
  onOpenPoster,
  onOpenClaim,
}) {
  if (items.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px dashed var(--border-subtle)',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <SearchX size={44} color="var(--text-muted)" />
        </div>
        <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '6px' }}>
          No matching items found
        </h3>
        <p style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto', color: 'var(--text-muted)' }}>
          Try clearing your search query, selecting "All Types", or checking another category.
        </p>
      </div>
    );
  }

  return (
    <div>
      {items.map((item) => (
        <ItemCard
          key={item._id || item.id}
          item={item}
          currentUser={currentUser}
          onUpdateStatus={onUpdateStatus}
          onDeleteItem={onDeleteItem}
          onOpenMatches={onOpenMatches}
          onOpenPoster={onOpenPoster}
          onOpenClaim={onOpenClaim}
        />
      ))}
    </div>
  );
}