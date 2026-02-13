import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Package, Loader2, AlertCircle } from 'lucide-react';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
    fetchWishlist();
    
    // Listen for wishlist updates
    window.addEventListener('wishlistUpdated', fetchWishlist);
    return () => window.removeEventListener('wishlistUpdated', fetchWishlist);
  }, []);

  const isUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isUserLoggedIn()) {
        // Fetch from API
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/wishlist`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch wishlist');
        }

        const data = await response.json();
        setWishlistItems(data.data || []);
      } else {
        // Fetch from localStorage
        const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlistItems(localWishlist);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      if (isUserLoggedIn()) {
        // Remove from API
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/wishlist/remove/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to remove from wishlist');
        }
      } else {
        // Remove from localStorage
        const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const updatedWishlist = localWishlist.filter(item => item.productId !== productId);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      }

      // Update UI
      setWishlistItems(prev => prev.filter(item => 
        (item.productId || item.product?._id || item._id) !== productId
      ));
      
      window.dispatchEvent(new Event('wishlistUpdated'));
      
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert('Failed to remove item from wishlist');
    }
  };

  const addToCart = async (product) => {
  try {
    const productId = product.productId || product.product?._id || product._id;
    const productData = product.product || product;

    const cartItem = {
      productId: productId,
      name: productData.name,
      price: productData.price,
      quantity: 1,
      image: productData.img || productData.image,
      size: productData.dimension ? `${productData.dimension.height}cm` : 'Standard'
    };

    if (isUserLoggedIn()) {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
    } else {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = existingCart.findIndex(item => item.productId === productId);

      if (existingItemIndex > -1) {
        existingCart[existingItemIndex].quantity += 1;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));
    }

    alert('Product added to cart successfully!');
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Dispatch event to open cart sidebar
    window.dispatchEvent(new CustomEvent('openCartSidebar'));

  } catch (err) {
    console.error('Error adding to cart:', err);
    alert('Failed to add to cart');
  }
};

const moveToCart = async (product) => {
  const productId = product.productId || product.product?._id || product._id;
  await addToCart(product);
  await removeFromWishlist(productId);
  
  // Dispatch event to open cart sidebar
  window.dispatchEvent(new CustomEvent('openCartSidebar'));
};
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Loading Wishlist...
          </h2>
          <p className="text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Please wait while we fetch your favorite items
          </p>
        </div>
      </div>
    );
  }

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
              onClick={fetchWishlist}
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-10 h-10 text-red-500 fill-red-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              My Wishlist
            </h1>
          </div>
          <p className="text-gray-600 text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Your Wishlist is Empty
              </h3>
              <p className="text-gray-600 mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Save your favorite items here and add them to cart later
              </p>
              <button
                onClick={() => navigate('/products')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {wishlistItems.map((item) => {
                const product = item.product || item;
                const productId = item.productId || product._id;
                
                return (
                  <div
                    key={productId}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                  >
                    {/* Product Image */}
                    <div 
                      className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
                      onClick={() => navigate(`/product/${productId}`)}
                    >
                      <img
                        src={product.img || product.image || 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=400&h=400&fit=crop'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=400&h=400&fit=crop';
                        }}
                      />

                      {/* Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWishlist(productId);
                        }}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-red-50 transition-all group/btn"
                      >
                        <Heart className="w-5 h-5 text-red-500 fill-red-500 group-hover/btn:scale-110 transition-transform" />
                      </button>

                      {/* Out of Stock Overlay */}
                      {product.inStock === false && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-sm">
                            OUT OF STOCK
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      {/* Category */}
                      {product.category && (
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {product.category.name || product.category}
                        </p>
                      )}

                      {/* Product Name */}
                      <h3 
                        className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-purple-700 transition-colors"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                        onClick={() => navigate(`/product/${productId}`)}
                      >
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          ₹{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveToCart(item)}
                          disabled={product.inStock === false}
                          className={`flex-1 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                            product.inStock !== false
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 shadow-md'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Move to Cart
                        </button>

                        <button
                          onClick={() => removeFromWishlist(productId)}
                          className="px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
              <button
                onClick={() => navigate('/products')}
                className="px-8 py-4 rounded-xl border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-all shadow-lg"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Continue Shopping
              </button>

              <button
  onClick={async () => {
    for (const item of wishlistItems) {
      const product = item.product || item;
      if (product.inStock !== false) {
        await addToCart(item);
      }
    }
    // Clear wishlist after moving all to cart
    if (isUserLoggedIn()) {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/wishlist/clear`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } else {
      localStorage.removeItem('wishlist');
    }
    setWishlistItems([]);
    window.dispatchEvent(new Event('wishlistUpdated'));
    window.dispatchEvent(new CustomEvent('openCartSidebar')); // Changed this line
  }}
  className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg transform hover:scale-105"
  style={{ fontFamily: "'Montserrat', sans-serif" }}
>
  Add All to Cart
</button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Montserrat:wght@300;400;600;700&display=swap');
      `}</style>
    </div>
  );
};

export default WishlistPage;