import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, Heart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const API_BASE_URL = 'http://localhost:3000';

  // ============================================
  // CART UTILITY FUNCTIONS
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

  // Update localStorage cart
  const updateLocalCart = (updatedCart) => {
    try {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error updating localStorage cart:', error);
    }
  };

  // Fetch cart from API
  const fetchCartFromAPI = async () => {
    try {
      const token = getUserToken();
      

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      
      // Transform API response to match our cart item structure
      const transformedCart = data.cart?.items?.map(item => ({
        id: item._id,
        productId: item.productId?._id || item.productId,
        name: item.productId?.name || item.name,
        price: item.productId?.price || item.price,
        quantity: item.quantity,
        image: Array.isArray(item.productId?.img) 
          ? item.productId.img[0] 
          : item.productId?.img || item.image,
        size: item.size || 'Standard'
      })) || [];

      return transformedCart;
    } catch (error) {
      console.error('Error fetching cart from API:', error);
      return [];
    }
  };

  // Update cart item quantity via API
  const updateCartItemAPI = async (productId, quantity) => {
    try {
      const token = getUserToken();
      
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/cart/update/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quantity: quantity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating cart via API:', error);
      throw error;
    }
  };

  // Remove item from cart via API
  const removeFromCartAPI = async (productId) => {
    try {
      const token = getUserToken();
      
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove from cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Error removing from cart via API:', error);
      throw error;
    }
  };

  // ============================================
  // LOAD CART ON SIDEBAR OPEN
  // ============================================
  useEffect(() => {
    const loadCart = async () => {
      if (isOpen) {
        setLoading(true);
        try {
          if (isUserLoggedIn()) {
            // Load from API
            const apiCart = await fetchCartFromAPI();
            setCartItems(apiCart);
          } else {
            // Load from localStorage
            const localCart = getLocalCart();
            setCartItems(localCart);
          }
        } catch (error) {
          console.error('Error loading cart:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadCart();
  }, [isOpen]);

  // ============================================
  // CART OPERATIONS
  // ============================================

  // Update quantity
  const updateQuantity = async (item, delta) => {
    try {
      setUpdating(true);
      const newQuantity = item.quantity + delta;

      if (newQuantity <= 0) {
        // Remove item if quantity becomes 0
        await removeItem(item);
        return;
      }

      if (isUserLoggedIn()) {
        // Update via API
        await updateCartItemAPI(item.productId, newQuantity);
        // Reload cart from API
        const updatedCart = await fetchCartFromAPI();
        setCartItems(updatedCart);
      window.dispatchEvent(new Event('cartUpdated'));
      } else {
        // Update localStorage
        const updatedCart = cartItems.map(cartItem =>
          cartItem.productId === item.productId
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );
        setCartItems(updatedCart);
        updateLocalCart(updatedCart);
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Remove item
  const removeItem = async (item) => {
    try {
      setUpdating(true);

      if (isUserLoggedIn()) {
        // Remove via API
        await removeFromCartAPI(item.productId);
        // Reload cart from API
        const updatedCart = await fetchCartFromAPI();
        setCartItems(updatedCart);
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        // Remove from localStorage
        const updatedCart = cartItems.filter(
          cartItem => cartItem.productId !== item.productId
        );
        setCartItems(updatedCart);
        updateLocalCart(updatedCart);
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // ============================================
  // CALCULATIONS
  // ============================================
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 999 ? 0 : 50;
  const total = subtotal + shipping;

  // ============================================
  // CHECKOUT HANDLER
  // ============================================
  const handleCheckout = () => {
    navigate('/checkout');
    onClose();
  };

  // ============================================
  // CONTINUE SHOPPING HANDLER
  // ============================================
  const handleContinueShopping = () => {
    navigate('/products');
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Your Cart
                </h2>
                <p className="text-xs text-gray-600">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/80 transition-all duration-200 group"
            >
              <X className="w-6 h-6 text-gray-600 group-hover:text-purple-600" />
            </button>
          </div>

          {/* Free Shipping Banner */}
          {subtotal < 999 && cartItems.length > 0 && (
            <div className="px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 border-b border-purple-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-700 font-medium">
                  Add ₹{999 - subtotal} more for FREE shipping! 🎉
                </span>
              </div>
              <div className="mt-2 w-full bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                <p className="text-gray-600">Loading cart...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
                  <ShoppingCart className="w-16 h-16 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 text-sm mb-6">Add some cosmic candles to illuminate your space</p>
                <button 
                  onClick={handleContinueShopping}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id || item.productId}
                  className="flex gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-200 transition-all duration-200"
                >
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1602874801006-47c1c969a405?w=200&h=200&fit=crop'}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1602874801006-47c1c969a405?w=200&h=200&fit=crop';
                      }}
                    />
                    <button className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-pink-50 transition-colors">
                      <Heart className="w-4 h-4 text-gray-400 hover:text-pink-500" />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">{item.size}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item)}
                        disabled={updating}
                        className="p-1 rounded-full hover:bg-red-50 transition-colors group"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ₹{item.price}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item, -1)}
                          disabled={updating}
                          className="p-1.5 rounded-md hover:bg-white transition-all duration-200 active:scale-95 disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4 text-purple-600" />
                        </button>
                        <span className="text-sm font-semibold text-gray-800 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item, 1)}
                          disabled={updating}
                          className="p-1.5 rounded-md hover:bg-white transition-all duration-200 active:scale-95 disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4 text-purple-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Totals and Checkout */}
          {cartItems.length > 0 && !loading && (
            <div className="border-t border-gray-200 p-6 space-y-4 bg-white">
              {/* Coupon Code */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-sm"
                />
                <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm">
                  Apply
                </button>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      `₹${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (GST)</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ₹{total.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={handleCheckout}
                disabled={updating}
                className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 active:scale-98 disabled:opacity-50"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <button
                onClick={onClose}
                className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-purple-500 hover:text-purple-600 transition-all duration-200"
              >
                Continue Shopping
              </button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-500">🔒 Secure Payment</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">📦 Fast Delivery</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">♻️ Easy Returns</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;