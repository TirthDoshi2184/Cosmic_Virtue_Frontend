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

  // API Configuration - Update this with your backend URL
  const API_BASE_URL = 'http://localhost:3000';

  // Fetch products from backend
  useEffect(() => {
  const categoryFromUrl = searchParams.get('category');
  if (categoryFromUrl) {
    setSelectedCategory(categoryFromUrl);
  }
}, [searchParams]);

// Add this AFTER the existing useEffect that reads searchParams
useEffect(() => {
  fetchProducts();
}, [searchParams]); // Re-fetch when URL changes

  const fetchProducts = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await fetch(`${API_BASE_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    const transformedProducts = data.data.map(product => ({
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || null,
      discount: product.discount || null,
      description: product.description,
      image: product.img || 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=400&h=400&fit=crop',
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
    
    // FIXED - Properly deduplicate categories
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

  // Category filter - CHANGE THIS LINE
  if (selectedCategory !== 'all') {
    filtered = filtered.filter(p => p.category === selectedCategory); // Changed from .toLowerCase()
  }

    // Price filter
    if (selectedPriceRange !== 'all') {
      filtered = filtered.filter(p => {
        const price = p.price;
        if (selectedPriceRange === '0-300') return price < 300;
        if (selectedPriceRange === '300-500') return price >= 300 && price <= 500;
        if (selectedPriceRange === '500+') return price > 500;
        return true;
      });
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.fragrance && p.fragrance.toLowerCase().includes(query))
      );
    }

    // Sort
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
        // Keep original order or prioritize trending
        filtered.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  // Calculate stats
  const maxDiscount = products.reduce((max, p) => Math.max(max, p.discount || 0), 0);
  const topRating = products.reduce((max, p) => Math.max(max, p.rating || 0), 0);

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

  const getSelectedCategoryName = () => {
  if (selectedCategory === 'all') return 'All';
  const category = categories.find(cat => cat.id === selectedCategory);
  return category?.name || 'Unknown Category';
};

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
  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Banner Section */}
      <div className="relative bg-gradient-to-r from-purple-900/90 to-pink-900/90 py-16 px-4 sm:px-6 lg:px-8 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1920&h=400&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            <span className="text-yellow-300 font-semibold tracking-widest text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              NEW COLLECTION
            </span>
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Discover Your Perfect Scent
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Handcrafted candles and bath essentials made with love and natural ingredients
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for candles, scents, or collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-4 pl-14 pr-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-2xl text-base"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Quick Stats/Features Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                {products.length}+
              </div>
              <p className="text-gray-600 text-xs font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>Products</p>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                {maxDiscount}%
              </div>
              <p className="text-gray-600 text-xs font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>Max Discount</p>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                {topRating}★
              </div>
              <p className="text-gray-600 text-xs font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>Top Rated</p>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Free
              </div>
              <p className="text-gray-600 text-xs font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>Shipping</p>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters & Sort
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filters - Mobile Overlay */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowFilters(false)} />
            )}
            
            <aside className={`${
              showFilters ? 'fixed inset-y-0 left-0 z-50 w-80 transform translate-x-0' : 'hidden'
            } lg:block lg:relative lg:w-72 flex-shrink-0 transition-transform duration-300`}>
              <div className="bg-white rounded-2xl shadow-xl p-6 lg:sticky lg:top-24 h-full lg:h-auto overflow-y-auto">
                {/* Mobile Header */}
                <div className="lg:hidden flex justify-between items-center mb-6 pb-4 border-b">
                  <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Filters
                  </h3>
                  <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                    Category
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer group p-2 rounded-lg hover:bg-purple-50 transition-colors">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === 'all'}
                        onChange={() => setSelectedCategory('all')}
                        className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-3 text-gray-700 group-hover:text-purple-700 transition-colors capitalize font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        All Products
                      </span>
                    </label>
                    {categories.map((cat) => (
  <label key={cat.id} className="flex items-center cursor-pointer group p-2 rounded-lg hover:bg-purple-50 transition-colors">
    <input
      type="radio"
      name="category"
      checked={selectedCategory === cat.id}
      onChange={() => setSelectedCategory(cat.id)}
      className="w-5 h-5 text-purple-600 focus:ring-purple-500"
    />
    <span className="ml-3 text-gray-700 group-hover:text-purple-700 transition-colors capitalize font-medium">
      {cat.name}
    </span>
  </label>
))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                    Price Range
                  </h3>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All Prices' },
                      { value: '0-300', label: 'Under ₹300' },
                      { value: '300-500', label: '₹300 - ₹500' },
                      { value: '500+', label: 'Above ₹500' }
                    ].map((range) => (
                      <label key={range.value} className="flex items-center cursor-pointer group p-2 rounded-lg hover:bg-purple-50 transition-colors">
                        <input
                          type="radio"
                          name="price"
                          checked={selectedPriceRange === range.value}
                          onChange={() => setSelectedPriceRange(range.value)}
                          className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-3 text-gray-700 group-hover:text-purple-700 transition-colors font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                    Sort By
                  </h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* Special Offers Banner */}
                <div className="mt-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-4 border-2 border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h4 className="font-bold text-purple-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Special Offer
                    </h4>
                  </div>
                  <p className="text-sm text-purple-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Get free shipping on orders above ₹999
                  </p>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Products Count & View Toggle */}
              <div className="flex justify-between items-center mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md">
  <div>
    <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
      {getSelectedCategoryName()} Products
    </h2>
    <p className="text-sm text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {filteredProducts.length} items found
    </p>
  </div>
</div>

              {/* No Results Message */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      No Products Found
                    </h3>
                    <p className="text-gray-600 mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Try adjusting your filters or search query
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedPriceRange('all');
                        setSearchQuery('');
                      }}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}

              {/* Products Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => window.location.href = `/product/${product.id}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-neutral-100 group">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=400&h=400&fit=crop';
                        }}
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
                        {product.discount && (
                          <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                            {product.discount}% OFF
                          </span>
                        )}
                        {product.trending && (
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Trending
                          </span>
                        )}
                      </div>

                      {/* Out of Stock Overlay */}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="bg-white text-gray-900 px-3 py-1.5 rounded-full font-bold text-xs">
                            OUT OF STOCK
                          </span>
                        </div>
                      )}

                      {/* Wishlist Button */}
                      {/* Wishlist Button - REPLACE existing button */}
<button 
  onClick={(e) => {
    e.stopPropagation();
    handleAddToWishlist(product, e);
  }}
  className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
>
  <Heart className="w-4 h-4 text-gray-700 hover:text-red-500 transition-colors" />
</button>
                    </div>

                    {/* Product Info */}
                    <div className="p-3 md:p-4">
                      {/* Product Name */}
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1 md:mb-2 line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {product.name}
                      </h3>

                      {/* Description - Hidden on mobile */}
                      <p className="hidden md:block text-xs text-gray-600 mb-2 line-clamp-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {product.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs md:text-sm font-semibold text-gray-700">{product.rating}</span>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="text-lg md:text-xl font-bold text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          ₹{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs md:text-sm text-gray-400 line-through" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button 
  disabled={!product.inStock}
  onClick={(e) => handleAddToCart(product, e)}
  className={`w-full py-2 md:py-3 rounded-xl font-semibold text-xs md:text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 ${
    product.inStock
      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 shadow-md hover:shadow-xl'
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
  }`}
  style={{ fontFamily: "'Montserrat', sans-serif" }}
>
  <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
  <span className="hidden md:inline">{product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}</span>
  <span className="md:hidden">{product.inStock ? 'ADD' : 'OUT'}</span>
</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {filteredProducts.length > 0 && (
                <div className="flex justify-center mt-12">
                  <button 
                    onClick={fetchProducts}
                    className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-full font-semibold text-base tracking-wide hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center gap-3"
                  >
                    <span style={{ fontFamily: "'Montserrat', sans-serif" }}>REFRESH PRODUCTS</span>
                    <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Montserrat:wght@300;400;600;700&display=swap');
      `}</style>
    </div>
  );
};

export default ProductPage;