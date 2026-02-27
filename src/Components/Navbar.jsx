import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingCart, User, ChevronDown, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CartSidebar from '../Pages/CartPage';

const Navbar = () => {
  const [candleDropdown, setCandleDropdown] = useState(false);
  const [bathDropdown, setBathDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCandleOpen, setMobileCandleOpen] = useState(false);
  const [mobileBathOpen, setMobileBathOpen] = useState(false);
  const [limitedDropdown, setLimitedDropdown] = useState(false);
  const [mobileLimitedOpen, setMobileLimitedOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  const isUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const getUserToken = () => {
    return localStorage.getItem('token');
  };

  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id || user._id;
    } catch (error) {
      return null;
    }
  };

  const getLocalCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      return cart.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      return 0;
    }
  };

  const getAPICartCount = async () => {
    try {
      const token = getUserToken();
      const userId = getUserId();
      if (!token || !userId) return 0;
      const response = await fetch(`${import.meta.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) return 0;
      const data = await response.json();
      const items = data.cart?.items || [];
      return items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      return 0;
    }
  };

  const updateCartCount = async () => {
    if (isUserLoggedIn()) {
      const count = await getAPICartCount();
      setCartCount(count);
    } else {
      const count = getLocalCartCount();
      setCartCount(count);
    }
  };

  useEffect(() => {
    updateCartCount();
    const handleStorageChange = () => {
      if (!isUserLoggedIn()) updateCartCount();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handlecart = () => {
    setIsCartOpen(true);
    updateCartCount();
  };

  const handlewishlist = () => {
    navigate('/wishlist');
  };

  // Shared nav link styles
  const desktopLink = "text-gray-700 font-medium text-sm tracking-wide relative group py-2 transition-colors hover:text-purple-600 flex items-center gap-1";
  const underline = "absolute -bottom-[18px] left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Montserrat:wght@400;600&display=swap');

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.15s ease-out; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }

        /* Smooth sidebar scroll */
        .sidebar-scroll::-webkit-scrollbar { width: 3px; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: #e9d5ff; border-radius: 10px; }
      `}</style>

      <nav className="w-full bg-white shadow-sm sticky top-0 z-50">

        {/* ── TOP ROW: Logo + Icons ── */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
            <div className="flex items-center justify-between h-20">

              {/* Mobile hamburger */}
              <button
                className="md:hidden text-gray-500 hover:text-purple-600 transition-colors p-2 rounded-lg hover:bg-purple-50"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Logo */}
              <a href="/">
                <div className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0 flex items-center gap-2 md:gap-3">
                  <img
                    src="https://res.cloudinary.com/ddpvtobbh/image/upload/v1772228242/Logo_fybl1d.jpg"
                    alt="Cosmic Virtue"
                    className="h-9 md:h-14 w-auto object-contain rounded-full shadow-sm"
                  />
                  <div className="flex flex-col -space-y-0.5">
                    <h1
                      className="text-xl md:text-3xl font-bold leading-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap"
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                      Cosmic Virtue
                    </h1>
                    <p
                      className="text-[9px] md:text-xs leading-tight bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                      Dilute to your spiritual journey
                    </p>
                  </div>
                </div>
              </a>

              {/* Right icons */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Wishlist — desktop */}
                <button
                  onClick={handlewishlist}
                  className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
                >
                  <Heart className="w-5 h-5" />
                </button>

                {/* Cart */}
                <button
                  onClick={handlecart}
                  className="relative flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Profile — desktop */}
                <button
                  onClick={() => navigate('/login')}
                  className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
                >
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROW: Desktop Nav ── */}
        <div className="hidden md:block bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="flex items-center justify-center gap-6 lg:gap-8 h-14">

              {/* Home */}
              <a href="/" className={desktopLink}>
                Home
                <span className={underline}></span>
              </a>

              {/* OG Candles */}
              <div
                className="relative group"
                onMouseEnter={() => setCandleDropdown(true)}
                onMouseLeave={() => setCandleDropdown(false)}
              >
                <button className={desktopLink}>
                  OG Candles
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${candleDropdown ? 'rotate-180 text-purple-600' : ''}`} />
                  <span className={underline}></span>
                </button>
                {candleDropdown && (
                  <div className="absolute top-full left-0 mt-[18px] w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-slideDown">
                    {[['100ML', '100ml'], ['200ML', '200ml'], ['350ML', '350ml'],['120ML', '120ml']].map(([label, slug]) => (
                      <a key={slug} href={`/products?category=${slug}`} className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition-colors rounded-lg mx-1">
                        {label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Bath Gallery */}
              <div
                className="relative group"
                onMouseEnter={() => setBathDropdown(true)}
                onMouseLeave={() => setBathDropdown(false)}
              >
                <button className={desktopLink}>
                  Bath Gallery
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${bathDropdown ? 'rotate-180 text-purple-600' : ''}`} />
                  <span className={underline}></span>
                </button>
                {bathDropdown && (
                  <div className="absolute top-full left-0 mt-[18px] w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-slideDown">
                    {[['Bath Salt', 'bath-salt'], 
                    // ['Bath Bomb', 'bath-bomb']
                  ].map(([label, slug]) => (
                      <a key={slug} href={`/products?category=${slug}`} className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition-colors rounded-lg mx-1">
                        {label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Pearl Wax */}
              {/* <a href="/products?category=pearl-wax" className={desktopLink}>
                Pearl Wax
                <span className={underline}></span>
              </a> */}

              {/* Wax Sachet */}
              <a href="/products?category=wax sachets" className={desktopLink}>
                Wax Sachet
                <span className={underline}></span>
              </a>

              {/* Wax Melts & Diffusers */}
              {/* <a href="/products?category=wax-melts-diffusers" className={`${desktopLink} whitespace-nowrap`}>
                Wax Melts & Diffusers
                <span className={underline}></span>
              </a> */}

              {/* Limited Editions */}
              {/* <div
                className="relative group"
                onMouseEnter={() => setLimitedDropdown(true)}
                onMouseLeave={() => setLimitedDropdown(false)}
              >
                <button className={desktopLink}>
                  Limited Editions
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${limitedDropdown ? 'rotate-180 text-purple-600' : ''}`} />
                  <span className={underline}></span>
                </button>
                {limitedDropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-[18px] w-96 bg-white rounded-xl shadow-xl border border-gray-100 animate-slideDown p-3">
                    <div className="grid grid-cols-2 gap-0.5">
                      {[
                        ['Buddha Candle', 'buddha-candle'],
                        ['Pack of 3 Candles', 'pack-of-3'],
                        ['Coconut Shell', 'coconut-shell'],
                        ['Crystal Jar', 'crystal-jar'],
                        ['Flowers', 'flowers'],
                        ['Wax Melts', 'wax-melts'],
                        ['Tealights', 'tealights'],
                        ['Jungle Book', 'jungle-book'],
                        ['Bubble Candles', 'bubble-candles'],
                        ['Pillar Candles', 'pillar-candles'],
                        ['Fragrance from Glass', 'fragrance-from-glass'],
                        ['7 Chakra', '7-chakra'],
                      ].map(([label, slug]) => (
                        <a key={slug} href={`/products?category=${slug}`} className="px-3 py-2.5 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors">
                          {label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div> */}

            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE SIDEBAR ── */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[300px] sm:w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-2.5">
            <img src="https://res.cloudinary.com/ddpvtobbh/image/upload/v1772228242/Logo_fybl1d.jpg" alt="Cosmic Virtue" className="h-10 w-auto object-contain rounded-full" />
            <h2
              className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Cosmic Virtue
            </h2>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-400 hover:text-purple-600 transition-colors p-2 rounded-lg hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar links */}
        <div className="sidebar-scroll overflow-y-auto h-full pb-24">
          <div className="px-3 py-4 space-y-1">

            {/* Home */}
            <a
              href="/"
              className="flex items-center px-4 py-3 text-gray-700 font-medium text-sm rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>

            {/* OG Candles accordion */}
            <MobileAccordion
              label="OG Candles"
              isOpen={mobileCandleOpen}
              onToggle={() => setMobileCandleOpen(!mobileCandleOpen)}
            >
              {[['100ML', '100ml'], ['200ML', '200ml'], ['350ML', '350ml'],['120ML', '120ml']].map(([label, slug]) => (
                <a key={slug} href={`/products?category=${slug}`} className="block px-4 py-2.5 text-sm text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all" onClick={() => setMobileMenuOpen(false)}>
                  {label}
                </a>
              ))}
            </MobileAccordion>

            {/* Bath Gallery accordion */}
            <MobileAccordion
              label="Bath Gallery"
              isOpen={mobileBathOpen}
              onToggle={() => setMobileBathOpen(!mobileBathOpen)}
            >
              {[['Bath Salt', 'bath-salt'], 
              // ['Bath Bomb', 'bath-bomb']
            ].map(([label, slug]) => (
                <a key={slug} href={`/products?category=${slug}`} className="block px-4 py-2.5 text-sm text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all" onClick={() => setMobileMenuOpen(false)}>
                  {label}
                </a>
              ))}
            </MobileAccordion>

            {/* Pearl Wax */}
            {/* <a href="/products?category=pearl-wax" className="flex items-center px-4 py-3 text-gray-700 font-medium text-sm rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
              Pearl Wax
            </a> */}

            {/* Wax Sachet */}
            <a href="/products?category=wax-sachet" className="flex items-center px-4 py-3 text-gray-700 font-medium text-sm rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
              Wax Sachet
            </a>

            {/* Wax Melts & Diffusers */}
            {/* <a href="/products?category=wax-melts-diffusers" className="flex items-center px-4 py-3 text-gray-700 font-medium text-sm rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
              Wax Melts & Diffusers
            </a> */}

            {/* Limited Editions accordion */}
            {/* <MobileAccordion
              label="Limited Editions"
              isOpen={mobileLimitedOpen}
              onToggle={() => setMobileLimitedOpen(!mobileLimitedOpen)}
            >
              {[
                ['Buddha Candle', 'buddha-candle'],
                ['Pack of 3 Candles', 'pack-of-3'],
                ['Coconut Shell', 'coconut-shell'],
                ['Crystal Jar', 'crystal-jar'],
                ['Flowers', 'flowers'],
                ['Wax Melts', 'wax-melts'],
                ['Tealights', 'tealights'],
                ['Jungle Book', 'jungle-book'],
                ['Bubble Candles', 'bubble-candles'],
                ['Pillar Candles', 'pillar-candles'],
                ['Fragrance from Glass', 'fragrance-from-glass'],
                ['7 Chakra', '7-chakra'],
              ].map(([label, slug]) => (
                <a key={slug} href={`/products?category=${slug}`} className="block px-4 py-2.5 text-sm text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all" onClick={() => setMobileMenuOpen(false)}>
                  {label}
                </a>
              ))}
            </MobileAccordion> */}

            {/* Divider */}
            <div className="border-t border-gray-100 my-3 mx-2"></div>

            {/* Wishlist */}
            <a
              href="#wishlist"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium text-sm rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart className="w-4.5 h-4.5" />
              <span>Wishlist</span>
            </a>

            {/* Profile */}
            <a
              href="/login"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium text-sm rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="w-4.5 h-4.5" />
              <span>Profile</span>
            </a>

          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

// ── Mobile Accordion helper ──
const MobileAccordion = ({ label, isOpen, onToggle, children }) => (
  <div className="space-y-0.5">
    <button
      className="w-full flex items-center justify-between px-4 py-3 text-gray-700 font-medium text-sm rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-200"
      onClick={onToggle}
    >
      <span>{label}</span>
      <ChevronDown className={`w-4 h-4 transition-transform duration-300 text-gray-400 ${isOpen ? 'rotate-180 text-purple-500' : ''}`} />
    </button>
    {isOpen && (
      <div className="pl-3 space-y-0.5 animate-fadeIn">
        {children}
      </div>
    )}
  </div>
);

export default Navbar;