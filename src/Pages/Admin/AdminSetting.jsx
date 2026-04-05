// ========== AdminSettings.jsx ==========
import React, { useState } from 'react';

const AdminSettings = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  const token = localStorage.getItem('adminToken');
  const adminInfo = (() => { try { return JSON.parse(localStorage.getItem('adminInfo')); } catch { return {}; } })();
  const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleChangePassword = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setMessage({ type: 'error', text: 'All fields are required.' }); return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' }); return;
    }
    if (form.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' }); return;
    }
    setSaving(true); setMessage({ type: '', text: '' });
    try {
      const res = await fetch(`${API}/admin/auth/change-password`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (data.success) { setMessage({ type: 'success', text: 'Password changed successfully!' }); setForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
      else setMessage({ type: 'error', text: data.message || 'Failed to change password.' });
    } catch { setMessage({ type: 'error', text: 'Network error. Please try again.' }); }
    finally { setSaving(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@400;500;600;700&display=swap');
        .settings-page { font-family: 'Montserrat', sans-serif; max-width: 680px; }
        .card { background: #fff; border-radius: 20px; border: 1px solid #ede9fe; padding: 24px; margin-bottom: 18px; }
        .card-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #1a0533; margin-bottom: 6px; }
        .card-sub { font-size: 12px; color: #9ca3af; margin-bottom: 18px; }
        .form-label { font-size: 11px; font-weight: 700; color: #6b7280; letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-bottom: 6px; margin-top: 14px; }
        .input-wrap { position: relative; }
        .form-input { width: 100%; padding: 11px 42px 11px 14px; border-radius: 10px; border: 1px solid #e5e7eb; font-family: 'Montserrat', sans-serif; font-size: 13px; color: #374151; outline: none; background: #faf5ff; box-sizing: border-box; transition: all 0.2s; }
        .form-input:focus { border-color: #9333ea; box-shadow: 0 0 0 2px rgba(147,51,234,0.1); }
        .eye-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 15px; }
        .eye-btn:hover { color: #9333ea; }
        .save-btn { margin-top: 18px; padding: 12px 24px; border-radius: 12px; background: linear-gradient(135deg, #9333ea, #ec4899); color: #fff; border: none; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; cursor: pointer; box-shadow: 0 4px 12px rgba(147,51,234,0.3); transition: all 0.2s; width: 100%; }
        .save-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .alert { padding: 12px 16px; border-radius: 12px; font-size: 13px; margin-top: 14px; }
        .alert-success { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
        .alert-error { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
        .profile-row { display: flex; align-items: center; gap: 14px; padding: 14px; background: #faf5ff; border-radius: 14px; margin-bottom: 14px; flex-wrap: wrap; }
        .big-avatar { width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg, #9333ea, #ec4899); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 22px; font-weight: 700; flex-shrink: 0; }
        .info-name { font-size: 15px; font-weight: 700; color: #1a0533; }
        .info-email { font-size: 12px; color: #9ca3af; margin-top: 2px; word-break: break-all; }
        .info-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; background: linear-gradient(135deg, #9333ea22, #ec489922); color: #9333ea; font-size: 10px; font-weight: 700; margin-top: 6px; }
        .tip { font-size: 11px; color: #9ca3af; background: #f9fafb; border-radius: 8px; padding: 10px 12px; margin-top: 10px; }
        .sys-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f9f5ff; font-size: 13px; gap: 10px; flex-wrap: wrap; }
        .sys-val { color: #374151; font-weight: 600; font-family: monospace; font-size: 12px; word-break: break-all; text-align: right; }

        @media (max-width: 480px) {
          .card { padding: 18px; }
          .card-title { font-size: 17px; }
        }
      `}</style>

      <div className="settings-page">
        <div className="card">
          <div className="card-title">Account Profile</div>
          <div className="card-sub">Your admin account information</div>
          <div className="profile-row">
            <div className="big-avatar">{adminInfo?.name?.charAt(0)?.toUpperCase() || 'A'}</div>
            <div style={{ minWidth: 0 }}>
              <div className="info-name">{adminInfo?.name || 'Admin'}</div>
              <div className="info-email">{adminInfo?.email}</div>
              <div className="info-badge">⚡ Administrator</div>
            </div>
          </div>
          {adminInfo?.lastLogin && (
            <div style={{ fontSize: 12, color: '#9ca3af' }}>
              Last login: {new Date(adminInfo.lastLogin).toLocaleString('en-IN')}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">Change Password</div>
          <div className="card-sub">Update your admin account password</div>
          {[
            { key: 'currentPassword', label: 'Current Password', pass: 'current' },
            { key: 'newPassword', label: 'New Password', pass: 'new' },
            { key: 'confirmPassword', label: 'Confirm New Password', pass: 'confirm' },
          ].map(({ key, label, pass }) => (
            <div key={key}>
              <label className="form-label">{label}</label>
              <div className="input-wrap">
                <input className="form-input" type={showPass[pass] ? 'text' : 'password'} value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder="••••••••" />
                <button type="button" className="eye-btn" onClick={() => setShowPass(p => ({ ...p, [pass]: !p[pass] }))}>
                  {showPass[pass] ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          ))}
          <div className="tip">💡 Use at least 6 characters with a mix of letters and numbers.</div>
          {message.text && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {message.type === 'success' ? '✅' : '⚠️'} {message.text}
            </div>
          )}
          <button className="save-btn" onClick={handleChangePassword} disabled={saving}>
            {saving ? 'Updating...' : '🔒 Update Password'}
          </button>
        </div>

        <div className="card">
          <div className="card-title">System Info</div>
          <div className="card-sub">Cosmic Virtue Admin Panel</div>
          {[
            ['Version', '1.0.0'],
            ['Platform', 'Cosmic Virtue E-Commerce'],
            ['API Base', import.meta.env.VITE_API_URL || 'Not configured'],
            ['Environment', import.meta.env.MODE || 'development'],
          ].map(([label, value]) => (
            <div key={label} className="sys-row">
              <span style={{ color: '#9ca3af', fontWeight: 500, flexShrink: 0 }}>{label}</span>
              <span className="sys-val">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminSettings;