import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Minus, Plus, Truck, Shield, RotateCcw, Sparkles, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false); // NEW: For loading state

  const API_BASE_URL = 'http://localhost:3000';

  // ============================================
  // CART UTILITY FUNCTIONS (INTEGRATED)
  // ============================================

  // Check if user is logged in
  const isUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  // Get user ID
  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id || user._id;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  };

  // Get user token
  const getUserToken = () => {
    return localStorage.getItem('token');
  };

  // Get cart from localStorage
  const getLocalCart = () => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return [];
    }
  };

  // Add to localStorage cart
  const addToLocalCart = (cartItem) => {
    try {
      let cart = getLocalCart();
      
      // Check if product already exists
      const existingItemIndex = cart.findIndex(item => item.productId === cartItem.productId);
      
      if (existingItemIndex > -1) {
        // Update quantity if exists
        cart[existingItemIndex].quantity += cartItem.quantity;
      } else {
        // Add new item
        cart.push(cartItem);
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      return cart;
    } catch (error) {
      console.error('Error adding to localStorage cart:', error);
      throw error;
    }
  };

  // Add to cart via API
  const addToCartAPI = async (productId, quantity) => {
  try {
    const token = getUserToken();

    if (!token) {  // ✅ Only check token
      throw new Error('User not authenticated');
    }

      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: productId,
          quantity: quantity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding to cart via API:', error);
      throw error;
    }
  };

  // Main Add to Cart Handler
  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);

      const cartItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: Array.isArray(product.img) ? product.img[0] : product.img,
        size: product.dimension ? `${product.dimension.height}cm` : 'Standard'
      };

      if (isUserLoggedIn()) {
        // USER IS LOGGED IN - Send to API
        await addToCartAPI(product._id, quantity);
        console.log('Added to cart (API)');
        alert('Product added to cart successfully!');
        window.dispatchEvent(new Event('cartUpdated'));
        
      } else {
        // USER IS NOT LOGGED IN - Use localStorage
        addToLocalCart(cartItem);
        console.log('Added to cart (localStorage)');
        alert('Product added to cart successfully!');
        window.dispatchEvent(new Event('cartUpdated'));
      }

      // Optional: Navigate to cart or open cart sidebar
      // navigate('/cart');

    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  // Buy Now Handler
  // Buy Now Handler - CORRECTED
const handleBuyNow = async () => {
  try {
    setAddingToCart(true);

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: Array.isArray(product.img) ? product.img[0] : product.img,
      size: product.dimension ? `${product.dimension.height}cm` : 'Standard'
    };

    if (isUserLoggedIn()) {
      await addToCartAPI(product._id, quantity);
      window.dispatchEvent(new Event('cartUpdated'));
    } else {
      addToLocalCart(cartItem);
      window.dispatchEvent(new Event('cartUpdated'));
    }

    // Navigate directly to checkout
    navigate('/checkout');

  } catch (error) {
    console.error('Error in buy now:', error);
    alert('Failed to process request. Please try again.');
  } finally {
    setAddingToCart(false);
  }
};
  // ============================================
  // EXISTING FETCH FUNCTIONS (NO CHANGES)
  // ============================================

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const data = await response.json();
        setProduct(data.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Fetch related products when product loads
  useEffect(() => {
    const fetchRelatedProducts = async (categoryId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        
        // Filter products from same category, exclude current product
        const related = data.data
          .filter(p => p.category?._id === categoryId && p._id !== id)
          .slice(0, 4)
          .map(p => ({
            id: p._id,
            name: p.name,
            price: p.price,
            image: p.img || 'https://images.unsplash.com/photo-602874801006-47c1c969a405?w=400&h=400&fit=crop',
            rating: 4.5
          }));
        
        setRelatedProducts(related);
      } catch (err) {
        console.error('Error fetching related products:', err);
      }
    };

    if (product?.category?._id) {
      fetchRelatedProducts(product.category._id);
    }
  }, [product, id]);

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Generate images array based on product.img
  const productImages = product?.img 
    ? (Array.isArray(product.img) ? product.img : [product.img])
    : [];

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Loading Product...
          </h2>
          <p className="text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Please wait while we fetch the details
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
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {error}
            </p>
            <button
              onClick={() => window.location.href = '/products'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No product data
  if (!product) {
    return null;
  }

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
  const token = getUserToken();
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

const handleAddToWishlist = async () => {
  try {
    const wishlistItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: Array.isArray(product.img) ? product.img[0] : product.img,
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
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 shadow-md">
          <button onClick={() => window.location.href = '/'} className="text-gray-500 hover:text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Home
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button onClick={() => window.location.href = '/products'} className="text-gray-500 hover:text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Products
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {product.category?.name || 'Product'}
          </span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={productImages[selectedImage] || 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=800&h=800&fit=crop'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=800&h=800&fit=crop';
                }}
              />
              {/* Replace existing Heart button */}
<button 
  onClick={handleAddToWishlist}
  className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all"
>
  <Heart className="w-6 h-6 text-gray-700 hover:text-red-500 transition-colors" />
</button>
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${
                      selectedImage === index
                        ? 'ring-4 ring-purple-600 shadow-lg scale-105'
                        : 'ring-2 ring-gray-200 hover:ring-purple-300'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`Product ${index + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=400&h=400&fit=crop';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl">
            {/* Brand & Title */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="text-purple-600 font-semibold text-sm tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  COSMIC VIRTUE
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-white text-white" />
                  <span className="text-white font-bold text-sm">4.5</span>
                </div>
                <span className="text-gray-600 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  (324 Reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  ₹{product.price}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Quantity
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange('decrease')}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-5 h-5 text-gray-700" />
                  </button>
                  <span className="px-6 py-3 font-bold text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange('increase')}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
                <span className="text-green-600 font-semibold flex items-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                  In Stock
                </span>
              </div>
            </div>

            {/* Action Buttons - UPDATED */}
            <div className="space-y-3 mb-8">
              <button 
                onClick={handleAddToCart}
                disabled={addingToCart}
                className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 flex items-center justify-center gap-3 ${
                  addingToCart ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      ADDING...
                    </span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      ADD TO CART
                    </span>
                  </>
                )}
              </button>
              <button 
                onClick={handleBuyNow}
                className="w-full bg-white border-2 border-gray-900 text-gray-900 py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 hover:bg-gray-900 hover:text-white flex items-center justify-center gap-3"
              >
                <span style={{ fontFamily: "'Montserrat', sans-serif" }}>BUY NOW</span>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-200">
              <div className="text-center">
                <Truck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Free Delivery
                </p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Easy Returns
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Secure Payment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Product Description
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {product.description}
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Scent Profile
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6 text-base" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {product.fragnance}
            </p>

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Ingredients
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.ingredients.map((ingredient, index) => (
                    <span 
                      key={index}
                      className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Key Features */}
            {product.keyFeatures && product.keyFeatures.length > 0 && (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Key Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                      <span className="text-gray-800 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Dimensions */}
            {product.dimension && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Dimensions
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Height:</span>
                    <span className="ml-2 font-semibold text-gray-900">{product.dimension.height} cm</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Weight:</span>
                    <span className="ml-2 font-semibold text-gray-900">{product.dimension.weight} g</span>
                  </div>
                </div>
              </div>
            )}

            {/* How to Use - from Category */}
            {product.category?.howtoUse && product.category.howtoUse.length > 0 && (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  How to Use
                </h3>
                <ol className="space-y-2">
                  {product.category.howtoUse.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>

          {/* Why Choose Section */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 md:p-8 shadow-xl border-2 border-purple-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Why Choose Us?
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Premium Quality
                  </h4>
                  <p className="text-sm text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Handcrafted with finest natural ingredients
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Eco-Friendly
                  </h4>
                  <p className="text-sm text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Sustainable & biodegradable packaging
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-white fill-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Certified Safe
                  </h4>
                  <p className="text-sm text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Tested for quality and safety standards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                You May Also Like
              </h2>
              <button 
                onClick={() => navigate('/products')}
                className="text-purple-500 font-semibold hover:text-purple-200 transition-colors flex items-center gap-2" 
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                View All
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => window.location.href = `/product/${item.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                >
                  <div className="relative aspect-square overflow-hidden group">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=400&h=400&fit=crop';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold text-gray-700">{item.rating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        ₹{item.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Montserrat:wght@300;400;600;700&display=swap');
      `}</style>
    </div>
  );
};

export default ProductDetail;