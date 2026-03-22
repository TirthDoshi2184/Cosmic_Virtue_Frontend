import React, { useState, useEffect } from 'react';
import { ChevronDown, SlidersHorizontal, X, Heart, ShoppingCart, Search, Star, TrendingUp, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const ProductPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();

  // Backend integration state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
const PRODUCTS_PER_PAGE = 10;

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  
useEffect(() => {
  setCurrentPage(1);
}, [selectedCategory, selectedPriceRange, sortBy, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/products?limit=100`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('.....',data.data);
      console.log('categories', data.data.category);

      const transformedProducts = data.data.map(product => ({
        id: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || null,
        discount: product.discount || null,
        description: product.description,
        image: Array.isArray(product.img) ? product.img[0] : (product.img || 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=400&h=400&fit=crop'),
         category: product.category?._id || product.category || 'general',
        categoryName: product.category?.name || 'General',
        rating: product.rating || 4.5,
        inStock: product.inStock !== undefined ? product.inStock : true,
        trending: product.trending || false,
        fragrance: product.fragnance,
        ingredients: product.ingredients,
        dimension: product.dimension,
        keyFeatures: product.keyFeatures
      }));

      setProducts(transformedProducts);

      const categoryMap = new Map();
      transformedProducts.forEach(p => {
        if (p.category && !categoryMap.has(p.category)) {
          categoryMap.set(p.category, { id: p.category, name: p.categoryName });
        }
      });
      const uniqueCategories = Array.from(categoryMap.values());
      setCategories(uniqueCategories);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProducts = () => {
    let filtered = [...products];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => 
  p.categoryName?.toLowerCase() === selectedCategory?.toLowerCase()
);
    }

    if (selectedPriceRange !== 'all') {
      filtered = filtered.filter(p => {
        const price = p.price;
        if (selectedPriceRange === '0-300') return price < 300;
        if (selectedPriceRange === '300-500') return price >= 300 && price <= 500;
        if (selectedPriceRange === '500+') return price > 500;
        return true;
      });
    }

if (searchQuery.trim()) {
  const query = searchQuery.toLowerCase();
  filtered = filtered.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query) ||
    (p.fragrance && p.fragrance.toLowerCase().includes(query))
  );
}
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
const paginatedProducts = filteredProducts.slice(
  (currentPage - 1) * PRODUCTS_PER_PAGE,
  currentPage * PRODUCTS_PER_PAGE
);

  const maxDiscount = products.reduce((max, p) => Math.max(max, p.discount || 0), 0);
  const topRating = products.reduce((max, p) => Math.max(max, p.rating || 0), 0);

  const getSelectedCategoryName = () => {
    if (selectedCategory === 'all') return 'Discover Your Perfect Scent';
    const category = categories.find(cat => cat.id === selectedCategory);
    return category?.name || 'Products';
  };

  // Cart Helper Functions
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
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        size: product.dimension ? `${product.dimension.height}cm` : 'Standard'
      };
      if (isUserLoggedIn()) {
        await addToCartAPI(product.id, 1);
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
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ productId })
    });
    if (!response.ok) throw new Error('Failed to add to wishlist');
    return response.json();
  };

  const handleAddToWishlist = async (product, e) => {
    e.stopPropagation();
    try {
      const wishlistItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      };
      if (isUserLoggedIn()) {
        await addToWishlistAPI(product.id);
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

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Loading Products...
          </h2>
          <p className="text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Please wait while we fetch the latest items
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {error}
            </p>
            <button
              onClick={fetchProducts}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Montserrat:wght@300;400;600;700&display=swap');

        /* Category tab underline animation */
        .cat-tab {
          white-space: nowrap;
          position: relative;
          transition: color 0.2s ease;
        }
        .cat-tab::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%; right: 50%;
          height: 2px;
          background: linear-gradient(to right, #9333ea, #ec4899);
          transition: left 0.25s ease, right 0.25s ease;
        }
        .cat-tab.active { color: #9333ea; font-weight: 600; }
        .cat-tab.active::after { left: 0; right: 0; }
        .cat-tab:not(.active) { color: #6b7280; }
        .cat-tab:not(.active):hover { color: #9333ea; }
        .cat-tab:not(.active):hover::after { left: 0; right: 0; }

        /* Hide scrollbar on category strip */
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        /* Product card */
        .product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(147,51,234,0.13);
        }
        .product-card .prod-img { transition: transform 0.6s ease; }
        .product-card:hover .prod-img { transform: scale(1.07); }

        /* Quick add bar slides up on hover */
        .quick-add {
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .product-card:hover .quick-add {
          opacity: 1;
          transform: translateY(0);
        }

        /* Wishlist btn appears on hover */
        .wishlist-btn { opacity: 0; transition: opacity 0.2s ease; }
        .product-card:hover .wishlist-btn { opacity: 1; }

        /* Filter drawer slide-in from right */
        .filter-overlay { animation: fdFadeIn 0.2s ease; }
        .filter-drawer  { animation: fdSlide 0.28s ease; }
        @keyframes fdFadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes fdSlide  { from { transform:translateX(100%); } to { transform:translateX(0); } }
      `}</style>

      {/* ── PAGE HEADER / HERO ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/90 to-pink-900/90 py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1920&h=400&fit=crop')] bg-cover bg-center opacity-20 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            <span className="text-yellow-300 text-xs font-semibold tracking-widest uppercase">NEW COLLECTION</span>
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            {getSelectedCategoryName()}
          </h1>
          <p className="text-white/80 text-sm md:text-base mb-7 max-w-xl" style={{ fontWeight: 300 }}>
            Handcrafted candles and bath essentials made with love and natural ingredients
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg">
            <input
              type="text"
              placeholder="Search for candles, scents, or collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/95 backdrop-blur rounded-full py-3.5 pl-12 pr-5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-xl"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 grid grid-cols-3  divide-x divide-gray-100">
          {[
            { value: `${products.length}+`, label: 'Products' },
            { value: `${maxDiscount}%`, label: 'Max Discount' },
            { value: `${topRating}★`, label: 'Top Rated' },
            
          ].map((stat, i) => (
            <div key={i} className="py-3 px-3 text-center">
              <div className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif" }}>
                {stat.value}
              </div>
              <p className="text-gray-400 text-[10px] font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── STICKY CATEGORY TABS + SORT/FILTER ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">

          {/* Scrollable category tabs */}
          <div className="cat-scroll flex items-stretch gap-0 overflow-x-auto flex-1 border-b-0 pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`cat-tab px-4 py-4 text-sm ${selectedCategory === 'all' ? 'active' : ''}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`cat-tab px-4 py-4 text-sm ${selectedCategory === cat.name ? 'active' : ''}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort dropdown — desktop */}
          <div className="relative hidden sm:block flex-shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none border border-gray-200 rounded-lg text-gray-600 text-xs pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="rating">Best Rated</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter button */}
          <button
            onClick={() => setShowFilters(true)}
            className="flex-shrink-0 flex items-center gap-1.5 border border-gray-200 rounded-lg bg-white text-gray-600 text-xs px-3 py-2 hover:border-purple-500 hover:text-purple-600 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>

          <span className="hidden md:block text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
            {filteredProducts.length} items
          </span>
        </div>
      </div>

      {/* ── FILTER DRAWER (slides from right) ── */}
      {showFilters && (
        <>
          <div className="filter-overlay fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilters(false)} />
          <div className="filter-drawer fixed right-0 top-0 h-full w-full max-w-xs bg-white z-50 overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Filter & Sort
              </h3>
              <button onClick={() => setShowFilters(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-7">
              {/* Sort — mobile only */}
              <div className="sm:hidden">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-3">Sort By</p>
                {[
                  { value: 'featured', label: 'Featured' },
                  { value: 'price-low', label: 'Price: Low → High' },
                  { value: 'price-high', label: 'Price: High → Low' },
                  { value: 'rating', label: 'Best Rated' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`flex justify-between items-center w-full py-3 border-b border-gray-50 text-sm transition-colors ${sortBy === opt.value ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}
                  >
                    {opt.label}
                    {sortBy === opt.value && <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />}
                  </button>
                ))}
              </div>


              {/* Price Range */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-3">Price Range</p>
                {[
                  { value: 'all', label: 'All Prices' },
                  { value: '0-300', label: 'Under ₹300' },
                  { value: '300-500', label: '₹300 – ₹500' },
                  { value: '500+', label: 'Above ₹500' },
                ].map(range => (
                  <button
                    key={range.value}
                    onClick={() => setSelectedPriceRange(range.value)}
                    className={`flex justify-between items-center w-full py-3 border-b border-gray-50 text-sm transition-colors ${selectedPriceRange === range.value ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}
                  >
                    {range.label}
                    {selectedPriceRange === range.value && <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />}
                  </button>
                ))}
              </div>

              {/* Special offer banner */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-bold text-purple-900" style={{ fontFamily: "'Playfair Display', serif" }}>Special Offer</span>
                </div>
                <p className="text-xs text-purple-700">Free shipping on orders above ₹999</p>
              </div>

              {/* Clear / Apply */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setSelectedCategory('all'); setSelectedPriceRange('all'); setSortBy('featured'); }}
                  className="flex-1 border border-gray-300 text-gray-600 text-xs uppercase tracking-wider py-3 rounded-xl font-semibold hover:border-purple-400 hover:text-purple-600 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs uppercase tracking-wider py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── PRODUCTS GRID ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Mobile count */}
        <p className="text-sm text-gray-400 mb-5 md:hidden">{filteredProducts.length} items found</p>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-lg p-10 max-w-sm mx-auto">
              <Search className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                No Products Found
              </h3>
              <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search query</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSelectedPriceRange('all'); setSearchQuery(''); }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* 2 col mobile → 3 col tablet → 4 col desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => window.location.href = `/product/${product.id}`}
              className="product-card bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer"
            >
              {/* ── IMAGE ── */}
              <div className="relative overflow-hidden bg-white rounded-t-2xl" style={{ aspectRatio: '1/1', maxHeight: '300px' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="prod-img w-full h-full object-contain object-center"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=400&h=400&fit=crop'; }}
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                  {product.discount && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow">
                      -{product.discount}%
                    </span>
                  )}
                  {product.trending && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Hot
                    </span>
                  )}
                </div>

                {/* Out of stock */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Out of Stock
                    </span>
                  </div>
                )}

                {/* Wishlist (appears on hover) */}
                <button
                  onClick={(e) => handleAddToWishlist(product, e)}
                  className="wishlist-btn absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-all"
                >
                  <Heart className="w-3.5 h-3.5 text-gray-600 hover:text-red-500 transition-colors" />
                </button>

                {/* Quick Add bar (slides up on hover, desktop) */}
                {product.inStock && (
                  <div className="quick-add absolute bottom-0 left-0 right-0 hidden sm:block">
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs uppercase tracking-widest py-2.5 font-semibold flex items-center justify-center gap-1.5 hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                      <ShoppingCart className="w-3 h-3" /> Add to Cart
                    </button>
                  </div>
                )}
              </div>

              {/* ── PRODUCT INFO ── */}
              <div className="p-3 sm:p-4">
                {/* Category label */}
                <p className="text-xs text-purple-500 uppercase tracking-wider mb-1 font-semibold">{product.categoryName}</p>

                {/* Name */}
                <h3
                  className="text-base sm:text-base font-semibold text-gray-900 mb-1.5 line-clamp-2 leading-snug"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {product.name}
                </h3>

                {/* Description - hidden on mobile */}
                <p className="hidden sm:block text-xs text-gray-500 mb-2 line-clamp-2 leading-relaxed capitalize" style={{ fontWeight: 300 }}>
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3 h-3 sm:w-3 sm:h-3 ${s <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{product.rating}</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-lg sm:text-lg font-bold text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                  )}
                </div>

                {/* Add to cart — always visible on mobile */}
                <button
                  disabled={!product.inStock}
                  onClick={(e) => handleAddToCart(product, e)}
                  className={`sm:hidden w-full py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all ${
                    product.inStock
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-14 flex-wrap">
    <button
      onClick={() => { setCurrentPage(p => Math.max(p - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      disabled={currentPage === 1}
      className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-purple-500 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
    >
      ← Prev
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter(page => 
        page === 1 || 
        page === totalPages || 
        (page >= currentPage - 1 && page <= currentPage + 1)
      )
      .reduce((acc, page, idx, arr) => {
        if (idx > 0 && page - arr[idx - 1] > 1) acc.push('...');
        acc.push(page);
        return acc;
      }, [])
      .map((page, idx) => 
        page === '...' ? (
          <span key={`dots-${idx}`} className="text-gray-400 text-sm px-1">...</span>
        ) : (
          <button
            key={page}
            onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
              currentPage === page
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'border border-gray-200 text-gray-600 hover:border-purple-500 hover:text-purple-600'
            }`}
          >
            {page}
          </button>
        )
      )}

    <button
      onClick={() => { setCurrentPage(p => Math.min(p + 1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      disabled={currentPage === totalPages}
      className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-purple-500 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
    >
      Next →
    </button>
  </div>
)}
      </div>
    </div>
  );
};

export default ProductPage;