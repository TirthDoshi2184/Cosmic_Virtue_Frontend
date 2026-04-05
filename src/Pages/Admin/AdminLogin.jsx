import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const API = "http://localhost:3000"; // Change to import.meta.env.VITE_API_URL in production

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('adminToken', data.data.token);
      localStorage.setItem('adminInfo', JSON.stringify(data.data.admin));
      navigate('/admin/dashboard');
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
        .login-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a0533 0%, #2d0a5e 40%, #1a1035 100%);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Montserrat', sans-serif;
          position: relative; overflow: hidden;
        }
        .orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.18; pointer-events: none;
        }
        .orb-1 { width: 500px; height: 500px; background: #9333ea; top: -100px; left: -100px; }
        .orb-2 { width: 400px; height: 400px; background: #ec4899; bottom: -100px; right: -80px; }
        .orb-3 { width: 300px; height: 300px; background: #7c3aed; top: 40%; left: 50%; }
        .login-card {
          position: relative; z-index: 1;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 48px 44px;
          width: 100%; max-width: 440px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
        }
        .input-field {
          width: 100%; padding: 14px 18px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px; color: #fff;
          font-family: 'Montserrat', sans-serif; font-size: 14px;
          outline: none; transition: all 0.25s;
          box-sizing: border-box;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.35); }
        .input-field:focus {
          border-color: rgba(147,51,234,0.7);
          background: rgba(147,51,234,0.08);
          box-shadow: 0 0 0 3px rgba(147,51,234,0.15);
        }
        .btn-login {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #9333ea, #ec4899);
          color: #fff; border: none; border-radius: 12px;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          cursor: pointer; transition: all 0.3s;
          box-shadow: 0 8px 24px rgba(147,51,234,0.4);
        }
        .btn-login:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(147,51,234,0.5);
        }
        .btn-login:disabled { opacity: 0.6; cursor: not-allowed; }
        .label { color: rgba(255,255,255,0.5); font-size: 11px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase; display: block; margin-bottom: 8px; }
        .error-box {
          background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3);
          border-radius: 10px; padding: 12px 16px;
          color: #fca5a5; font-size: 13px; text-align: center;
        }
        .logo-ring {
          width: 64px; height: 64px; border-radius: 50%;
          background: linear-gradient(135deg, #9333ea, #ec4899);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px; font-size: 28px;
          box-shadow: 0 8px 24px rgba(147,51,234,0.4);
        }
        .divider { height: 1px; background: rgba(255,255,255,0.08); margin: 24px 0; }
        .input-wrap { position: relative; }
        .eye-btn {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.4); padding: 0; font-size: 16px;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: rgba(255,255,255,0.7); }
      `}</style>

      <div className="login-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="login-card">
          {/* Logo */}
          <div className="logo-ring">🕯️</div>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 6px' }}>
              Admin Portal
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0 }}>
              Cosmic Virtue — Management Console
            </p>
          </div>

          <div className="divider" />

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label className="label">Email Address</label>
              <input
                className="input-field"
                type="email" name="email" required
                placeholder="admin@cosmicvirtue.in"
                value={form.email} onChange={handleChange}
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label className="label">Password</label>
              <div className="input-wrap">
                <input
                  className="input-field"
                  type={showPass ? 'text' : 'password'}
                  name="password" required
                  placeholder="••••••••"
                  value={form.password} onChange={handleChange}
                  style={{ paddingRight: 44 }}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && <div className="error-box" style={{ marginBottom: 20 }}>⚠️ {error}</div>}

            <button className="btn-login" type="submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>

            <div style={{ textAlign: 'center', marginTop: 16 }}>
  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>New admin? </span>
  <button
    type="button"
    onClick={() => navigate('/admin/register')}
    style={{ background: 'none', border: 'none', color: '#c084fc', fontSize: 12, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Montserrat', sans-serif" }}
  >
    Register here
  </button>
</div>
          </form>

          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, textAlign: 'center', marginTop: 28, letterSpacing: '0.05em' }}>
            RESTRICTED ACCESS — AUTHORISED PERSONNEL ONLY
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;