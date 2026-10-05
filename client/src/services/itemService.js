const API_BASE_URL = 'http://localhost:5000/api/items';
const STORAGE_KEY = 'lost_and_found_items_fallback';

export const itemService = {
  // Fetch all items from backend with localStorage fallback
  async getItems() {
    try {
      const response = await fetch(API_BASE_URL, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        // Cache into localStorage as backup
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.data));
        return { data: data.data, source: 'backend' };
      }
    } catch (err) {
      console.warn('Backend unavailable, reading from local cache...', err.message);
    }
    // Fallback to localStorage if backend is offline
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        return { data: JSON.parse(cached), source: 'local' };
      } catch {
        // Ignore parse error
      }
    }
    return { data: null, source: 'none' };
  },

  // Create a new item report
  async createItem(itemData) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      if (response.ok) {
        const result = await response.json();
        return result.data;
      }
    } catch (err) {
      console.warn('Could not post to backend, saving locally:', err.message);
    }
    // Local fallback: create local item with mock ID
    const localItem = {
      ...itemData,
      _id: 'local_' + Date.now(),
      status: itemData.status || 'OPEN',
      createdAt: new Date().toISOString(),
    };
    // Update local cache
    const cached = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    localStorage.setItem(STORAGE_KEY, JSON.stringify([localItem, ...cached]));
    return localItem;
  },

  // Update item status (e.g. OPEN -> CLAIMED -> RESOLVED) with optional claimData
  async updateStatus(id, newStatus, claimData = null) {
    try {
      // If not a local mock id, send to backend
      if (!id.toString().startsWith('local_')) {
        const response = await fetch(`${API_BASE_URL}/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus, claimData }),
        });
        if (response.ok) {
          const result = await response.json();
          return result.data;
        }
      }
    } catch (err) {
      console.warn('Backend status update failed, updating locally:', err.message);
    }
    // Local cache update
    const cached = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = cached.map((it) => {
      if (it._id === id || it.id === id) {
        const existingClaims = it.claims || [];
        const newClaims = claimData ? [...existingClaims, claimData] : existingClaims;
        return { ...it, status: newStatus, claims: newClaims };
      }
      return it;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { _id: id, status: newStatus };
  },

  // Delete an item
  async deleteItem(id) {
    try {
      if (!id.toString().startsWith('local_')) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          return true;
        }
      }
    } catch (err) {
      console.warn('Backend delete failed, removing locally:', err.message);
    }
    const cached = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = cached.filter((it) => it._id !== id && it.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  // Get potential matches for an item
  async getMatches(item, allItems = []) {
    if (item._id && !item._id.toString().startsWith('local_')) {
      try {
        const response = await fetch(`${API_BASE_URL}/${item._id}/matches`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data?.length > 0) {
            return result.data;
          }
        }
      } catch (err) {
        console.warn('Backend match fetch failed, computing locally:', err.message);
      }
    }
    // Client-side matching fallback
    const oppositeType = item.type === 'LOST' ? 'FOUND' : 'LOST';
    const words = (item.title || '').toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    return allItems
      .filter((other) => {
        if ((other._id || other.id) === (item._id || item.id)) return false;
        if (other.type !== oppositeType) return false;
        if (other.status === 'RESOLVED') return false;
        const sameCategory = other.category === item.category;
        const otherText = `${other.title} ${other.description || ''} ${other.location}`.toLowerCase();
        const hasCommonWords = words.some((w) => otherText.includes(w));
        return sameCategory || hasCommonWords;
      })
      .slice(0, 5);
  },
};
