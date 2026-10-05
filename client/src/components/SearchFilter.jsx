import { memo } from 'react';
import {
  Search,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Clock,
  CheckCheck,
  LayoutList,
  MapPin,
  ArrowUpDown,
  Calendar,
} from 'lucide-react';

function SearchFilter({
  searchKeyword,
  setSearchKeyword,
  selectedCategory,
  setSelectedCategory,
  filterType,
  setFilterType,
  statusFilter = 'All',
  setStatusFilter,
  sortBy = 'newest',
  setSortBy,
  dateRange = 'all',
  setDateRange,
  viewMode = 'list',
  setViewMode,
  counts = {},
}) {
  const categories = [
    'All',
    'Electronics',
    'Personal Items',
    'Wallets',
    'Keys',
    'Documents',
    'Clothing',
    'Bags',
    'Other',
  ];

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        padding: '20px',
        borderRadius: '16px',
        marginBottom: '24px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Search Input Bar + View Switcher */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px', display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              position: 'absolute',
              left: '14px',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <Search size={18} color="#94a3b8" />
          </span>
          <input
            type="text"
            placeholder="Search by keyword, item name, or location..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{
              paddingLeft: '42px',
              paddingRight: searchKeyword ? '38px' : '14px',
              fontSize: '14px',
              height: '42px',
              borderRadius: '10px',
            }}
          />
          {searchKeyword && (
            <button
              type="button"
              onClick={() => setSearchKeyword('')}
              style={{
                position: 'absolute',
                right: '10px',
                background: 'transparent',
                color: '#94a3b8',
                padding: '6px',
              }}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {/* View Mode Toggle (List vs Map) */}
        {setViewMode && (
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-page)',
              padding: '3px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '8px',
                background: viewMode === 'list' ? 'var(--bg-card)' : 'transparent',
                color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <LayoutList size={14} />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '8px',
                background: viewMode === 'map' ? 'var(--bg-card)' : 'transparent',
                color: viewMode === 'map' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: viewMode === 'map' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <MapPin size={14} />
              <span>Map View</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Row 1: Type Pills & Status Pills */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Type Filter Pills (LOST vs FOUND) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>Type:</span>
          <div className="filter-pills-group">
            <button
              type="button"
              className={`filter-pill ${filterType === 'All' ? 'active' : ''}`}
              onClick={() => setFilterType('All')}
            >
              All {counts.total !== undefined ? `(${counts.total})` : ''}
            </button>
            <button
              type="button"
              className={`filter-pill ${filterType === 'LOST' ? 'active-lost' : ''}`}
              onClick={() => setFilterType('LOST')}
            >
              <AlertCircle size={14} />
              Lost {counts.lost !== undefined ? `(${counts.lost})` : ''}
            </button>
            <button
              type="button"
              className={`filter-pill ${filterType === 'FOUND' ? 'active-found' : ''}`}
              onClick={() => setFilterType('FOUND')}
            >
              <CheckCircle2 size={14} />
              Found {counts.found !== undefined ? `(${counts.found})` : ''}
            </button>
          </div>
        </div>

        {/* Status Filter Pills (OPEN vs CLAIMED vs RESOLVED) */}
        {setStatusFilter && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>Status:</span>
            <div className="filter-pills-group">
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'All' ? 'active' : ''}`}
                onClick={() => setStatusFilter('All')}
              >
                All
              </button>
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'OPEN' ? 'active' : ''}`}
                onClick={() => setStatusFilter('OPEN')}
              >
                <Sparkles size={13} />
                Active
              </button>
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'CLAIMED' ? 'active' : ''}`}
                onClick={() => setStatusFilter('CLAIMED')}
              >
                <Clock size={13} />
                Claimed
              </button>
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'RESOLVED' ? 'active' : ''}`}
                onClick={() => setStatusFilter('RESOLVED')}
              >
                <CheckCheck size={13} />
                Resolved
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Row 2: Category Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>Category:</span>
        <div className="filter-pills-group" style={{ overflowX: 'auto', paddingBottom: '2px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
              style={{ fontSize: '12px', padding: '4px 12px' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {/* Filter Row 3: Sort Options & Date Range Filter (Option 4) */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Date Range Selector */}
        {setDateRange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} /> Date:
            </span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '6px',
                width: 'auto',
                fontWeight: 600,
              }}
            >
              <option value="all">All Time</option>
              <option value="24h">Past 24 Hours</option>
              <option value="7d">Past 7 Days</option>
              <option value="30d">Past 30 Days</option>
            </select>
          </div>
        )}
        {/* Sort Order Selector */}
        {setSortBy && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpDown size={13} /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '6px',
                width: 'auto',
                fontWeight: 600,
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(SearchFilter);