import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight,Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "https://res.cloudinary.com/drl7llkoc/image/upload/v1771015981/Banner3_vuwdrj.jpg",
      title: "COSMIC VIRTUE",
    subtitle: "SIGNATURE COLLECTION",
    description: "HANDCRAFTED CANDLES WITH NATURAL ESSENCE",
    features: ["Pure Ingredients", "Artisan Crafted", "Elegant Design", "Premium Fragrance"]
  },
    {
      image: "https://res.cloudinary.com/drl7llkoc/image/upload/v1771015981/b5_b5gzom.jpg",
      title: "OPULENT ILLUMINATION",
    subtitle: "LUXURY COLLECTION",
    description: "GOLD-INFUSED CANDLES FOR ELEGANT SPACES",
    features: ["Premium Soy Wax", "Metallic Finish", "Long-Lasting Burn", "Sophisticated Ambiance"]
  },
    {
      image: "https://res.cloudinary.com/drl7llkoc/image/upload/v1771015981/Banner4_swoxzk.jpg",
      title: "BOTANICAL SERENITY",
    subtitle: "NATURE'S EMBRACE",
    description: "ORGANIC CANDLES INSPIRED BY NATURE",
    features: ["Natural Botanicals", "Rustic Charm", "Calming Scents", "Eco-Conscious"]
  },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

const [activeTab, setActiveTab] = useState('new');
const [newArrivals, setNewArrivals] = useState([]);
const [bestSellers, setBestSellers] = useState([]);
const [categories, setCategories] = useState([]); // Add this
const [loading, setLoading] = useState(true);
const [categoriesLoading, setCategoriesLoading] = useState(true); // Add this
const navigate = useNavigate();

// Fetch products from API
useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/products');
      const data = await response.json();
      console.log('Fetched products:', data.data);
      
      if (data.data) {
        // Filter new arrivals and best sellers
        const newProducts = data.data.filter(product => product.isNewArrival === true);
        const bestProducts = data.data.filter(product => product.isBestSeller === true);
        console.log('New Arrivals:', newProducts);
        setNewArrivals(newProducts);
        setBestSellers(bestProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

// Fetch categories from API
useEffect(() => {
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('http://localhost:3000/categories');
      const data = await response.json();
      
      console.log('Categories Response:', data);
      
      if (data.data && Array.isArray(data.data)) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  fetchCategories();
}, []);

// API Configuration
const API_BASE_URL = 'http://localhost:3000';

// Helper Functions for Cart
const isUserLoggedIn = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

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
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productId, quantity })
  });

  if (!response.ok) {
    throw new Error('Failed to add to cart');
  }

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

// Wishlist Helper Functions
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
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productId })
  });

  if (!response.ok) {
    throw new Error('Failed to add to wishlist');
  }

  return response.json();
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
    alert('Failed to add to wishlist. Please try again.');
  }
};
  return (
    <>
      {/* Hero Section with Carousel */}
      <div className="relative w-full h-screen overflow-hidden bg-transparent">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-black/30 ${index === currentSlide ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 ease-in-out`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Subtle Overlay */}
              <div className="absolute inset-0  from-white/20 via-transparent to-white/10"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 w-full">
                <div className="max-w-2xl animate-fadeInUp">
                  {/* Main Title */}
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-tight tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {slide.title}
                  </h1>
                  
                  {/* Subtitle */}
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 tracking-widest" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {slide.subtitle}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-sm md:text-base text-white/90 mb-8 tracking-wide font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {slide.description}
                  </p>

                  {/* Shop Now Button */}
                  <button className="bg-white/10 backdrop-blur-md border-2 border-white text-white px-10 py-4 font-bold text-sm tracking-widest hover:bg-white hover:text-gray-900 transform hover:scale-105 transition-all duration-300 shadow-2xl mb-12 animate-fadeInUp animation-delay-300" style={{ fontFamily: "'Montserrat', sans-serif" }}
                    onClick={() => navigate('/products')} >
                    SHOP NOW
                  </button>

                  {/* Features List */}
                  <div className="space-y-2 animate-fadeInUp animation-delay-400">
                    {slide.features.map((feature, idx) => (
                      <p key={idx} className="text-white/95 text-base md:text-lg font-light tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {feature}
                      </p>
                    ))}
                  </div>

                  {/* Love Note - Top Right */}
                  <div className="absolute top-8 right-8 text-right hidden lg:block animate-fadeInUp animation-delay-500">
                    <p className="text-white text-sm tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      LOVE,
                    </p>
                    <p className="text-white text-sm tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      YOUR SECRET
                    </p>
                    <p className="text-white text-sm tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      BOTANIST
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
  onClick={prevSlide}
  className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-lg text-white p-4 rounded-full hover:bg-white/30 transition-all duration-300 z-10 group border border-white/30"
>
  <ChevronLeft className="w-7 h-7 group-hover:scale-110 transition-transform" />
</button>

<button
  onClick={nextSlide}
  className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-lg text-white p-4 rounded-full hover:bg-white/30 transition-all duration-300 z-10 group border border-white/30"
>
  <ChevronRight className="w-7 h-7 group-hover:scale-110 transition-transform" />
</button>
        {/* Dots Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex space-x-4 z-10">
          {slides.map((_, index) => (
            <button
  key={index}
  onClick={() => goToSlide(index)}
  className={`transition-all duration-300 rounded-full ${
    index === currentSlide
      ? 'bg-white w-14 h-1.5'
      : 'bg-white/50 w-1.5 h-1.5 hover:bg-white/80'
  }`}
/>
          ))}
        </div>
      </div>

      {/* Collections Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            Our Collections
          </h2>

          {/* Collections Grid */}
         {/* Collections Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {categoriesLoading ? (
    // Loading state
    <div className="col-span-full text-center py-12">
      <p className="text-gray-600">Loading collections...</p>
    </div>
  ) : categories.length === 0 ? (
    // Empty state
    <div className="col-span-full text-center py-12">
      <p className="text-gray-600">No collections available</p>
    </div>
  ) : (
    categories.slice(0, 8).map((category, index) => (
      <div 
        key={category._id} 
        className="group relative overflow-hidden bg-neutral-50 hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={() => navigate(`/products?category=${category._id}`)}
      >
        <div className="aspect-square overflow-hidden">
          <img 
            src={category.img || `https://images.unsplash.com/photo-${
              ['1602874801006-64c78b297c86', '1608571423902-eed4a5ad8108', 
               '1603006905003-be475563bc59', '1615486511484-92e172cc4fe0',
               '1571875257727-256c39da42af', '1605651202774-7d573fd3f12d',
               '1608181831042-c5a1e1d1aff7', '1602874801006-64c78b297c86'][index % 8]
            }?w=600&h=600&fit=crop`}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-6 bg-neutral-50">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {category.name}
            <span className="text-lg">→</span>
          </h3>
        </div>
      </div>
    ))
  )}
</div>        </div>

<div className="flex justify-center mt-12">
  <button 
    onClick={() => navigate('/categories')}
    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 font-semibold text-base tracking-wide hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
    style={{ fontFamily: "'Montserrat', sans-serif" }}
  >
    {categories.length > 8 ? 'SHOW MORE' : 'VIEW ALL CATEGORIES'}
  </button>
</div>
      </section>

      {/* Featured Candles Section */}
<section className="py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
  <div className="max-w-7xl mx-auto">
    {/* Section Header */}
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
        Featured Candles
      </h2>
      <p className="text-gray-600 text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        Discover our handpicked selection of premium candles
      </p>
    </div>

    {/* Tabs */}
    <div className="flex justify-center mb-12">
      <div className="inline-flex bg-white shadow-lg rounded-full p-2">
        <button
          onClick={() => setActiveTab('new')}
          className={`px-8 py-3 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 ${
            activeTab === 'new'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          NEW ARRIVALS
        </button>
        <button
          onClick={() => setActiveTab('best')}
          className={`px-8 py-3 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 ${
            activeTab === 'best'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          BEST SELLERS
        </button>
      </div>
    </div>

    {/* Products Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {loading ? (
    // Loading state
    <div className="col-span-full text-center py-12">
      <p className="text-gray-600">Loading products...</p>
    </div>
  ) : (activeTab === 'new' ? newArrivals : bestSellers).length === 0 ? (
    // Empty state
    <div className="col-span-full text-center py-12">
      <p className="text-gray-600">No products available</p>
    </div>
  ) : (
    (activeTab === 'new' ? newArrivals : bestSellers).map((product) => (
      <div
        key={product._id}
        className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
        onClick={() => navigate(`/product/${product._id}`)}
      >
          {/* Sale Badge */}
          {product.salePercentage && (
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-full text-xs font-bold tracking-wide shadow-lg">
                SALE {product.salePercentage}%
              </span>
            </div>
          )}

          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <img
            src={product.img || 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=600&h=600&fit=crop'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Inside the Quick View Overlay div */}
<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
  <button 
    onClick={(e) => {
      e.stopPropagation();
      navigate(`/product/${product._id}`);
    }}
    className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors shadow-lg"
  >
    Quick View
  </button>
  
  {/* ADD THIS BUTTON */}
  <button 
    onClick={(e) => handleAddToWishlist(product, e)}
    className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
  >
    <Heart className="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors" />
  </button>
</div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          {/* Category Name */}
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {product.category?.name || 'Cosmic Virtue'}
          </p>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
            {product.name}
          </h3>

          {/* Rating - Static for now, add rating field to schema if needed */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-sm text-yellow-400">
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500">(New)</span>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              ₹{product.price}
            </span>
          </div>

          {/* Add to Cart Button */}
          {/* Add to Cart Button */}
<button 
  onClick={(e) => handleAddToCart(product, e)}
  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold text-sm tracking-wide hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl"
  style={{ fontFamily: "'Montserrat', sans-serif" }}
>
  ADD TO CART
</button>
        </div>
      </div>
    ))
  )}
</div>
    {/* View All Button */}
   {/* View All Button */}
<div className="flex justify-center mt-12">
  <button 
    onClick={() => navigate('/products')}
    className="group flex items-center gap-3 bg-white text-gray-900 px-10 py-4 rounded-full font-semibold text-base tracking-wide hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-lg hover:shadow-2xl border-2 border-gray-900"
  >
    <span style={{ fontFamily: "'Montserrat', sans-serif" }}>VIEW ALL PRODUCTS</span>
    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
  </button>
</div>
  </div>
</section>

{/* Why Choose Us Section */}
<section className="py-20 px-4 sm:px-6 lg:px-8 bg-transparent relative overflow-hidden">
  {/* Decorative Background Elements */}
  <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
  <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-100 rounded-full filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
  
  <div className="max-w-7xl mx-auto relative z-10">
    {/* Section Header */}
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
        Why Choose Us
      </h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        We're committed to bringing you the finest handcrafted products with exceptional quality and care
      </p>
    </div>

    {/* Features Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {/* Feature 1 */}
      <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-white to-purple-50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-purple-100">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Premium Quality
        </h3>
        <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Handcrafted with the finest natural ingredients and materials for superior quality
        </p>
      </div>

      {/* Feature 2 */}
      <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-white to-pink-50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-pink-100">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Eco-Friendly
        </h3>
        <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Sustainable practices with biodegradable packaging and natural ingredients
        </p>
      </div>

      {/* Feature 3 */}
      <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-white to-purple-50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-purple-100">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Best Value
        </h3>
        <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Competitive pricing with regular discounts and exclusive bundle offers
        </p>
      </div>

      {/* Feature 4 */}
      <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-white to-pink-50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-pink-100">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Fast Delivery
        </h3>
        <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Quick and secure shipping to your doorstep with real-time tracking
        </p>
      </div>
    </div>

    {/* Stats Section */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-b border-gray-200">
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          10K+
        </div>
        <p className="text-gray-600 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Happy Customers
        </p>
      </div>

      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          500+
        </div>
        <p className="text-gray-600 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Products
        </p>
      </div>

      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          100%
        </div>
        <p className="text-gray-600 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Natural
        </p>
      </div>

      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          5★
        </div>
        <p className="text-gray-600 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Rated
        </p>
      </div>
    </div>

    {/* Testimonial Highlight */}
    <div className="mt-16 max-w-4xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 shadow-xl">
      <div className="flex justify-center mb-6">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <blockquote className="text-xl md:text-2xl text-gray-800 mb-6 italic leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
        "The quality is absolutely outstanding! These candles have transformed my home into a relaxing sanctuary. Highly recommend!"
      </blockquote>
      <div>
        <p className="font-semibold text-gray-900 text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Sarah Johnson
        </p>
        <p className="text-gray-600 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Verified Customer
        </p>
      </div>
    </div>
  </div>
</section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Montserrat:wght@300;400;600;700&display=swap');
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
          opacity: 0;
        },
  body {
  background: linear-gradient(to right, #fce7f3, #faf5ff, #e0e7ff);
  min-height: 100vh;
  background-attachment: fixed;
}
      `}</style>
    </>
  );
};

export default HomePage;