import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Star, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [summerSaleProducts, setSummerSaleProducts] = useState([]);
const [summerSaleLoading, setSummerSaleLoading] = useState(true);

  const slides = [
    {
      image: "https://res.cloudinary.com/ddpvtobbh/image/upload/v1774888340/Gemini_Generated_Image_3lv99q3lv99q3lv9_hcouxh.png",
      title: "COSMIC VIRTUE",
      subtitle: "BATH SALTS COLLECTION",
      description: "HANDCRAFTED BATH SALTS IN THREE NATURAL FLAVOURS",
      features: ["Lavender", "Orange", "Rosemary", "Pure Natural Ingredients"]
    },
    {
      image: "https://res.cloudinary.com/ddpvtobbh/image/upload/v1774887581/Gemini_Generated_Image_8x3blm8x3blm8x3b_cdch8y.png",
      title: "WAX DELIGHTS",
      subtitle: "BOTANICAL WAX COLLECTION",
      description: "HANDMADE WAX SACHETS & PEARL WAX CREATIONS",
      features: ["Floral Wax Sachets", "Pearl Wax Melts", "Botanical Embeds", "Artisan Crafted"]
    },
    {
      image: "https://res.cloudinary.com/ddpvtobbh/image/upload/v1774888338/Gemini_Generated_Image_s2rax5s2rax5s2ra_so5pir.png",
      title: "SACRED LIGHT",
      subtitle: "CANDLE COLLECTION",
      description: "PILLAR, JAR & 7 CHAKRA CANDLES FOR EVERY SPACE",
      features: ["Pillar Candles", "Jar Candles", "7 Chakra Candles", "Premium Soy Wax"]
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  const [activeTab, setActiveTab] = useState('new');
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch products
// Replace the two separate useEffects with one
useEffect(() => {
  const fetchAll = async () => {
    try {
      const [newArrivalsRes, bestSellersRes, categoriesRes, summerSaleRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/products/new-arrivals`),
        fetch(`${import.meta.env.VITE_API_URL}/products/best-sellers`),
        fetch(`${import.meta.env.VITE_API_URL}/categories?activeOnly=true`),
        fetch(`${import.meta.env.VITE_API_URL}/products/summer-sale`)
      ]);

      const [newArrivalsData, bestSellersData, categoriesData, summerSaleData] = await Promise.all([
        newArrivalsRes.json(),
        bestSellersRes.json(),
        categoriesRes.json(),
        summerSaleRes.json()
      ]);
      console.log("fetched data:", newArrivalsData, bestSellersData, categoriesData, summerSaleData);

      if (newArrivalsData.data) setNewArrivals(newArrivalsData.data);
      if (bestSellersData.data) setBestSellers(bestSellersData.data);
      if (categoriesData.data) setCategories(categoriesData.data);
      if (summerSaleData.data) setSummerSaleProducts(summerSaleData.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setCategoriesLoading(false);
        setSummerSaleLoading(false);
    }
  };
  fetchAll();
}, []);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const isUserLoggedIn = () => !!localStorage.getItem('token');

  const addToLocalCart = (cartItem) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex(item => item.productId === cartItem.productId);
    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += cartItem.quantity;
    } else {
      existingCart.push(cartItem);
    }
    localStorage.setItem('cart', JSON.stringify(existingCart));
  };

  const addToCartAPI = async (productId, quantity) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ productId, quantity })
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return response.json();
  };

  const handleAddToCart = async (product, e) => {
    e.stopPropagation();
    try {
      const cartItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.img,
        size: product.dimension ? `${product.dimension.height}cm` : 'Standard'
      };
      if (isUserLoggedIn()) {
        await addToCartAPI(product._id, 1);
        console.log('Added to cart (API)');
      } else {
        addToLocalCart(cartItem);
        console.log('Added to cart (localStorage)');
      }
      alert('Product added to cart successfully!');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  const addToLocalWishlist = (wishlistItem) => {
    const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const exists = existingWishlist.find(item => item.productId === wishlistItem.productId);
    if (!exists) {
      existingWishlist.push(wishlistItem);
      localStorage.setItem('wishlist', JSON.stringify(existingWishlist));
    }
  };

  const addToWishlistAPI = async (productId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ productId })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add to wishlist');
    return data;
  };

  const handleAddToWishlist = async (product, e) => {
    e.stopPropagation();
    try {
      const wishlistItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.img,
        category: product.category
      };
      if (isUserLoggedIn()) {
        await addToWishlistAPI(product._id);
        console.log('Added to wishlist (API)');
      } else {
        addToLocalWishlist(wishlistItem);
        console.log('Added to wishlist (localStorage)');
      }
      alert('Product added to wishlist!');
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert(error.message);
    }
  };

  const displayProducts = activeTab === 'new' ? newArrivals : bestSellers;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=Montserrat:wght@300;400;500;600;700&display=swap');

        /* Hero animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .anim-1 { animation: fadeInUp 0.9s ease-out 0.1s both; }
        .anim-2 { animation: fadeInUp 0.9s ease-out 0.3s both; }
        .anim-3 { animation: fadeInUp 0.9s ease-out 0.5s both; }
        .anim-4 { animation: fadeInUp 0.9s ease-out 0.7s both; }

        /* Slide transition */
        .slide-enter  { animation: fadeIn 1s ease-in-out; }

        /* Smooth image zoom */
        .img-zoom { transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94); }
        .img-zoom:hover { transform: scale(1.08); }

        /* Product card hover */
        .product-card { transition: transform 0.35s ease, box-shadow 0.35s ease; }
        .product-card:hover { transform: translateY(-8px); box-shadow: 0 24px 60px rgba(147,51,234,0.14); }

        /* Category card hover */
        .cat-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .cat-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }

        /* Why-us card */
        .why-card { transition: transform 0.35s ease, box-shadow 0.35s ease; }
        .why-card:hover { transform: translateY(-6px); }
        .why-icon { transition: transform 0.3s ease; }
        .why-card:hover .why-icon { transform: scale(1.12) rotate(6deg); }

        /* Global body gradient */
        body {
          background: linear-gradient(135deg, #fdf4ff 0%, #faf5ff 40%, #fce7f3 100%);
          min-height: 100vh;
          background-attachment: fixed;
        }

        /* Summer Sale */
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes floatSun {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%       { transform: translateY(-6px) rotate(10deg); }
}
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 25px rgba(251,191,36,0.35); }
  50%       { box-shadow: 0 0 50px rgba(251,191,36,0.7), 0 0 80px rgba(251,191,36,0.2); }
}
.summer-sale-section { animation: pulseGlow 2.5s ease-in-out infinite; }
.summer-card-home {
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}
.summer-card-home:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(251,191,36,0.28);
}
.summer-card-home .s-img { transition: transform 0.6s ease; }
.summer-card-home:hover .s-img { transform: scale(1.08); }
.summer-quick-add-home {
  opacity: 0;
  transform: translateY(5px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.summer-card-home:hover .summer-quick-add-home {
  opacity: 1;
  transform: translateY(0);
}
.shimmer-badge {
  background: linear-gradient(90deg, #f59e0b, #ef4444, #f97316, #ef4444, #f59e0b);
  background-size: 200% auto;
  animation: shimmer 2.5s linear infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
      `}</style>

      {/* ══════════════════════════════════════
          HERO CAROUSEL
      ══════════════════════════════════════ */}
<section className="relative w-full h-[60vw] min-h-[500px] sm:h-screen overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-no-repeat scale-105 bg-top sm:bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            {/* Multi-layer overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Slide content */}
            {index === currentSlide && (
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
                  <div className="max-w-xl lg:max-w-2xl">

                    {/* Eyebrow */}
                    <div className="anim-1 flex items-center gap-2 mb-4">
                      <span className="inline-block w-8 h-px bg-white/60"></span>
                      <span
                        className="text-white/80 text-xs uppercase tracking-[0.3em] font-medium"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        {slide.subtitle}
                      </span>
                    </div>

                    {/* Main title */}
                    <h1
                      className="anim-2 text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-5"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {slide.title}
                    </h1>

                    {/* Description */}
                    <p
                      className="anim-3 text-sm sm:text-base text-white/80 mb-8 tracking-widest font-light"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {slide.description}
                    </p>

                    {/* CTA */}
                    <div className="anim-4 flex flex-wrap gap-3 mb-10">
                      <button
                        onClick={() => navigate('/products')}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3.5 font-semibold text-sm tracking-widest uppercase hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 rounded-xl"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        Shop Now
                      </button>
                      <button
                        onClick={() => navigate('/categories')}
                        className="bg-white/10 backdrop-blur-md border border-white/50 text-white px-8 py-3.5 font-semibold text-sm tracking-widest uppercase hover:bg-white/20 transition-all duration-300 rounded-xl"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        Explore
                      </button>
                    </div>

                    {/* Feature pills */}
                    <div className="anim-4 flex flex-wrap gap-2">
                      {slide.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="bg-white/10 backdrop-blur-sm border border-white/25 text-white/90 text-xs px-3 py-1.5 rounded-full"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Love note — desktop only */}
                  <div className="absolute top-8 right-8 text-right hidden lg:block">
                    <div className="text-white/60 text-[10px] uppercase tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      <p>LOVE,</p>
                      <p>YOUR SECRET</p>
                      <p>BOTANIST</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Prev / Next arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/15 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 z-10 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/15 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 z-10 group"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-400 rounded-full ${
                index === currentSlide
                  ? 'bg-white w-8 h-1.5'
                  : 'bg-white/40 w-1.5 h-1.5 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          MARQUEE TRUST STRIP
      ══════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-3 overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {['🌿 100% Natural Ingredients', '🕯️ Handcrafted with Love', '📦 Free Shipping over ₹999', '♻️ Eco-Friendly Packaging', '⭐ 5-Star Rated', '🌿 100% Natural Ingredients', '🕯️ Handcrafted with Love', '📦 Free Shipping over ₹999', '♻️ Eco-Friendly Packaging', '⭐ 5-Star Rated'].map((item, i) => (
            <span key={i} className="text-white text-sm font-medium tracking-wide flex-shrink-0" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {item}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .animate-marquee { animation: marquee 22s linear infinite; }
        `}</style>
      </div>

      {/* ══════════════════════════════════════
    ☀️ SUMMER SALE SECTION
══════════════════════════════════════ */}


      {/* ══════════════════════════════════════
          COLLECTIONS SECTION
      ══════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-10 bg-gradient-to-r from-purple-400 to-pink-400"></span>
              <span className="text-purple-500 text-xs uppercase tracking-[0.25em] font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Browse
              </span>
              <span className="h-px w-10 bg-gradient-to-r from-pink-400 to-purple-400"></span>
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Collections
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
              Explore our curated range of handcrafted products for every occasion
            </p>
          </div>

          {/* Grid */}
          {categoriesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-white rounded-2xl shadow-sm animate-pulse" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>No collections available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {categories.slice(0, 8).map((category, index) => (
                <div
                  key={category._id}
                  className="cat-card group relative overflow-hidden bg-white rounded-2xl shadow-md cursor-pointer"
                  onClick={() => navigate(`/products?category=${category.name}`)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={category.imageUrl || `https://images.unsplash.com/photo-${
                        ['1602874801006-64c78b297c86','1608571423902-eed4a5ad8108',
                         '1603006905003-be475563bc59','1615486511484-92e172cc4fe0',
                         '1571875257727-256c39da42af','1605651202774-7d573fd3f12d',
                         '1608181831042-c5a1e1d1aff7','1602874801006-64c78b297c86'][index % 8]
                      }?w=600&h=600&fit=crop`}
                      alt={category.name}
                      className="img-zoom w-full h-full object-contain"
                    />
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Shop <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  {/* Category name bar */}
                  <div className="p-4 bg-white">
                    <h3
                      className="text-sm sm:text-base font-semibold text-gray-900 flex items-center justify-between"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {category.name}
                      <ArrowRight className="w-4 h-4 text-purple-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View all */}
          <div className="flex justify-center mt-10 sm:mt-14">
            <button
              onClick={() => navigate('/categories')}
              className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-xl font-semibold text-sm tracking-wide uppercase hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-200"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {categories.length > 8 ? 'Show More' : 'View All Categories'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-10 bg-gradient-to-r from-purple-400 to-pink-400"></span>
              <span className="text-purple-500 text-xs uppercase tracking-[0.25em] font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Handpicked For You
              </span>
              <span className="h-px w-10 bg-gradient-to-r from-pink-400 to-purple-400"></span>
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Featured Candles
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
              Discover our handpicked selection of premium candles
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-white shadow-md rounded-full p-1.5 border border-gray-100">
              {[
                { key: 'new', label: 'New Arrivals' },
                { key: 'best', label: 'Best Sellers' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-6 sm:px-8 py-2.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 ${
                    activeTab === key
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Products grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-100" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-5 bg-gray-100 rounded w-2/3" />
                    <div className="h-4 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-16">
              <Sparkles className="w-12 h-12 text-purple-300 mx-auto mb-4" />
              <p className="text-gray-500 text-base" style={{ fontFamily: "'Montserrat', sans-serif" }}>No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayProducts.map((product) => (
                <div
                  key={product._id}
                  className="product-card group bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={product.img[0] || 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=600&h=600&fit=crop'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                      style={{ transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=600&h=600&fit=crop'; }}
                    />

                    {/* Sale badge */}
                    {product.salePercentage && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-md">
                          SALE {product.salePercentage}%
                        </span>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
                          className="bg-white text-gray-900 px-5 py-2 rounded-full font-semibold text-xs tracking-wide hover:bg-gray-100 transition-colors shadow-lg"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Quick View
                        </button>
                        <button
                          onClick={(e) => handleAddToWishlist(product, e)}
                          className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                        >
                          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Product info */}
                  <div className="p-5 sm:p-6">
                    {/* Category */}
                    <p className="text-xs text-purple-500 uppercase tracking-widest mb-1.5 font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {product.category?.name || 'Cosmic Virtue'}
                    </p>

                    {/* Name */}
                    <h3
                      className="text-base sm:text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors leading-snug"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-white text-white" />
                        <span className="text-white text-[10px] font-bold">4.5</span>
                      </div>
                      <span className="text-xs text-gray-400">(New)</span>
                    </div>

                    {/* Price + Cart */}
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className="text-xl sm:text-2xl font-bold text-gray-900"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        ₹{product.price}
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide uppercase hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-purple-200"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Add to Cart</span>
                        <span className="sm:hidden">Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View all products */}
          <div className="flex justify-center mt-12">
            <button
              onClick={() => navigate('/products')}
              className="group flex items-center gap-2 border-2 border-gray-900 text-gray-900 px-10 py-4 rounded-xl font-semibold text-sm tracking-wide uppercase hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-md hover:shadow-xl"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              View All Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
    BRAND STORY BANNER  (Pravaah-inspired editorial block)
══════════════════════════════════════ */}
<section className="py-0 overflow-hidden">
  <div className="flex flex-col lg:flex-row min-h-[480px]">

    {/* Left — image */}
    <div className="lg:w-1/2 relative min-h-[320px] lg:min-h-[480px] overflow-hidden">
      <img
        src="https://res.cloudinary.com/ddpvtobbh/image/upload/v1776347746/Bottle_Main_Photo_kkytos.png"
        alt="Our Story"
        className="w-full h-full object-cover absolute inset-0"
        style={{ transition: 'transform 0.6s ease' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
    </div>

    {/* Right — text */}
    <div className="lg:w-1/2 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center px-8 sm:px-14 py-14">
      <div className="max-w-lg">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-white/50"></span>
          <span className="text-white/70 text-xs uppercase tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Our Story
          </span>
        </div>
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Crafted with<br />
          <span className="italic font-normal">intention &amp; love</span>
        </h2>
        <p
          className="text-white/80 text-sm sm:text-base leading-relaxed mb-8"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
        >
          Every Cosmic Virtue candle begins as a vision — a scent, a feeling, a moment we want to bottle for you. Handpoured in small batches using 100% natural soy wax, our candles are free from toxins and full of intention.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wide hover:bg-purple-50 transition-all duration-300 shadow-lg"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Explore Our Range
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</section>

{/* ══════════════════════════════════════
    GIFTING SECTION  (Pravaah-inspired)
══════════════════════════════════════ */}
<section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50">
  <div className="max-w-7xl mx-auto">

    {/* Header */}
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <span className="h-px w-10 bg-gradient-to-r from-purple-400 to-pink-400"></span>
        <span className="text-purple-500 text-xs uppercase tracking-[0.25em] font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Perfect For Every Occasion
        </span>
        <span className="h-px w-10 bg-gradient-to-r from-pink-400 to-purple-400"></span>
      </div>
      <h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        The Art of Gifting
      </h2>
      <p
        className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto"
        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
      >
        Thoughtfully curated gift sets for birthdays, anniversaries, festivals and everyday celebrations
      </p>
    </div>

    {/* Gift cards row */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 mb-10">
      {[
        {
          emoji: '🎁',
          title: 'Birthday Gifts',
          desc: 'Make their day unforgettable with a personalised scented set',
          gradient: 'from-purple-100 to-purple-50',
          border: 'border-purple-200',
          tag: 'Most Popular',
          tagColor: 'from-purple-600 to-pink-600',
        },
        {
          emoji: '💑',
          title: 'Anniversary Sets',
          desc: 'Romantic, intimate and beautifully wrapped for that special person',
          gradient: 'from-pink-100 to-pink-50',
          border: 'border-pink-200',
          tag: 'Fan Favourite',
          tagColor: 'from-pink-600 to-rose-600',
        },
        {
          emoji: '🪔',
          title: 'Festival Hampers',
          desc: 'Diwali, Holi, Christmas — celebrate every moment with light & fragrance',
          gradient: 'from-orange-50 to-yellow-50',
          border: 'border-orange-200',
          tag: 'Seasonal',
          tagColor: 'from-orange-500 to-pink-500',
        },
      ].map((card, i) => (
        <div
          key={i}
          onClick={() => navigate('/products')}
          className={`group relative bg-gradient-to-br ${card.gradient} border ${card.border} rounded-2xl p-7 sm:p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
        >
          {/* Tag badge */}
          <span className={`absolute top-4 right-4 bg-gradient-to-r ${card.tagColor} text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full`}>
            {card.tag}
          </span>

          <div className="text-4xl mb-5">{card.emoji}</div>
          <h3
            className="text-xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {card.title}
          </h3>
          <p
            className="text-gray-500 text-sm leading-relaxed mb-5"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
          >
            {card.desc}
          </p>
          <span
            className="flex items-center gap-1 text-purple-600 text-xs font-semibold uppercase tracking-wide group-hover:gap-2 transition-all"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Shop Now <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      ))}
    </div>

    {/* Bottom CTA banner */}
    <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-7 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div>
        <p className="text-xs text-purple-500 uppercase tracking-widest font-semibold mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Bulk &amp; Custom Orders
        </p>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Planning a corporate gift?
        </h3>
        <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
          Custom branding, personalised labels &amp; bulk discounts available
        </p>
      </div>
      <button
        onClick={() => navigate('/contact')}
        className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wide hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl hover:shadow-purple-200 flex items-center gap-2"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Get in Touch <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </div>
</section>
    </>
  );
};

export default HomePage;