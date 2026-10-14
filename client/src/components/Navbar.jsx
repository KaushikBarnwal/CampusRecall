import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  FolderHeart,
  Plus,
  AlertCircle,
  CheckCircle2,
  User,
  Shield,
  Database,
  HardDrive,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';

export default function Navbar({
  currentUser,
  myReportsCount = 0,
  dataSource = 'connecting',
  theme = 'light',
  onToggleTheme,
  onOpenAuth,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const reportMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  const isAdmin = currentUser?.role === 'admin';

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (reportMenuRef.current && !reportMenuRef.current.contains(event.target)) {
        setReportDropdownOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U';
  };

  const isBrowseActive = location.pathname === '/' || location.pathname === '/map';
  const isMyReportsActive = location.pathname === '/my-reports';

  return (
    <header
      style={{
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--nav-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 16px rgba(20, 18, 16, 0.18)',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {/* Left Side: Brand Logo & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            onClick={() => navigate('/')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--nav-surface)',
                padding: '7px',
                borderRadius: '10px',
                border: '1px solid var(--nav-surface-border)',
              }}
            >
              <Compass size={20} color="var(--nav-accent)" />
            </span>
            <span
              style={{
                fontSize: '17px',
                fontWeight: 800,
                color: 'var(--nav-text)',
                letterSpacing: '-0.3px',
              }}
            >
              CampusRecall
            </span>
          </div>

          <nav style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: isBrowseActive ? 700 : 500,
                background: isBrowseActive ? 'var(--nav-surface)' : 'transparent',
                color: isBrowseActive ? 'var(--nav-accent)' : 'var(--nav-muted)',
                borderRadius: '8px',
                border: isBrowseActive ? '1px solid var(--nav-surface-border)' : '1px solid transparent',
              }}
            >
              Browse
            </button>

            <button
              type="button"
              onClick={() => navigate('/my-reports')}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: isMyReportsActive ? 700 : 500,
                background: isMyReportsActive ? 'var(--nav-surface)' : 'transparent',
                color: isMyReportsActive ? 'var(--nav-accent)' : 'var(--nav-muted)',
                borderRadius: '8px',
                border: isMyReportsActive ? '1px solid var(--nav-surface-border)' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <FolderHeart size={14} />
              <span>My Reports</span>
              {myReportsCount > 0 && (
                <span
                  style={{
                    background: 'var(--primary)',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: '10px',
                  }}
                >
                  {myReportsCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Right Side: Theme Toggle + "+ Report" + Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Dark Mode / Light Mode Toggle */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              style={{
                padding: '8px',
                background: 'var(--nav-surface)',
                color: theme === 'dark' ? '#fbbf24' : 'var(--nav-muted)',
                border: '1px solid var(--nav-surface-border)',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={theme === 'dark' ? 'Switch to Warm Stone (Light Mode)' : 'Switch to Warm Obsidian (Dark Mode)'}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}

          {/* Unified "+ Report" Dropdown */}
          <div ref={reportMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setReportDropdownOpen((prev) => !prev)}
              style={{
                padding: '7px 14px',
                fontSize: '13px',
                fontWeight: 700,
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(35, 93, 65, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={15} />
              <span>Report</span>
              <ChevronDown size={14} style={{ opacity: 0.8 }} />
            </button>

            {reportDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  background: 'var(--bg-card)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-subtle)',
                  padding: '6px',
                  minWidth: '200px',
                  zIndex: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    navigate('/report-lost');
                    setReportDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: location.pathname === '/report-lost' ? 'var(--lost-bg)' : 'transparent',
                    color: 'var(--lost-color)',
                    textAlign: 'left',
                    fontSize: '13px',
                    justifyContent: 'flex-start',
                  }}
                >
                  <AlertCircle size={16} color="var(--lost-color)" />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main)' }}>Report Lost Item</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>I lost something</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate('/report-found');
                    setReportDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: location.pathname === '/report-found' ? 'var(--found-bg)' : 'transparent',
                    color: 'var(--found-color)',
                    textAlign: 'left',
                    fontSize: '13px',
                    justifyContent: 'flex-start',
                  }}
                >
                  <CheckCircle2 size={16} color="var(--found-color)" />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main)' }}>Report Found Item</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>I found an item</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown */}
          <div ref={profileMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              style={{
                padding: '4px 8px 4px 4px',
                fontSize: '12px',
                background: 'var(--nav-surface)',
                color: 'var(--nav-text)',
                border: '1px solid var(--nav-surface-border)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              title="Account Menu"
            >
              <span
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: isAdmin ? 'var(--lost-color)' : 'var(--primary)',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {getInitials(currentUser?.name)}
              </span>

              <span style={{ fontWeight: 600, color: 'var(--nav-text)' }}>
                {currentUser?.name ? currentUser.name.split(' ')[0] : 'Account'}
              </span>

              {isAdmin && (
                <span
                  style={{
                    background: 'var(--lost-color)',
                    color: '#fff',
                    fontSize: '9px',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    fontWeight: 800,
                  }}
                >
                  ADMIN
                </span>
              )}

              <ChevronDown size={13} style={{ opacity: 0.6 }} />
            </button>

            {profileDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  background: 'var(--bg-card)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-subtle)',
                  padding: '12px',
                  minWidth: '240px',
                  zIndex: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isAdmin ? <Shield size={16} color="var(--lost-color)" /> : <User size={16} color="var(--primary)" />}
                    <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>{currentUser?.name}</strong>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                    {currentUser?.email}
                  </span>
                  <div style={{ marginTop: '6px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: isAdmin ? 'rgba(194, 65, 12, 0.15)' : 'rgba(35, 93, 65, 0.15)',
                        color: isAdmin ? 'var(--lost-color)' : 'var(--primary)',
                      }}
                    >
                      {isAdmin ? '🛡️ Central Security Admin' : '👤 Student / User'}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    color: dataSource === 'backend' ? 'var(--found-color)' : 'var(--claimed-color)',
                    background: dataSource === 'backend' ? 'var(--found-bg)' : 'var(--claimed-bg)',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: `1px solid ${dataSource === 'backend' ? 'var(--found-border)' : 'var(--claimed-border)'}`,
                  }}
                >
                  {dataSource === 'backend' ? <Database size={13} /> : <HardDrive size={13} />}
                  <span>{dataSource === 'backend' ? 'MongoDB Connected' : 'Local Storage Mode'}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenAuth();
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '12px',
                    background: 'var(--bg-subtle)',
                    color: 'var(--text-main)',
                    borderRadius: '8px',
                    fontWeight: 600,
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  Switch User / Role
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}