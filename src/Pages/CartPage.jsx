import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, Heart, Loader2, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [shippingCharge, setShippingCharge] = useState(50);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // ============================================
  // CART UTILITY FUNCTIONS
  // ============================================

  const isUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id || user._id;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  };

  const getUserToken = () => {
    return localStorage.getItem('token');
  };

  const getLocalCart = () => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return [];
    }
  };

  const updateLocalCart = (updatedCart) => {
    try {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error updating localStorage cart:', error);
    }
  };

  const fetchCartFromAPI = async () => {
    try {
      const token = getUserToken();
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch cart');

      const data = await response.json();

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

  const updateCartItemAPI = async (productId, quantity) => {
    try {
      const token = getUserToken();
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${API_BASE_URL}/cart/update/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: quantity })
      });

      if (!response.ok) throw new Error('Failed to update cart');
      return await response.json();
    } catch (error) {
      console.error('Error updating cart via API:', error);
      throw error;
    }
  };

  const removeFromCartAPI = async (productId) => {
    try {
      const token = getUserToken();
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) throw new Error('Failed to remove from cart');
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
            const apiCart = await fetchCartFromAPI();
            setCartItems(apiCart);
          } else {
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

  const updateQuantity = async (item, delta) => {
    try {
      setUpdating(true);
      const newQuantity = item.quantity + delta;

      if (newQuantity <= 0) {
        await removeItem(item);
        return;
      }

      if (isUserLoggedIn()) {
        await updateCartItemAPI(item.productId, newQuantity);
        const updatedCart = await fetchCartFromAPI();
        setCartItems(updatedCart);
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
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

  const removeItem = async (item) => {
    try {
      setUpdating(true);

      if (isUserLoggedIn()) {
        await removeFromCartAPI(item.productId);
        const updatedCart = await fetchCartFromAPI();
        setCartItems(updatedCart);
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
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
  const shipping = subtotal > 999 ? 0 : shippingCharge;
  const total = subtotal > 999 ? subtotal : subtotal;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shippingProgress = Math.min((subtotal / 999) * 100, 100);

  // ============================================
  // HANDLERS
  // ============================================
  const handleCheckout = () => {
    navigate('/checkout');
    onClose();
  };

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

      {/* ── CART SIDEBAR ── */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >

        {/* ── HEADER ── */}
        <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Your Cart
                </h2>
                <p className="text-purple-100 text-xs">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping progress — inside header */}
          {cartItems.length > 0 && (
            <div className="mt-4">
              {subtotal >= 999 ? (
                <p className="text-white text-xs font-semibold mb-1.5">🎉 You've unlocked FREE shipping!</p>
              ) : (
                <p className="text-purple-100 text-xs mb-1.5">
                  Add <span className="text-white font-bold">₹{999 - subtotal}</span> more for FREE shipping
                </p>
              )}
              <div className="w-full bg-white/20 rounded-full h-1.5">
                <div
                  className="bg-white h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── CART ITEMS ── */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50">

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
              <p className="text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>Loading your cart...</p>
            </div>
          )}

          {/* Empty */}
          {!loading && cartItems.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-5">
                <ShoppingCart className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Your cart is empty
              </h3>
              <p className="text-sm text-gray-500 mb-7 leading-relaxed" style={{ fontWeight: 300 }}>
                Add some cosmic candles to illuminate your space
              </p>
              <button
                onClick={handleContinueShopping}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-200"
              >
                Shop Now
              </button>
            </div>
          )}

          {/* Items list */}
          {!loading && cartItems.length > 0 && (
            <div className="p-4 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id || item.productId}
                  className="flex gap-3 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all duration-200"
                >
                  {/* Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1602874801006-47c1c969a405?w=200&h=200&fit=crop'}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover bg-gray-100"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1602874801006-47c1c969a405?w=200&h=200&fit=crop';
                      }}
                    />
                    {/* Wishlist button on image */}
                    <button className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-pink-50 transition-colors">
                      <Heart className="w-3.5 h-3.5 text-gray-400 hover:text-pink-500" />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {item.name}
                        </h3>
                        <p className="text-xs text-purple-500 font-medium mt-0.5">{item.size}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item)}
                        disabled={updating}
                        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors group disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-gray-300 group-hover:text-red-500 transition-colors" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Price */}
                      <span className="text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Qty controls */}
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item, -1)}
                          disabled={updating}
                          className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white hover:shadow-sm transition-all active:scale-90 disabled:opacity-40"
                        >
                          <Minus className="w-3 h-3 text-purple-600" />
                        </button>
                        <span className="w-7 text-center text-sm font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item, 1)}
                          disabled={updating}
                          className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white hover:shadow-sm transition-all active:scale-90 disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3 text-purple-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── FOOTER: Totals + Checkout ── */}
        {cartItems.length > 0 && !loading && (
          <div className="flex-shrink-0 bg-white border-t border-gray-100 px-5 pt-4 pb-6 space-y-4">

            {/* Coupon code */}
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Coupon code"
                  className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-400 bg-transparent"
                />
              </div>
              <button className="px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors">
                Apply
              </button>
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-medium text-gray-700">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
  <span>Shipping</span>
  <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-gray-700'}`}>
    {subtotal > 999 ? 'FREE' : 'Calculated at checkout'}
  </span>
</div>
              <div className="flex justify-between text-gray-400 text-xs">
                <span>Tax (GST)</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
  {subtotal > 999 ? `₹${subtotal.toFixed(2)}` : `₹${subtotal.toFixed(2)} + shipping`}
</span>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleCheckout}
              disabled={updating}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
            >
              Proceed to Checkout →
            </button>

            {/* Continue shopping */}
            <button
              onClick={onClose}
              className="w-full py-3 border-2 border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:border-purple-400 hover:text-purple-600 transition-all duration-200"
            >
              Continue Shopping
            </button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-5 pt-2 border-t border-gray-100">
              {[
                { emoji: '🔒', label: 'Secure Pay' },
                { emoji: '📦', label: 'Fast Delivery' },
                { emoji: '♻️', label: 'Easy Returns' },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <span className="text-base">{badge.emoji}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{badge.label}</span>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@300;400;600&display=swap');
      `}</style>
    </>
  );
};

export default CartSidebar;