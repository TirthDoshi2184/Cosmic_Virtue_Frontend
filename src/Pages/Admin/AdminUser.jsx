import React, { useState, useEffect } from 'react';

const AdminUsers = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('adminToken');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/auth/admins`, { headers });
      const data = await res.json();
      if (data.success) setAdmins(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) { setError('All fields are required'); return; }
    setSaving(true); setError(''); setSuccess('');
    try {
      const res = await fetch(`${API}/admin/auth/register`, { method: 'POST', headers, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) { setSuccess('Admin registered successfully!'); setForm({ name: '', email: '', password: '' }); setShowRegister(false); fetchAdmins(); }
      else setError(data.message || 'Registration failed');
    } catch { setError('Network error'); }
    finally { setSaving(false); }
  };

  const handleDeactivate = async (adminId, name) => {
    if (!window.confirm(`Deactivate "${name}"?`)) return;
    try {
      const res = await fetch(`${API}/admin/auth/admins/${adminId}/deactivate`, { method: 'PATCH', headers });
      const data = await res.json();
      if (data.success) { setSuccess('Admin deactivated.'); fetchAdmins(); }
      else setError(data.message);
    } catch { setError('Failed'); }
  };

  const myId = (() => { try { return JSON.parse(localStorage.getItem('adminInfo'))?.id; } catch { return null; } })();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@400;500;600;700&display=swap');
        .admins-page { font-family: 'Montserrat', sans-serif; }
        .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
        .section-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #1a0533; }
        .add-btn { padding: 10px 20px; border-radius: 12px; background: linear-gradient(135deg, #9333ea, #ec4899); color: #fff; border: none; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; letter-spacing: 0.06em; white-space: nowrap; }
        .alert { padding: 12px 16px; border-radius: 12px; font-size: 13px; margin-bottom: 14px; }
        .alert-success { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
        .alert-error { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
        .register-card { background: #fff; border-radius: 16px; border: 1px solid #ede9fe; padding: 20px; margin-bottom: 20px; }
        .form-label { font-size: 11px; font-weight: 700; color: #6b7280; letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-bottom: 6px; margin-top: 12px; }
        .form-input { width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid #e5e7eb; font-family: 'Montserrat', sans-serif; font-size: 13px; color: #374151; outline: none; background: #faf5ff; box-sizing: border-box; }
        .form-input:focus { border-color: #9333ea; box-shadow: 0 0 0 2px rgba(147,51,234,0.1); }
        .save-btn { padding: 11px 22px; border-radius: 10px; background: linear-gradient(135deg, #9333ea, #ec4899); color: #fff; border: none; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; margin-top: 14px; width: 100%; }

        /* Admin grid */
        .admins-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
        .admin-card { background: #fff; border-radius: 16px; border: 1px solid #ede9fe; padding: 18px; display: flex; align-items: flex-start; gap: 12px; }
        .avatar { width: 46px; height: 46px; border-radius: 14px; background: linear-gradient(135deg, #9333ea, #ec4899); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; font-weight: 700; flex-shrink: 0; }
        .avatar.inactive { background: linear-gradient(135deg, #9ca3af, #6b7280); }
        .admin-name { font-weight: 700; font-size: 14px; color: #1a0533; }
        .admin-email { font-size: 12px; color: #9ca3af; margin-top: 2px; word-break: break-all; }
        .admin-meta { font-size: 11px; color: #9ca3af; margin-top: 6px; line-height: 1.5; }
        .active-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; }
        .badge-active { background: #d1fae5; color: #065f46; }
        .badge-inactive { background: #fee2e2; color: #991b1b; }
        .badge-me { background: #e0e7ff; color: #3730a3; margin-left: 6px; }
        .deact-btn { margin-top: 10px; padding: 7px 12px; border-radius: 8px; background: #fee2e2; border: none; color: #ef4444; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; cursor: pointer; }
        .deact-btn:hover { background: #fecaca; }

        @media (max-width: 767px) {
          .admins-grid { grid-template-columns: 1fr; }
          .section-title { font-size: 18px; }
        }

        @media (max-width: 480px) {
          .register-card { padding: 16px; }
        }
      `}</style>

      <div className="admins-page">
        <div className="header-row">
          <div className="section-title">Admin Users</div>
          <button className="add-btn" onClick={() => setShowRegister(!showRegister)}>
            {showRegister ? '✕ Cancel' : '+ Add Admin'}
          </button>
        </div>

        {success && <div className="alert alert-success">✅ {success}</div>}
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {showRegister && (
          <div className="register-card">
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#1a0533', marginBottom: 4 }}>Register New Admin</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>The new admin will have full access to the admin panel.</div>

            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Priya Sharma" />

            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="admin@cosmicvirtue.in" />

            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min. 6 characters" />

            <button className="save-btn" onClick={handleRegister} disabled={saving}>
              {saving ? 'Registering...' : 'Register Admin'}
            </button>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Loading admins...</div>
        ) : (
          <div className="admins-grid">
            {admins.map(admin => (
              <div key={admin._id} className="admin-card">
                <div className={`avatar ${admin.isActive ? '' : 'inactive'}`}>
                  {admin.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                    <span className="admin-name">{admin.name}</span>
                    {admin._id === myId && <span className="active-badge badge-me">You</span>}
                  </div>
                  <div className="admin-email">{admin.email}</div>
                  <div style={{ marginTop: 7 }}>
                    <span className={`active-badge ${admin.isActive ? 'badge-active' : 'badge-inactive'}`}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: admin.isActive ? '#059669' : '#ef4444', display: 'inline-block' }} />
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="admin-meta">
                    Joined: {new Date(admin.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {admin.lastLogin && <><br />Last login: {new Date(admin.lastLogin).toLocaleDateString('en-IN')}</>}
                  </div>
                  {admin._id !== myId && admin.isActive && (
                    <button className="deact-btn" onClick={() => handleDeactivate(admin._id, admin.name)}>
                      Deactivate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminUsers;