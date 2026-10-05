import { useState, useEffect, useMemo, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { initialItems } from './data/sampleItems';
import { itemService } from './services/itemService';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportLostItem from './pages/ReportLostItem';
import ReportFoundItem from './pages/ReportFoundItem';
import SmartMatchModal from './components/SmartMatchModal';
import PosterModal from './components/PosterModal';
import AuthModal from './components/AuthModal';
import { PRESET_USERS } from './constants/users';
import ClaimModal from './components/ClaimModal';
import ToastContainer from './components/ToastContainer';
import ConfirmModal from './components/ConfirmModal';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('connecting');

  // Dark / Light Mode state
  const [theme, setTheme] = useState(() => localStorage.getItem('lost_and_found_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lost_and_found_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Toast Notifications system
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lost_and_found_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall through
      }
    }
    return PRESET_USERS[0]; // Default: Student 1 (Kaushik)
  });

  // Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeClaimItem, setActiveClaimItem] = useState(null);
  const [activeMatchItem, setActiveMatchItem] = useState(null);
  const [activePosterItem, setActivePosterItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Search, Filter, Sort & Date states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [dateRange, setDateRange] = useState('all');

  // User switch handler
  const handleSelectUser = useCallback((user) => {
    setCurrentUser(user);
    localStorage.setItem('lost_and_found_user', JSON.stringify(user));
    addToast(`Switched profile to ${user.name}`, 'info');
  }, [addToast]);

  // Load items on initial mount
  useEffect(() => {
    async function loadItems() {
      setLoading(true);
      try {
        const { data, source } = await itemService.getItems();
        setDataSource(source);
        if (data && data.length > 0) {
          setItems(data);
        } else {
          setItems(initialItems);
        }
      } catch (err) {
        console.error('Error fetching items:', err);
        setItems(initialItems);
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

  // Add new item (calls backend API + persists with createdBy)
  const handleAddItem = useCallback(async (newItemData) => {
    try {
      const savedItem = await itemService.createItem(newItemData);
      setItems((prev) => [savedItem, ...prev]);
      navigate('/');
      addToast('Listing published successfully!', 'success');
    } catch (err) {
      console.error('Error creating item:', err);
      const fallbackItem = { ...newItemData, _id: 'local_' + Date.now() };
      setItems((prev) => [fallbackItem, ...prev]);
      navigate('/');
      addToast('Saved listing locally (offline mode)', 'info');
    }
  }, [navigate, addToast]);

  // Update item status (e.g. OPEN -> CLAIMED -> RESOLVED) with optional claimData
  const handleUpdateStatus = useCallback(async (itemId, newStatus, claimData = null) => {
    try {
      await itemService.updateStatus(itemId, newStatus, claimData);
      setItems((prev) =>
        prev.map((item) => {
          if (item._id === itemId || item.id === itemId) {
            const existingClaims = item.claims || [];
            const updatedClaims = claimData ? [...existingClaims, claimData] : existingClaims;
            return { ...item, status: newStatus, claims: updatedClaims };
          }
          return item;
        })
      );
      addToast(`Status updated to ${newStatus}`, 'info');
    } catch (err) {
      console.error('Error updating status:', err);
      addToast('Failed to update status', 'error');
    }
  }, [addToast]);

  // Delete item with custom confirm modal
  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;
    try {
      await itemService.deleteItem(itemToDelete._id || itemToDelete.id);
      setItems((prev) => prev.filter((i) => i._id !== itemToDelete._id && i.id !== itemToDelete.id));
      addToast(`Deleted "${itemToDelete.title}"`, 'info');
    } catch (err) {
      console.error('Error deleting item:', err);
      addToast('Error removing item', 'error');
    } finally {
      setItemToDelete(null);
    }
  }, [itemToDelete, addToast]);

  // Submit claim on an item
  const handleSubmitClaim = useCallback(async (itemId, claimData) => {
    await handleUpdateStatus(itemId, 'CLAIMED', claimData);
    addToast('Claim request sent to poster with proof details!', 'success');
  }, [handleUpdateStatus, addToast]);

  // Performance Optimization: Memoized My Reports count
  const userEmail = currentUser?.email?.toLowerCase();
  const myReportsCount = useMemo(() => {
    return items.filter((i) => {
      const contactMatch = i.contact?.toLowerCase() === userEmail;
      const creatorMatch = i.createdBy?.email?.toLowerCase() === userEmail;
      return contactMatch || creatorMatch;
    }).length;
  }, [items, userEmail]);

  // Performance Optimization: Memoized filtered items per current route
  const isMyReportsRoute = location.pathname === '/my-reports';

  const displayedSourceItems = useMemo(() => {
    if (!isMyReportsRoute) return items;
    return items.filter((i) => {
      const contactMatch = i.contact?.toLowerCase() === userEmail;
      const creatorMatch = i.createdBy?.email?.toLowerCase() === userEmail;
      return currentUser?.role === 'admin' ? true : contactMatch || creatorMatch;
    });
  }, [items, isMyReportsRoute, userEmail, currentUser?.role]);

  // Performance Optimization: Memoized multi-criteria search, filter, and sort calculations
  const filteredItems = useMemo(() => {
    return displayedSourceItems
      .filter((item) => {
        const itemStatus = item.status || 'OPEN';
        const matchesKeyword =
          item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.location.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchKeyword.toLowerCase()));

        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesType = filterType === 'All' || item.type === filterType;
        const matchesStatus = statusFilter === 'All' || itemStatus === statusFilter;

        // Date range filter
        let matchesDate = true;
        if (dateRange !== 'all') {
          const itemDate = new Date(item.date || item.createdAt);
          const now = new Date();
          const diffHours = (now - itemDate) / (1000 * 60 * 60);

          if (dateRange === '24h') matchesDate = diffHours <= 24;
          else if (dateRange === '7d') matchesDate = diffHours <= 24 * 7;
          else if (dateRange === '30d') matchesDate = diffHours <= 24 * 30;
        }

        return matchesKeyword && matchesCategory && matchesType && matchesStatus && matchesDate;
      })
      .sort((a, b) => {
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        const dateA = new Date(a.date || a.createdAt || 0).getTime();
        const dateB = new Date(b.date || b.createdAt || 0).getTime();
        if (sortBy === 'oldest') {
          return dateA - dateB;
        }
        return dateB - dateA; // 'newest' default
      });
  }, [displayedSourceItems, searchKeyword, selectedCategory, filterType, statusFilter, dateRange, sortBy]);

  // Performance Optimization: Memoized count badges
  const counts = useMemo(() => {
    return {
      total: displayedSourceItems.length,
      lost: displayedSourceItems.filter((i) => i.type === 'LOST').length,
      found: displayedSourceItems.filter((i) => i.type === 'FOUND').length,
      open: displayedSourceItems.filter((i) => (i.status || 'OPEN') === 'OPEN').length,
      claimed: displayedSourceItems.filter((i) => i.status === 'CLAIMED').length,
      resolved: displayedSourceItems.filter((i) => i.status === 'RESOLVED').length,
    };
  }, [displayedSourceItems]);

  const handleToggleViewMode = useCallback((newMode) => {
    if (newMode === 'map') {
      navigate('/map');
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)' }}>
      <Navbar
        currentUser={currentUser}
        myReportsCount={myReportsCount}
        dataSource={dataSource}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <main style={{ maxWidth: '960px', margin: '20px auto', padding: '0 20px', width: '100%', flex: 1 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <Loader2 size={32} color="#2563eb" className="spin-icon" />
            </div>
            <p>Loading items from directory...</p>
          </div>
        ) : (
          <Routes>
            {/* Route 1: Browse Feed (List View) */}
            <Route
              path="/"
              element={
                <Home
                  items={filteredItems}
                  currentUser={currentUser}
                  searchKeyword={searchKeyword}
                  setSearchKeyword={setSearchKeyword}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  filterType={filterType}
                  setFilterType={setFilterType}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  viewMode="list"
                  setViewMode={handleToggleViewMode}
                  onUpdateStatus={handleUpdateStatus}
                  onDeleteItem={(id) => {
                    const it = items.find((item) => item._id === id || item.id === id);
                    setItemToDelete(it);
                  }}
                  counts={counts}
                  onOpenMatches={(item) => setActiveMatchItem(item)}
                  onOpenPoster={(item) => setActivePosterItem(item)}
                  onOpenClaim={(item) => setActiveClaimItem(item)}
                  isMyReportsView={false}
                />
              }
            />

            {/* Route 2: Interactive Campus Map View */}
            <Route
              path="/map"
              element={
                <Home
                  items={filteredItems}
                  currentUser={currentUser}
                  searchKeyword={searchKeyword}
                  setSearchKeyword={setSearchKeyword}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  filterType={filterType}
                  setFilterType={setFilterType}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  viewMode="map"
                  setViewMode={handleToggleViewMode}
                  onUpdateStatus={handleUpdateStatus}
                  onDeleteItem={(id) => {
                    const it = items.find((item) => item._id === id || item.id === id);
                    setItemToDelete(it);
                  }}
                  counts={counts}
                  onOpenMatches={(item) => setActiveMatchItem(item)}
                  onOpenPoster={(item) => setActivePosterItem(item)}
                  onOpenClaim={(item) => setActiveClaimItem(item)}
                  isMyReportsView={false}
                />
              }
            />

            {/* Route 3: My Reported Belongings View */}
            <Route
              path="/my-reports"
              element={
                <Home
                  items={filteredItems}
                  currentUser={currentUser}
                  searchKeyword={searchKeyword}
                  setSearchKeyword={setSearchKeyword}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  filterType={filterType}
                  setFilterType={setFilterType}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  viewMode="list"
                  setViewMode={handleToggleViewMode}
                  onUpdateStatus={handleUpdateStatus}
                  onDeleteItem={(id) => {
                    const it = items.find((item) => item._id === id || item.id === id);
                    setItemToDelete(it);
                  }}
                  counts={counts}
                  onOpenMatches={(item) => setActiveMatchItem(item)}
                  onOpenPoster={(item) => setActivePosterItem(item)}
                  onOpenClaim={(item) => setActiveClaimItem(item)}
                  isMyReportsView={true}
                />
              }
            />

            {/* Route 4: Report Lost Item */}
            <Route
              path="/report-lost"
              element={
                <ReportLostItem
                  currentUser={currentUser}
                  onAddItem={handleAddItem}
                  onCancel={() => navigate('/')}
                />
              }
            />

            {/* Route 5: Report Found Item */}
            <Route
              path="/report-found"
              element={
                <ReportFoundItem
                  currentUser={currentUser}
                  onAddItem={handleAddItem}
                  onCancel={() => navigate('/')}
                />
              }
            />

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>

      {/* Feature 3: Smart Match Suggestions Modal */}
      {activeMatchItem && (
        <SmartMatchModal
          item={activeMatchItem}
          allItems={items}
          onClose={() => setActiveMatchItem(null)}
        />
      )}

      {/* Feature 4: Printable Lost Poster with QR Code Modal */}
      {activePosterItem && (
        <PosterModal
          item={activePosterItem}
          onClose={() => setActivePosterItem(null)}
        />
      )}

      {/* Feature: Claim Verification Modal */}
      {activeClaimItem && (
        <ClaimModal
          item={activeClaimItem}
          currentUser={currentUser}
          onSubmitClaim={handleSubmitClaim}
          onClose={() => setActiveClaimItem(null)}
        />
      )}

      {/* Feature: User Auth & Role Switcher Modal */}
      {isAuthModalOpen && (
        <AuthModal
          currentUser={currentUser}
          onSelectUser={handleSelectUser}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {/* Feature: Custom Delete Confirmation Dialog */}
      {itemToDelete && (
        <ConfirmModal
          title="Delete Listing"
          message={`Are you sure you want to permanently remove "${itemToDelete.title}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setItemToDelete(null)}
        />
      )}

      {/* Option 2: Floating Animated Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}