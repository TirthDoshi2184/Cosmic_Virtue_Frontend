import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Phone, Mail, Calendar, ShieldCheck,
  KeyRound, Pencil, X, Check, LogOut, Sparkles, User
} from "lucide-react";

const API_BASE = `${import.meta.env.VITE_API_URL}/users`;

const WELCOME_MESSAGES = [
  { greeting: "Welcome back,", sub: "Your sanctuary awaits ✨" },
  { greeting: "Good to see you,", sub: "Ready to explore new scents? 🕯️" },
  { greeting: "Hello again,", sub: "Your botanical world is here 🌿" },
  { greeting: "You're back,", sub: "Let the ritual begin 🔮" },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [pwMode, setPwMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeMsg] = useState(() => WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)]);

  const [form, setForm] = useState({ email: "", phoneNumber: "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProfile();
    // Auto-dismiss welcome banner after 4s
    const t = setTimeout(() => setShowWelcome(false), 4000);
    return () => clearTimeout(t);
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setUser(data.data);
      setForm({ email: data.data.email, phoneNumber: data.data.phoneNumber });
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile(e) {
    e.preventDefault();
    const errs = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Valid email required";
    if (!form.phoneNumber) errs.phoneNumber = "Phone number required";
    if (Object.keys(errs).length) return setErrors(errs);
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ email: form.email, phoneNumber: Number(form.phoneNumber) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setUser(data.data);
      setEditMode(false);
      setErrors({});
      showToast("Profile updated successfully!");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    const errs = {};
    if (!pwForm.currentPassword) errs.currentPassword = "Required";
    if (!pwForm.password || pwForm.password.length < 6) errs.password = "Min 6 characters";
    if (pwForm.password !== pwForm.confirm) errs.confirm = "Passwords don't match";
    if (Object.keys(errs).length) return setErrors(errs);
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, password: pwForm.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setPwMode(false);
      setPwForm({ currentPassword: "", password: "", confirm: "" });
      setErrors({});
      showToast("Password changed successfully!");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
  }

  function formatDate(d) {
    return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  }

  function getInitials(email) {
    return email ? email[0].toUpperCase() : "U";
  }

  function getUserName(email) {
    if (!email) return "there";
    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(135deg, #fdf4ff 0%, #faf5ff 40%, #fce7f3 100%)" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-purple-200 animate-ping opacity-30" />
          <div className="absolute inset-2 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-purple-400 text-sm tracking-widest uppercase">
          Preparing your space…
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        .cv-page { font-family: 'DM Sans', sans-serif; }
        .cv-serif { font-family: 'Cormorant Garamond', serif; }

        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes welcomeIn {
          0%   { opacity: 0; transform: translateY(-12px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes welcomeOut {
          0%   { opacity: 1; transform: translateY(0) scale(1); max-height: 120px; margin-bottom: 20px; }
          100% { opacity: 0; transform: translateY(-8px) scale(0.97); max-height: 0; margin-bottom: 0; overflow: hidden; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-6px) rotate(1deg); }
          66%       { transform: translateY(-3px) rotate(-1deg); }
        }
        @keyframes orb {
          0%, 100% { transform: scale(1) translate(0,0); }
          50%       { transform: scale(1.08) translate(6px, -4px); }
        }

        .anim-1 { animation: fadeSlideUp 0.6s ease-out 0.05s both; }
        .anim-2 { animation: fadeSlideUp 0.6s ease-out 0.15s both; }
        .anim-3 { animation: fadeSlideUp 0.6s ease-out 0.25s both; }
        .anim-4 { animation: fadeSlideUp 0.6s ease-out 0.35s both; }
        .anim-5 { animation: fadeSlideUp 0.6s ease-out 0.45s both; }

        .welcome-enter { animation: welcomeIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .welcome-exit  { animation: welcomeOut 0.4s ease-in forwards; }

        .shimmer-text {
          background: linear-gradient(90deg, #7c3aed, #db2777, #7c3aed, #db2777);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        .orb { animation: orb 6s ease-in-out infinite; }
        .float-icon { animation: float 4s ease-in-out infinite; }

        .cv-card {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.9);
        }
        .cv-card-hover {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .cv-card-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(124,58,237,0.10);
        }

        .cv-input {
          font-family: 'DM Sans', sans-serif;
          width: 100%;
          padding: 12px 16px;
          border-radius: 14px;
          border: 1.5px solid #e9d5ff;
          background: #faf5ff;
          font-size: 14px;
          color: #1f1135;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .cv-input:focus {
          outline: none;
          border-color: #9333ea;
          box-shadow: 0 0 0 3px rgba(147,51,234,0.10);
          background: #fff;
        }
        .cv-input.error { border-color: #f43f5e; background: #fff5f7; }

        .cv-btn-primary {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 12px 24px; border-radius: 14px; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
          background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
          color: #fff;
          box-shadow: 0 4px 16px rgba(124,58,237,0.28);
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .cv-btn-primary:hover:not(:disabled) {
          opacity: 0.92; transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(124,58,237,0.35);
        }
        .cv-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .cv-btn-ghost {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 12px 24px; border-radius: 14px;
          background: transparent;
          border: 1.5px solid #e9d5ff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
          color: #9ca3af; cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .cv-btn-ghost:hover:not(:disabled) { border-color: #c4b5fd; color: #7c3aed; background: #faf5ff; }

        .avatar-glow {
          box-shadow: 0 0 0 4px #fff, 0 0 0 6px rgba(124,58,237,0.2), 0 8px 24px rgba(124,58,237,0.3);
        }

        .stat-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 14px; border-radius: 100px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
        }
      `}</style>

      <div className="cv-page min-h-screen px-4 py-10 sm:py-14"
        style={{ background: "linear-gradient(135deg, #fdf4ff 0%, #faf5ff 50%, #fce7f3 100%)", backgroundAttachment: "fixed", position: "relative", overflow: "hidden" }}>

        {/* Background orbs */}
        <div className="orb fixed pointer-events-none" style={{ top: -120, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)" }} />
        <div className="orb fixed pointer-events-none" style={{ bottom: -80, left: -80, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,207,232,0.2) 0%, transparent 70%)", animationDelay: "3s" }} />

        {/* Toast */}
        {toast && (
          <div style={{ animation: "fadeSlideDown 0.35s ease-out both" }}
            className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl text-sm font-semibold shadow-2xl border ${
              toast.type === "error"
                ? "bg-white text-red-600 border-red-100 shadow-red-100"
                : "bg-white text-purple-700 border-purple-100 shadow-purple-100"
            }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${toast.type === "error" ? "bg-red-100" : "bg-purple-100"}`}>
              {toast.type === "error" ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
            </div>
            {toast.msg}
          </div>
        )}

        <div className="max-w-xl mx-auto space-y-4 relative z-10">

          {/* ── Welcome Banner ── */}
          {showWelcome && (
            <div className={`cv-card rounded-3xl px-6 py-5 shadow-lg overflow-hidden relative ${showWelcome ? 'welcome-enter' : 'welcome-exit'}`}
              style={{ borderColor: "rgba(167,139,250,0.3)" }}>
              {/* Decorative shimmer line */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #7c3aed, #db2777, #f59e0b, #7c3aed)", backgroundSize: "200%", animation: "shimmer 2s linear infinite" }} />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="float-icon w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #ede9fe, #fce7f3)" }}>
                    <Sparkles className="w-5 h-5" style={{ color: "#7c3aed" }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "#1f1135", lineHeight: 1.2 }}>
                      {welcomeMsg.greeting}{" "}
                      <span className="shimmer-text">{getUserName(user?.email)}</span>
                    </p>
                    <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>{welcomeMsg.sub}</p>
                  </div>
                </div>
                <button onClick={() => setShowWelcome(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-purple-50 transition-colors flex-shrink-0"
                  style={{ color: "#d1d5db" }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── Hero Card ── */}
<div className="anim-1 cv-card rounded-3xl overflow-hidden shadow-xl" style={{ borderColor: "rgba(167,139,250,0.25)" }}>
  
  {/* Single unified header — no overlap */}
  <div className="relative px-6 sm:px-8 py-6 flex items-center justify-between gap-4"
    style={{ background: "linear-gradient(135deg, #6d28d9 0%, #9333ea 40%, #db2777 100%)" }}>
    
    {/* Decorative dots */}
    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />
    
    {/* Left — avatar + name side by side */}
    <div className="flex items-center gap-4 relative z-10">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)", backdropFilter: "blur(8px)" }}>
        <span className="cv-serif text-white" style={{ fontSize: 28, fontWeight: 600, lineHeight: 1 }}>
          {user?.email ? user.email[0].toUpperCase() : "?"}
        </span>
      </div>
      <div>
        <h1 className="cv-serif text-white" style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.1 }}>
          {getUserName(user?.email)}
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 3 }}>{user?.email}</p>
        {/* Badges */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="stat-pill" style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <ShieldCheck className="w-3 h-3" /> Verified
          </span>
          <span className="stat-pill" style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <Sparkles className="w-3 h-3" /> Member
          </span>
          {user?.createdAt && (
            <span className="stat-pill" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
              Since {new Date(user.createdAt).getFullYear()}
            </span>
          )}
        </div>
      </div>
    </div>

    {/* Right — action buttons */}
    {!editMode && !pwMode && (
      <div className="flex flex-col items-end gap-2 relative z-10 flex-shrink-0">
        <button onClick={() => setEditMode(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all"
          style={{ background: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(8px)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.06em", cursor: "pointer" }}>
          <Pencil className="w-3 h-3" /> Edit
        </button>
        <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all"
          style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.06em", cursor: "pointer" }}>
          <LogOut className="w-3 h-3" /> Logout
        </button>
      </div>
    )}
  </div>

  {/* Bottom brand strip */}
  <div className="px-6 py-2 flex justify-end" style={{ background: "#faf5ff", borderTop: "1px solid rgba(167,139,250,0.1)" }}>
    <p style={{ fontSize: 10, color: "#c4b5fd", letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Cosmic Virtue</p>
  </div>
</div>

          {/* ── Edit Profile Form ── */}
          {editMode && (
            <div className="anim-1 cv-card rounded-3xl p-6 sm:p-8 shadow-lg" style={{ borderColor: "rgba(167,139,250,0.25)" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="cv-serif" style={{ fontSize: 24, fontWeight: 600, color: "#1f1135" }}>Edit Profile</h2>
                <button onClick={() => { setEditMode(false); setErrors({}); }}
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                  style={{ background: "#f3e8ff", color: "#9333ea" }}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={saveProfile} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
                  { key: "phoneNumber", label: "Phone Number", type: "tel", placeholder: "10-digit number" },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{label}</label>
                    <input type={type} value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      className={`cv-input ${errors[key] ? "error" : ""}`} />
                    {errors[key] && <p style={{ color: "#f43f5e", fontSize: 12, marginTop: 5 }}>{errors[key]}</p>}
                  </div>
                ))}

                <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                  <button type="button" onClick={() => { setEditMode(false); setErrors({}); }} disabled={saving} className="cv-btn-ghost" style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" disabled={saving} className="cv-btn-primary" style={{ flex: 1 }}>
                    {saving ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <><Check className="w-4 h-4" /> Save Changes</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Change Password Form ── */}
          {pwMode && (
            <div className="anim-1 cv-card rounded-3xl p-6 sm:p-8 shadow-lg" style={{ borderColor: "rgba(167,139,250,0.25)" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="cv-serif" style={{ fontSize: 24, fontWeight: 600, color: "#1f1135" }}>Change Password</h2>
                <button onClick={() => { setPwMode(false); setErrors({}); }}
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                  style={{ background: "#f3e8ff", color: "#9333ea" }}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={changePassword} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  { key: "currentPassword", label: "Current Password", placeholder: "Enter current password" },
                  { key: "password", label: "New Password", placeholder: "At least 6 characters" },
                  { key: "confirm", label: "Confirm New Password", placeholder: "Repeat new password" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{label}</label>
                    <input type="password" value={pwForm[key]}
                      onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })}
                      placeholder={placeholder}
                      className={`cv-input ${errors[key] ? "error" : ""}`} />
                    {errors[key] && <p style={{ color: "#f43f5e", fontSize: 12, marginTop: 5 }}>{errors[key]}</p>}
                  </div>
                ))}

                <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                  <button type="button" onClick={() => { setPwMode(false); setErrors({}); }} disabled={saving} className="cv-btn-ghost" style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" disabled={saving} className="cv-btn-primary" style={{ flex: 1 }}>
                    {saving ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <><KeyRound className="w-4 h-4" /> Update Password</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Info Grid ── */}
          {!editMode && !pwMode && (
            <div className="anim-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: <Mail className="w-4 h-4" style={{ color: "#7c3aed" }} />, label: "Email Address", value: user?.email, bg: "#f5f3ff", iconBg: "#ede9fe" },
                { icon: <Phone className="w-4 h-4" style={{ color: "#db2777" }} />, label: "Phone Number", value: user?.phoneNumber, bg: "#fff0f6", iconBg: "#fce7f3" },
                { icon: <Calendar className="w-4 h-4" style={{ color: "#7c3aed" }} />, label: "Member Since", value: user?.createdAt ? formatDate(user.createdAt) : "—", bg: "#f5f3ff", iconBg: "#ede9fe" },
                { icon: <User className="w-4 h-4" style={{ color: "#db2777" }} />, label: "Last Updated", value: user?.updatedAt ? formatDate(user.updatedAt) : "—", bg: "#fff0f6", iconBg: "#fce7f3" },
              ].map(({ icon, label, value, bg, iconBg }, i) => (
                <div key={i} className="cv-card cv-card-hover rounded-2xl p-5 flex items-start gap-4 shadow-sm cursor-default"
                  style={{ borderColor: "rgba(167,139,250,0.15)", background: bg }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
                    {icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#c4b5fd", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>{label}</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1f1135", wordBreak: "break-word" }}>{value || "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Change Password Row ── */}
          {!editMode && !pwMode && (
            <button onClick={() => setPwMode(true)} className="anim-3 cv-card cv-card-hover w-full rounded-2xl px-6 py-4 shadow-sm flex items-center justify-between group"
              style={{ borderColor: "rgba(167,139,250,0.2)", cursor: "pointer" }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #ede9fe, #fce7f3)" }}>
                  <KeyRound className="w-4 h-4" style={{ color: "#7c3aed" }} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1f1135" }}>Change Password</p>
                  <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>Update your account security</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:translate-x-1" style={{ background: "#f5f3ff" }}>
                <ArrowRight className="w-4 h-4" style={{ color: "#7c3aed" }} />
              </div>
            </button>
          )}

          {/* ── Account ID ── */}
          {!editMode && !pwMode && (
            <div className="anim-4 cv-card rounded-2xl px-5 py-3.5 shadow-sm flex items-center gap-3"
              style={{ borderColor: "rgba(167,139,250,0.12)" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#d8b4fe", textTransform: "uppercase", letterSpacing: "0.12em", flexShrink: 0 }}>ID</p>
              <p style={{ fontSize: 12, color: "#c4b5fd", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?._id}</p>
            </div>
          )}

          {/* ── Continue Shopping CTA ── */}
          {!editMode && !pwMode && (
            <div className="anim-5 flex justify-center pt-2 pb-4">
              <button onClick={() => navigate("/products")}
                className="group flex items-center gap-2.5 px-9 py-4 rounded-2xl font-semibold text-sm uppercase tracking-widest transition-all duration-300"
                style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)", color: "#fff", boxShadow: "0 6px 24px rgba(124,58,237,0.3)", fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 10px 32px rgba(124,58,237,0.45)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 6px 24px rgba(124,58,237,0.3)"}>
                Continue Shopping
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}