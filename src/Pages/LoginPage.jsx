import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Heart, ShoppingBag, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const Login = () => {

  const [loginMode, setLoginMode] = useState('email'); // ADD: 'email' | 'phone'
const [phoneData, setPhoneData] = useState({ phone: '', otp: '' });
const [otpSent, setOtpSent] = useState(false);
const [confirmationResult, setConfirmationResult] = useState(null);
const [verifying, setVerifying] = useState(false);


  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Basic validation
    if (!formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
  // Store BOTH token and user
  localStorage.setItem('token', data.token);  // ← Change 'authToken' to 'token'
  localStorage.setItem('userId', data.user._id);
  localStorage.setItem('user', JSON.stringify(data.user)); // ← Add this
  
  // ===== ADD GUEST CART MIGRATION =====
  const guestCart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  if (guestCart.length > 0) {
    try {
      // Call merge API
      const mergeResponse = await fetch(`${import.meta.env.VITE_API_URL}/cart/merge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.token}`
        },
        body: JSON.stringify({ items: guestCart })
      });

      if (mergeResponse.ok) {
        // Clear guest cart after successful merge
        localStorage.removeItem('cart');
        // Trigger cart update event
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error('Failed to merge cart:', error);
    }
  }
  // ===== END CART MIGRATION =====
  
  setMessage({ type: 'success', text: 'Welcome back!' });
  
  setTimeout(() => {
    navigate('/');
  }, 1500);
} else {
        // Error from server
        setMessage({ 
          type: 'error', 
          text: data.error || 'Login failed. Please check your credentials.' 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Unable to connect to server. Please try again later.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const sendPhoneOTP = async () => {
  if (!/^[0-9]{10}$/.test(phoneData.phone)) {
    setMessage({ type: 'error', text: 'Enter valid 10-digit number' });
    return;
  }

  setVerifying(true);

  try {
    // 🔥 CLEAR OLD INSTANCE
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }

    // 🔥 CREATE NEW
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container-login',
      {
        size: 'invisible',
        callback: () => {},
      },
      auth
    );

    const result = await signInWithPhoneNumber(
      auth,
      `+91${phoneData.phone}`,
      window.recaptchaVerifier
    );

    setConfirmationResult(result);
    setOtpSent(true);
    setMessage({ type: 'success', text: 'OTP sent!' });

  } catch (err) {
    console.log(err);
    setMessage({ type: 'error', text: 'Failed to send OTP. Try again.' });
  }

  setVerifying(false);
};

const handlePhoneLogin = async () => {
  if (!confirmationResult || phoneData.otp.length !== 6) return;
  setLoading(true);
  try {
    const userCredential = await confirmationResult.confirm(phoneData.otp);
    const firebaseToken = await userCredential.user.getIdToken();

    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/login/phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phoneData.phone, firebaseToken }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userId', data.user._id);
      // same cart merge logic already in handleSubmit — copy it here too
      setMessage({ type: 'success', text: 'Welcome back!' });
      setTimeout(() => navigate('/'), 1500);
    } else {
      setMessage({ type: 'error', text: data.error || 'Login failed' });
    }
  } catch (err) {
    setMessage({ type: 'error', text: 'Invalid OTP. Try again.' });
  }
  setLoading(false);
};
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Welcome Text */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4 leading-tight">
                Welcome Back to<br />
                <span className="text-purple-600 italic">Cosmic Virtue</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Continue your spiritual journey with our handcrafted botanical candles. 
                Sign in to access your account, track orders, and discover new sacred scents.
              </p>
            </div>

            <div className="space-y-4 pt-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Track Your Orders</h3>
                  <p className="text-sm text-gray-600">Monitor your spiritual journey from order to delivery</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Save Your Favorites</h3>
                  <p className="text-sm text-gray-600">Curate your collection of beloved botanical scents</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Exclusive Access</h3>
                  <p className="text-sm text-gray-600">First to know about new collections and limited editions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 md:p-10">
            <div className="mb-8">
  <h3 className="text-2xl font-serif text-gray-900 mb-2">Sign In</h3>
  <p className="text-gray-600 text-sm mb-6">
    Enter your credentials to access your account
  </p>

  {/* Tab Switcher */}
  <div className="flex border border-gray-200 rounded-lg p-1 bg-gray-50">
    <button
      type="button"
      onClick={() => { setLoginMode('email'); setMessage({ type: '', text: '' }); }}
      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
        loginMode === 'email'
          ? 'bg-white text-purple-600 shadow-sm'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      Email
    </button>
    <button
      type="button"
      onClick={() => { setLoginMode('phone'); setMessage({ type: '', text: '' }); }}
      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
        loginMode === 'phone'
          ? 'bg-white text-purple-600 shadow-sm'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      Phone (OTP)
    </button>
  </div>
</div>

            {/* Message Display */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg border ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              } animate-slideDown`}>
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}


            {/* Login Form */}
           {loginMode === 'email' && (
<form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 placeholder-gray-400"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 placeholder-gray-400"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                    Remember me
                  </label>
                </div>

                <a 
                  href="/forgot-password" 
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>
            )}

            {loginMode === 'phone' && (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Phone Number
      </label>
      <div className="flex gap-2">
        <input
          type="tel"
          value={phoneData.phone}
          onChange={(e) => {
            setPhoneData({ ...phoneData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) });
            setOtpSent(false);
            setConfirmationResult(null);
          }}
          placeholder="9876543210"
          maxLength="10"
          disabled={otpSent}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
        />
        <button
          type="button"
          onClick={sendPhoneOTP}
          disabled={verifying || phoneData.phone.length !== 10}
          className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {verifying ? 'Sending...' : otpSent ? 'Resend' : 'Send OTP'}
        </button>
      </div>
    </div>

    {otpSent && (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter OTP
        </label>
        <input
          type="text"
          value={phoneData.otp}
          onChange={(e) => setPhoneData({ ...phoneData, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
          placeholder="6-digit OTP"
          maxLength="6"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
        />
        <p className="text-xs text-gray-500 mt-1">OTP sent to +91 {phoneData.phone}</p>
      </div>
    )}

    <button
      type="button"
      onClick={handlePhoneLogin}
      disabled={loading || phoneData.otp.length !== 6}
      className="w-full bg-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Verifying...</span>
        </>
      ) : (
        <span>Verify & Sign In</span>
      )}
    </button>
  </div>
)}

<div id="recaptcha-container-login"></div>
            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">New to Cosmic Virtue?</span>
              </div>
            </div>

            {/* Create Account Link */}
            <div className="text-center">
              <a 
                href="/register" 
                className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
              >
                Create an account
              </a>
              <p className="text-xs text-gray-500 mt-2">
                Join our community and start your botanical journey
              </p>
            </div>

        </div>
      </div>
</div>
      {/* Footer */}
      
      {/* Custom animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;