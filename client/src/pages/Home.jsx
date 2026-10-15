import SearchFilter from '../components/SearchFilter';
import ItemList from '../components/ItemList';
import MapView from '../components/MapView';

export default function Home({
  items,
  currentUser,
  searchKeyword,
  setSearchKeyword,
  selectedCategory,
  setSelectedCategory,
  filterType,
  setFilterType,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  dateRange,
  setDateRange,
  viewMode = 'list',
  setViewMode,
  onUpdateStatus,
  onDeleteItem,
  counts,
  onOpenMatches,
  onOpenPoster,
  onOpenClaim,
  isMyReportsView = false,
}) {
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 className="page-header-title" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
          {isMyReportsView ? '📋 My Reported Belongings' : 'CampusRecall • Lost & Found Portal'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          {isMyReportsView
            ? `Viewing listings reported by you (${currentUser?.email}). You can update statuses or remove them once resolved.`
            : 'Explore campus map pins, search reported items, verify belongings with proof of ownership, and coordinate safe returns.'}
        </p>
      </div>

      <SearchFilter
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
        viewMode={viewMode}
        setViewMode={setViewMode}
        counts={counts}
      />

      {viewMode === 'map' ? (
        <MapView
          items={items}
          onOpenMatches={onOpenMatches}
          onOpenClaim={onOpenClaim}
        />
      ) : (
        <ItemList
          items={items}
          currentUser={currentUser}
          onUpdateStatus={onUpdateStatus}
          onDeleteItem={onDeleteItem}
          onOpenMatches={onOpenMatches}
          onOpenPoster={onOpenPoster}
          onOpenClaim={onOpenClaim}
        />
      )}
    </div>
  );
}