import React, { useState,useEffect } from 'react';
import { Search, Heart, ShoppingCart, User, ChevronDown, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CartSidebar from '../Pages/CartPage'; // Import the CartSidebar component

const Navbar = () => {
  const [candleDropdown, setCandleDropdown] = useState(false);
  const [bathDropdown, setBathDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCandleOpen, setMobileCandleOpen] = useState(false);
  const [mobileBathOpen, setMobileBathOpen] = useState(false);
  const [limitedDropdown, setLimitedDropdown] = useState(false);
  const [mobileLimitedOpen, setMobileLimitedOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // Add cart state
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  

  const isUserLoggedIn = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get user token
const getUserToken = () => {
  return localStorage.getItem('token');
};

// Get user ID
const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || user._id;
  } catch (error) {
    return null;
  }
};

// Get cart count from localStorage
const getLocalCartCount = () => {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.reduce((total, item) => total + item.quantity, 0);
  } catch (error) {
    return 0;
  }
};

// Get cart count from API
const getAPICartCount = async () => {
  try {
    const token = getUserToken();
    const userId = getUserId();
    
    if (!token || !userId) return 0;

    const response = await fetch(`http://localhost:3000/cart`, {
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

// Update cart count
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
  // Update cart count when component mounts
  updateCartCount();

  // Update cart count when localStorage changes (for non-logged users)
  const handleStorageChange = () => {
    if (!isUserLoggedIn()) {
      updateCartCount();
    }
  };

  window.addEventListener('storage', handleStorageChange);
  
  // Also listen for custom cart update event
  window.addEventListener('cartUpdated', updateCartCount);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('cartUpdated', updateCartCount);
  };
}, []);

 const handlecart = () => {
  setIsCartOpen(true);
  // Refresh cart count when opening cart
  updateCartCount();
};

const handlewishlist = () => {
    navigate('/wishlist');
};
  return (
    <>
      <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
        {/* Top Row - Logo and Icons */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
            <div className="flex items-center justify-between h-20">
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden text-gray-600 hover:text-purple-600 transition-colors p-2"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Logo - Centered on mobile, left on desktop */}
              <a href="/">
                <div className="absolute left-1/2 transform -translate-x-1/2 md:relative md:left-0 md:transform-none flex items-center gap-1.5 md:gap-3">
                  <img 
  src="/Logo.jpeg" 
  alt="Cosmic Virtue" 
  className="h-8 md:h-16 w-auto object-contain"
/>
                  <div className="flex flex-col -space-y-1">
                    <h1 className="text-lg md:text-3xl font-bold leading-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap" style={{ fontFamily: "'Dancing Script', cursive" }}>
                      Cosmic Virtue
                    </h1>
                    <p className="text-[9px] md:text-sm leading-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" style={{ fontFamily: "'Dancing Script', cursive" }}>Dilute to your spiritual journey</p>
                  </div>
                </div>
              </a>

              {/* Right Side Icons */}
              <div className="flex items-center space-x-4">
                
                <button className="hidden md:block text-gray-600 hover:text-pink-600 transition-colors duration-200 p-2 relative"
                onClick={handlewishlist}>
                  <Heart className="w-5 h-5" />
                </button>
                <button 
                  className="text-gray-600 hover:text-purple-600 transition-colors duration-200 p-2 relative" 
                  onClick={handlecart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {/* Optional: Add cart item count badge */}
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount || 0}
                  </span>
                </button>
                <button className="hidden md:block text-gray-600 hover:text-purple-600 transition-colors duration-200 p-2"
                onClick={()=>{
                  navigate('/login');
                }}>
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Navigation Links (Desktop Only) */}
        <div className="hidden md:block bg-white ">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="flex items-center justify-center space-x-8 h-14">
              {/* Home */}
              <a 
                href="/" 
                className="text-gray-700 font-medium text-sm tracking-wide relative group py-2 transition-colors hover:text-purple-600"
              >
                Home
                <span className="absolute -bottom-3.5 left-0 w-full h-0.5 bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a>

              {/* OG Candles Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setCandleDropdown(true)}
                onMouseLeave={() => setCandleDropdown(false)}
              >
                <button className="text-gray-700 font-medium text-sm tracking-wide relative py-2 transition-colors hover:text-purple-600 flex items-center gap-1">
                  OG Candles
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${candleDropdown ? 'rotate-180' : ''}`} />
                  <span className="absolute -bottom-3.5 left-0 w-full h-0.5 bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </button>
                
                {candleDropdown && (
                  <div className="absolute top-full left-0 mt-3.5 w-52 bg-white rounded-md shadow-lg border border-gray-200 py-2 animate-slideDown">
                    <a href="/products?category=og-candles-100ml" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                      100ML
                    </a>
                    <a href="/products?category=og-candles-200ml" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                      200ML
                    </a>
                    <a href="/products?category=og-candles-350ml" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                      350ML
                    </a>
                  </div>
                )}
              </div>

              {/* Bath Gallery Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setBathDropdown(true)}
                onMouseLeave={() => setBathDropdown(false)}
              >
                <button className="text-gray-700 font-medium text-sm tracking-wide relative py-2 transition-colors hover:text-purple-600 flex items-center gap-1">
                  Bath Gallery
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${bathDropdown ? 'rotate-180' : ''}`} />
                  <span className="absolute -bottom-3.5 left-0 w-full h-0.5 bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </button>
                
                {bathDropdown && (
                  <div className="absolute top-full left-0 mt-3.5 w-52 bg-white rounded-md shadow-lg border border-gray-200 py-2 animate-slideDown">
                    <a href="/products?category=bath-salt" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                      Bath Salt
                    </a>
                    <a href="/products?category=bath-bomb" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                      Bath Bomb
                    </a>
                  </div>
                )}
              </div>

              {/* Pearl Wax */}
              <a 
                href="/products?category=pearl-wax" 
                className="text-gray-700 font-medium text-sm tracking-wide relative group py-2 transition-colors hover:text-purple-600"
              >
                Pearl Wax
                <span className="absolute -bottom-3.5 left-0 w-full h-0.5 bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a>

              {/* Wax Sachet */}
              <a 
                href="/products?category=wax-sachet" 
                className="text-gray-700 font-medium text-sm tracking-wide relative group py-2 transition-colors hover:text-purple-600"
              >
                Wax Sachet
                <span className="absolute -bottom-3.5 left-0 w-full h-0.5 bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a>

              {/* Wax Melts & Diffusers */}
              <a 
                href="/products?category=wax-melts-diffusers" 
                className="text-gray-700 font-medium text-sm tracking-wide relative group py-2 transition-colors hover:text-purple-600 whitespace-nowrap"
              >
                Wax Melts & Diffusers
                <span className="absolute -bottom-3.5 left-0 w-full h-0.5 bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a>

              {/* Limited Editions Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setLimitedDropdown(true)}
                onMouseLeave={() => setLimitedDropdown(false)}
              >
                <button className="text-gray-700 font-medium text-sm tracking-wide relative py-2 transition-colors hover:text-purple-600 flex items-center gap-1">
                  Limited Editions
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${limitedDropdown ? 'rotate-180' : ''}`} />
                  <span className="absolute -bottom-3.5 left-0 w-full h-0.5 bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </button>
                
                {limitedDropdown && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3.5 w-96 bg-white rounded-md shadow-lg border border-gray-200 animate-slideDown">
                    <div className="grid grid-cols-2 gap-0.5 p-3">
                      <a href="/products?category=buddha-candle" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded transition-colors">
                        Buddha Candle
                      </a>
                      <a href="/products?category=pack-of-3" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded transition-colors">
                        Pack of 3 Candles
                      </a>
                      <a href="/products?category=coconut-shell" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded transition-colors">
                        Coconut Shell
                      </a>
                      <a href="/products?category=crystal-jar" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded transition-colors">
                        Crystal Jar
                      </a>
                      <a href="/products?category=flowers" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded transition-colors">
                        Flowers
                      </a>
                      <a href="/products?category=wax-melts" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded transition-colors">
                        Wax Melts
                      </a>
                      <a href="/products?category=tealights" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded transition-colors">
                        Tealights
                      </a>
                      <a href="/products?category=jungle-book" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded transition-colors">
                        Jungle Book
                      </a>
                      <a href="/products?category=bubble-candles" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded transition-colors">
                        Bubble Candles
                      </a>
                      <a href="/products?category=pillar-candles" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded transition-colors">
                        Pillar Candles
                      </a>
                      <a href="/products?category=fragrance-from-glass" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded transition-colors">
                        Fragrance from Glass
                      </a>
                      <a href="/products?category=7-chakra" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded transition-colors">
                        7 Chakra
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div 
          className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <img 
                src="/Logo.jpeg" 
                alt="Cosmic Virtue" 
                className="h-10 w-auto object-contain"
              />
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" style={{ fontFamily: "'Dancing Script', cursive" }}>
                Cosmic Virtue
              </h2>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-600 hover:text-purple-600 transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="overflow-y-auto h-full pb-20">
            <div className="px-4 py-6 space-y-2">
              {/* Home */}
              <a 
                href="/" 
                className="block px-4 py-3 text-gray-700 font-medium hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>

              {/* OG Candles Accordion */}
              <div className="space-y-1">
                <button 
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 font-medium hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 rounded-lg transition-all duration-200"
                  onClick={() => setMobileCandleOpen(!mobileCandleOpen)}
                >
                  <span>OG Candles</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileCandleOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {mobileCandleOpen && (
                  <div className="pl-4 space-y-1 animate-fadeIn">
                    <a 
                      href="/products?category=og-candles-100ml" 
                      className="block px-4 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      100ML
                    </a>
                    <a 
                      href="/products?category=og-candles-200ml" 
                      className="block px-4 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      200ML
                    </a>
                    <a 
                      href="/products?category=og-candles-350ml" 
                      className="block px-4 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      350ML
                    </a>
                  </div>
                )}
              </div>

              {/* Bath Gallery Accordion */}
              <div className="space-y-1">
                <button 
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 font-medium hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 rounded-lg transition-all duration-200"
                  onClick={() => setMobileBathOpen(!mobileBathOpen)}
                >
                  <span>Bath Gallery</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileBathOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {mobileBathOpen && (
                  <div className="pl-4 space-y-1 animate-fadeIn">
                    <a 
                      href="/products?category=bath-salt" 
                      className="block px-4 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Bath Salt
                    </a>
                    <a 
                      href="/products?category=bath-bomb" 
                      className="block px-4 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Bath Bomb
                    </a>
                  </div>
                )}
              </div>

              {/* Pearl Wax */}
              <a 
                href="/products?category=pearl-wax" 
                className="block px-4 py-3 text-gray-700 font-medium hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pearl Wax
              </a>

              {/* Wax Sachet */}
              <a 
                href="/products?category=wax-sachet" 
                className="block px-4 py-3 text-gray-700 font-medium hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Wax Sachet
              </a>

              {/* Wax Melts with Diffusers */}
              <a 
                href="/products?category=wax-melts-diffusers" 
                className="block px-4 py-3 text-gray-700 font-medium hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Wax Melts & Diffusers
              </a>

              {/* Limited Editions Accordion */}
              <div className="space-y-1">
                <button 
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 font-medium hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 rounded-lg transition-all duration-200"
                  onClick={() => setMobileLimitedOpen(!mobileLimitedOpen)}
                >
                  <span>Limited Editions</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileLimitedOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {mobileLimitedOpen && (
                  <div className="pl-4 space-y-1 animate-fadeIn">
                    <a 
                      href="/products?category=buddha-candle" 
                      className="block px-4 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Buddha Candle
                    </a>
                    <a 
                      href="/products?category=pack-of-3" 
                      className="block px-4 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Pack of 3 Candles
                    </a>
                    <a 
                      href="/products?category=coconut-shell" 
                      className="block px-4 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Coconut Shell
                    </a>
                    <a 
                      href="/products?category=crystal-jar" 
                      className="block px-4 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Crystal Jar
                    </a>
                    <a 
                      href="/products?category=flowers" 
                      className="block px-4 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Flowers
                    </a>
                    <a 
                      href="/products?category=wax-melts" 
                      className="block px-4 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Wax Melts
                    </a>
                    <a 
                      href="/products?category=tealights" 
                      className="block px-4 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Tealights
                    </a>
                    <a 
                      href="/products?category=jungle-book" 
                      className="block px-4 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Jungle Book
                    </a>
                    <a 
                      href="/products?category=bubble-candles" 
                      className="block px-4 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Bubble Candles
                    </a>
                    <a 
                      href="/products?category=pillar-candles" 
                      className="block px-4 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Pillar Candles
                    </a>
                    <a 
                      href="/products?category=fragrance-from-glass" 
                      className="block px-4 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Fragrance from Glass
                    </a>
                    <a 
                      href="/products?category=7-chakra" 
                      className="block px-4 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      7 Chakra
                    </a>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* Additional Mobile Links */}

              <a 
                href="#wishlist" 
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="w-5 h-5" />
                <span>Wishlist</span>
              </a>

              <a 
                href="/login" 
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Sidebar Component */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.15s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;