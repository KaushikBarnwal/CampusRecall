import { useState } from 'react';
import { X, User, Shield, LogIn, UserCheck, Check } from 'lucide-react';
import { PRESET_USERS } from '../constants/users';

export default function AuthModal({ currentUser, onSelectUser, onClose }) {
  const [activeTab, setActiveTab] = useState('presets'); // 'presets' or 'custom'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSelectUser({
      id: 'custom_' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      badge: role === 'admin' ? '🛡️ Admin' : '👤 Student',
    });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(20, 18, 16, 0.72)',
        backdropFilter: 'blur(4px)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'modalFadeIn 0.2s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-page)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={18} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
              User Authentication & Role Switcher
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'var(--border-subtle)', border: 'none', padding: '6px', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '13px',
              fontWeight: 700,
              background: activeTab === 'presets' ? 'var(--bg-card)' : 'var(--bg-page)',
              borderBottom: activeTab === 'presets' ? '2px solid var(--primary)' : 'none',
              color: activeTab === 'presets' ? 'var(--primary)' : 'var(--text-muted)',
              borderRadius: 0,
            }}
          >
            Switch Test Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '13px',
              fontWeight: 700,
              background: activeTab === 'custom' ? 'var(--bg-card)' : 'var(--bg-page)',
              borderBottom: activeTab === 'custom' ? '2px solid var(--primary)' : 'none',
              color: activeTab === 'custom' ? 'var(--primary)' : 'var(--text-muted)',
              borderRadius: 0,
            }}
          >
            Custom Sign In
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }}>
          {activeTab === 'presets' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'var(--text-muted)' }}>
                Select a profile to test role-based permissions (Creator vs Admin vs Visitor):
              </p>
              {PRESET_USERS.map((u) => {
                const isCurrent = currentUser?.email === u.email;
                return (
                  <div
                    key={u.id}
                    onClick={() => {
                      onSelectUser(u);
                      onClose();
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: `1.5px solid ${isCurrent ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      background: isCurrent ? 'var(--primary-light)' : 'var(--bg-page)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {u.role === 'admin' ? (
                          <Shield size={14} color="var(--lost-color, #c2410c)" />
                        ) : (
                          <User size={14} color="var(--primary)" />
                        )}
                        <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>{u.name}</strong>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                        {u.email} • <span style={{ color: 'var(--primary)' }}>{u.badge}</span>
                      </span>
                    </div>

                    {isCurrent && (
                      <span
                        style={{
                          background: 'var(--primary)',
                          color: '#fff',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Check size={12} /> Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. user@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Role / Permissions
                </label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="user">Regular User (Can manage own items)</option>
                  <option value="admin">Administrator / Security Desk (Can manage all)</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '8px',
                  padding: '10px',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  fontSize: '14px',
                  borderRadius: '8px',
                  fontWeight: 600,
                }}
              >
                <LogIn size={15} />
                Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
