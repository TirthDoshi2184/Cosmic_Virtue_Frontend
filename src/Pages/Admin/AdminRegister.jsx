import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API}/admin/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      alert(`Admin "${data.data.name}" registered successfully!`);
      navigate('/admin/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .login-bg {
          min-height: 100vh;
          background: linear-gradient(135deg,#1a0533 0%,#2d0a5e 40%,#1a1035 100%);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Montserrat', sans-serif;
          position: relative; overflow: hidden;
          padding: 20px;
        }
        .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.18; pointer-events: none; }
        .orb-1 { width: 500px; height: 500px; background: #9333ea; top: -100px; left: -100px; }
        .orb-2 { width: 400px; height: 400px; background: #ec4899; bottom: -100px; right: -80px; }
        .login-card {
          position: relative; z-index: 1;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 40px 36px;
          width: 100%; max-width: 420px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
        }
        .input-field {
          width: 100%; padding: 13px 16px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px; color: #fff;
          font-family: 'Montserrat', sans-serif; font-size: 14px;
          outline: none; transition: all 0.25s; box-sizing: border-box;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.35); }
        .input-field:focus { border-color: rgba(147,51,234,0.7); background: rgba(147,51,234,0.08); box-shadow: 0 0 0 3px rgba(147,51,234,0.15); }
        .btn-login {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #9333ea, #ec4899);
          color: #fff; border: none; border-radius: 12px;
          font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          cursor: pointer; transition: all 0.3s;
          box-shadow: 0 8px 24px rgba(147,51,234,0.4);
        }
        .btn-login:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(147,51,234,0.5); }
        .btn-login:disabled { opacity: 0.6; cursor: not-allowed; }
        .label { color: rgba(255,255,255,0.5); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; display: block; margin-bottom: 8px; }
        .error-box { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); border-radius: 10px; padding: 12px 16px; color: #fca5a5; font-size: 13px; text-align: center; }
        .logo-ring { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg,#9333ea,#ec4899); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 26px; box-shadow: 0 8px 24px rgba(147,51,234,0.4); }
        .divider { height: 1px; background: rgba(255,255,255,0.08); margin: 20px 0; }
        .form-field { margin-bottom: 18px; }

        @media (max-width: 480px) {
          .login-card { padding: 28px 22px; border-radius: 20px; }
          .input-field { padding: 12px 14px; font-size: 13px; }
        }
      `}</style>

      <div className="login-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="login-card">
          <div className="logo-ring">🕯️</div>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: 26, fontWeight: 700, margin: '0 0 6px' }}>Register Admin</h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0 }}>Cosmic Virtue — Create Admin Account</p>
          </div>
          <div className="divider" />
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="label">Full Name</label>
              <input className="input-field" type="text" required placeholder="e.g. Priya Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-field">
              <label className="label">Email Address</label>
              <input className="input-field" type="email" required placeholder="admin@cosmicvirtue.in" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="form-field">
              <label className="label">Password</label>
              <input className="input-field" type="password" required placeholder="Min. 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            <div className="form-field">
              <label className="label">Confirm Password</label>
              <input className="input-field" type="password" required placeholder="••••••••" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} />
            </div>
            {error && <div className="error-box" style={{ marginBottom: 18 }}>⚠️ {error}</div>}
            <button className="btn-login" type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Create Admin Account'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>Already have an account? </span>
            <button type="button" onClick={() => navigate('/admin/login')} style={{ background: 'none', border: 'none', color: '#c084fc', fontSize: 12, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Montserrat',sans-serif" }}>
              Sign in
            </button>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, textAlign: 'center', marginTop: 18, letterSpacing: '0.05em' }}>RESTRICTED ACCESS — AUTHORISED PERSONNEL ONLY</p>
        </div>
      </div>
    </>
  );
};

export default AdminRegister;