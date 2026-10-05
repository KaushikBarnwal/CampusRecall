import { useState, useRef, useEffect } from 'react';
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
  currentView,
  setCurrentView,
  currentUser,
  myReportsCount = 0,
  dataSource = 'connecting',
  theme = 'light',
  onToggleTheme,
  onOpenAuth,
}) {
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

  return (
    <header
      style={{
        background: '#0f172a',
        borderBottom: '1px solid #1e293b',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
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
            onClick={() => setCurrentView('home')}
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
                background: '#1e293b',
                padding: '7px',
                borderRadius: '10px',
                border: '1px solid #334155',
              }}
            >
              <Compass size={20} color="#38bdf8" />
            </span>
            <span
              style={{
                fontSize: '17px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.3px',
              }}
            >
              CampusRecall
            </span>
          </div>

          <nav style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: currentView === 'home' ? 700 : 500,
                background: currentView === 'home' ? '#1e293b' : 'transparent',
                color: currentView === 'home' ? '#38bdf8' : '#94a3b8',
                borderRadius: '8px',
              }}
            >
              Browse
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('my-reports')}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: currentView === 'my-reports' ? 700 : 500,
                background: currentView === 'my-reports' ? '#1e293b' : 'transparent',
                color: currentView === 'my-reports' ? '#38bdf8' : '#94a3b8',
                borderRadius: '8px',
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
                    background: '#2563eb',
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
                background: '#1e293b',
                color: theme === 'dark' ? '#f59e0b' : '#94a3b8',
                border: '1px solid #334155',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
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
                backgroundColor: '#2563eb',
                color: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(37,99,235,0.2)',
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
                  background: 'var(--bg-card, #ffffff)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-subtle, #e2e8f0)',
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
                    setCurrentView('report-lost');
                    setReportDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: currentView === 'report-lost' ? 'var(--lost-bg, #fef2f2)' : 'transparent',
                    color: '#ef4444',
                    textAlign: 'left',
                    fontSize: '13px',
                    justifyContent: 'flex-start',
                  }}
                >
                  <AlertCircle size={16} color="#ef4444" />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main, #0f172a)' }}>Report Lost Item</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>I lost something</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('report-found');
                    setReportDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: currentView === 'report-found' ? 'var(--found-bg, #ecfdf5)' : 'transparent',
                    color: '#10b981',
                    textAlign: 'left',
                    fontSize: '13px',
                    justifyContent: 'flex-start',
                  }}
                >
                  <CheckCircle2 size={16} color="#10b981" />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main, #0f172a)' }}>Report Found Item</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>I found an item</span>
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
                background: '#1e293b',
                color: '#e2e8f0',
                border: '1px solid #334155',
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
                  background: isAdmin ? '#ef4444' : '#2563eb',
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

              <span style={{ fontWeight: 600, color: '#f8fafc' }}>
                {currentUser?.name ? currentUser.name.split(' ')[0] : 'Account'}
              </span>

              {isAdmin && (
                <span
                  style={{
                    background: '#ef4444',
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
                  background: 'var(--bg-card, #ffffff)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-subtle, #e2e8f0)',
                  padding: '12px',
                  minWidth: '240px',
                  zIndex: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ borderBottom: '1px solid var(--border-subtle, #f1f5f9)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isAdmin ? <Shield size={16} color="#ef4444" /> : <User size={16} color="#2563eb" />}
                    <strong style={{ fontSize: '14px', color: 'var(--text-main, #0f172a)' }}>{currentUser?.name}</strong>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)', display: 'block', marginTop: '2px' }}>
                    {currentUser?.email}
                  </span>
                  <div style={{ marginTop: '6px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: isAdmin ? 'rgba(239, 68, 68, 0.15)' : 'rgba(37, 99, 235, 0.15)',
                        color: isAdmin ? '#ef4444' : '#3b82f6',
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
                    color: dataSource === 'backend' ? '#10b981' : '#f59e0b',
                    background: dataSource === 'backend' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                    padding: '6px 8px',
                    borderRadius: '6px',
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
                    background: 'var(--bg-page, #f1f5f9)',
                    color: 'var(--text-main, #0f172a)',
                    borderRadius: '6px',
                    fontWeight: 600,
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