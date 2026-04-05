import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard',   icon: '📊', path: '/admin/dashboard' },
  { key: 'orders',    label: 'Orders',       icon: '📦', path: '/admin/orders' },
  { key: 'products',  label: 'Products',     icon: '🕯️', path: '/admin/products' },
  { key: 'admins',    label: 'Admin Users',  icon: '👤', path: '/admin/users' },
  { key: 'settings',  label: 'Settings',     icon: '⚙️', path: '/admin/settings' },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { navigate('/admin/login'); return; }
    const info = localStorage.getItem('adminInfo');
    if (info) setAdminInfo(JSON.parse(info));
  }, [navigate]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  const activeKey = NAV_ITEMS.find(n => location.pathname.startsWith(n.path))?.key || 'dashboard';
  const effectiveOpen = isMobile ? mobileOpen : sidebarOpen;
  const sidebarWidth = effectiveOpen ? '260px' : (isMobile ? '0px' : '72px');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Montserrat', sans-serif; }

        .admin-layout { display: flex; min-height: 100vh; background: #f5f3ff; }

        /* Overlay for mobile */
        .sidebar-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 99;
        }
        .sidebar-overlay.visible { display: block; }

        /* SIDEBAR */
        .sidebar {
          width: ${sidebarWidth};
          min-height: 100vh;
          background: linear-gradient(180deg, #1a0533 0%, #2d0a5e 60%, #1e1040 100%);
          display: flex; flex-direction: column;
          transition: width 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1);
          position: fixed; top: 0; left: 0; z-index: 100;
          overflow: hidden;
        }

        .sidebar-logo {
          display: flex; align-items: center; gap: 12px;
          padding: 28px 20px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          white-space: nowrap;
        }
        .logo-icon {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: linear-gradient(135deg, #9333ea, #ec4899);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; box-shadow: 0 4px 12px rgba(147,51,234,0.4);
        }
        .logo-text {
          font-family: 'Playfair Display', serif; color: #fff;
          font-size: 16px; font-weight: 700;
          opacity: ${effectiveOpen ? 1 : 0};
          transition: opacity 0.2s;
          white-space: nowrap; overflow: hidden;
        }

        .nav-section { flex: 1; padding: 16px 12px; overflow-y: auto; }
        .nav-label {
          color: rgba(255,255,255,0.25); font-size: 9px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          padding: 8px 12px 6px;
          opacity: ${effectiveOpen ? 1 : 0}; transition: opacity 0.15s;
          white-space: nowrap;
        }
        .nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 12px; border-radius: 12px; margin-bottom: 2px;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
          color: rgba(255,255,255,0.55); font-size: 13px; font-weight: 500;
          letter-spacing: 0.02em; position: relative; overflow: hidden;
        }
        .nav-item:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
        .nav-item.active {
          background: linear-gradient(135deg, rgba(147,51,234,0.35), rgba(236,72,153,0.2));
          color: #fff; border: 1px solid rgba(147,51,234,0.3);
        }
        .nav-item.active::before {
          content: ''; position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 3px; background: linear-gradient(#9333ea, #ec4899);
          border-radius: 0 4px 4px 0;
        }
        .nav-icon { font-size: 18px; flex-shrink: 0; width: 22px; text-align: center; }
        .nav-text {
          opacity: ${effectiveOpen ? 1 : 0};
          transition: opacity 0.15s; white-space: nowrap;
        }

        .sidebar-footer { border-top: 1px solid rgba(255,255,255,0.08); padding: 16px 12px; }
        .admin-avatar-row {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 12px;
          background: rgba(255,255,255,0.05); margin-bottom: 8px; white-space: nowrap;
        }
        .avatar {
          width: 32px; height: 32px; border-radius: 10px; flex-shrink: 0;
          background: linear-gradient(135deg, #9333ea, #ec4899);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: #fff; font-weight: 700;
        }
        .admin-name { color: rgba(255,255,255,0.8); font-size: 12px; font-weight: 600; }
        .admin-role { color: rgba(255,255,255,0.35); font-size: 10px; }
        .logout-btn {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 10px 12px; border-radius: 10px;
          background: none; border: none; cursor: pointer;
          color: rgba(255,100,100,0.6); font-family: 'Montserrat', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
          transition: all 0.2s; white-space: nowrap; text-align: left;
        }
        .logout-btn:hover { background: rgba(239,68,68,0.1); color: #fca5a5; }

        /* TOGGLE BUTTON - desktop only */
        .toggle-btn {
          position: fixed;
          top: 22px;
          left: ${sidebarOpen && !isMobile ? '246px' : (!isMobile ? '58px' : '-100px')};
          z-index: 101; width: 28px; height: 28px; border-radius: 50%;
          background: #fff; border: 2px solid #e9d5ff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: left 0.3s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15); color: #9333ea; font-size: 13px;
        }
        .toggle-btn:hover { background: #faf5ff; }

        /* MAIN AREA */
        .main-area {
          margin-left: ${isMobile ? '0' : sidebarWidth};
          flex: 1;
          transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1);
          min-height: 100vh; min-width: 0;
        }

        /* TOPBAR */
        .topbar {
          height: 64px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(147,51,234,0.08);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px; position: sticky; top: 0; z-index: 50;
          gap: 12px;
        }
        .topbar-left { display: flex; align-items: center; gap: 12px; }
        .hamburger {
          display: none;
          background: none; border: none; cursor: pointer;
          font-size: 20px; color: #9333ea; padding: 4px; flex-shrink: 0;
        }
        .topbar-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: #1a0533;
          white-space: nowrap;
        }
        .topbar-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .topbar-badge {
          background: linear-gradient(135deg, #9333ea, #ec4899);
          color: #fff; font-size: 10px; font-weight: 700;
          padding: 4px 10px; border-radius: 20px; letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .topbar-time { color: rgba(0,0,0,0.35); font-size: 12px; }

        .content-area { padding: 24px; }

        .nav-section::-webkit-scrollbar { width: 4px; }
        .nav-section::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

        /* RESPONSIVE */
        @media (max-width: 767px) {
          .hamburger { display: flex !important; }
          .toggle-btn { display: none !important; }
          .topbar-time { display: none; }
          .content-area { padding: 16px; }
          .topbar { padding: 0 16px; }
          .topbar-title { font-size: 16px; }
        }

        @media (max-width: 480px) {
          .content-area { padding: 12px; }
          .topbar-badge { font-size: 9px; padding: 3px 8px; }
        }
      `}</style>

      <div className="admin-layout">
        {/* Mobile overlay */}
        <div
          className={`sidebar-overlay ${isMobile && mobileOpen ? 'visible' : ''}`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">🕯️</div>
            <span className="logo-text">Cosmic Virtue</span>
          </div>

          <nav className="nav-section">
            <div className="nav-label">Main Menu</div>
            {NAV_ITEMS.map((item) => (
              <div
                key={item.key}
                className={`nav-item ${activeKey === item.key ? 'active' : ''}`}
                onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
                title={!effectiveOpen ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </div>
            ))}
          </nav>

          <div className="sidebar-footer">
            {adminInfo && (
              <div className="admin-avatar-row">
                <div className="avatar">{adminInfo.name?.charAt(0)?.toUpperCase() || 'A'}</div>
                {effectiveOpen && (
                  <div>
                    <div className="admin-name">{adminInfo.name}</div>
                    <div className="admin-role">Admin</div>
                  </div>
                )}
              </div>
            )}
            <button className="logout-btn" onClick={handleLogout}>
              <span>🚪</span>
              <span className="nav-text">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Desktop toggle */}
        {!isMobile && (
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        )}

        {/* Main */}
        <main className="main-area">
          <div className="topbar">
            <div className="topbar-left">
              <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
              <span className="topbar-title">
                {NAV_ITEMS.find(n => n.key === activeKey)?.label || 'Dashboard'}
              </span>
            </div>
            <div className="topbar-right">
              <span className="topbar-time">
                {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
              <span className="topbar-badge">Admin</span>
            </div>
          </div>

          <div className="content-area">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;