import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Minus, Plus, Truck, Shield, RotateCcw, Sparkles, ChevronRight, AlertCircle, Loader2, ChevronDown, ChevronUp, Leaf, Award, Package } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('description');

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // ============================================
  // CART UTILITY FUNCTIONS (INTEGRATED)
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

  const addToLocalCart = (cartItem) => {
    try {
      let cart = getLocalCart();
      const existingItemIndex = cart.findIndex(item => item.productId === cartItem.productId);
      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += cartItem.quantity;
      } else {
        cart.push(cartItem);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      return cart;
    } catch (error) {
      console.error('Error adding to localStorage cart:', error);
      throw error;
    }
  };

  const addToCartAPI = async (productId, quantity) => {
    try {
      const token = getUserToken();
      if (!token) {
        throw new Error('User not authenticated');
      }
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: productId, quantity: quantity })
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
        await addToCartAPI(product._id, quantity);
        console.log('Added to cart (API)');
        alert('Product added to cart successfully!');
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        addToLocalCart(cartItem);
        console.log('Added to cart (localStorage)');
        alert('Product added to cart successfully!');
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

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
      navigate('/checkout');
    } catch (error) {
      console.error('Error in buy now:', error);
      alert('Failed to process request. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  // ============================================
  // FETCH FUNCTIONS
  // ============================================

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

  useEffect(() => {
    const fetchRelatedProducts = async (categoryId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        const related = data.data
          .filter(p => p.category?._id === categoryId && p._id !== id)
          .slice(0, 4)
          .map(p => ({
            id: p._id,
            name: p.name,
            price: p.price,
            image: p.img || 'https://images.unsplash.com/photo-1602874801006-47c1c969a405?w=400&h=400&fit=crop',
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

  const productImages = product?.img
    ? (Array.isArray(product.img) ? product.img : [product.img])
    : [];

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
      setWishlistAdded(true);
      alert('Product added to wishlist!');
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add to wishlist. Please try again.');
    }
  };

  const toggleAccordion = (key) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Loading Product...
          </h2>
          <p className="text-gray-500 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
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
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Product Not Found
          </h2>
          <p className="text-gray-500 mb-6 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>{error}</p>
          <button
            onClick={() => window.location.href = '/products'}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:from-purple-700 hover:to-pink-700 transition-all"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Montserrat:wght@300;400;600;700&display=swap');

        /* Thumbnail scrollbar */
        .thumb-scroll::-webkit-scrollbar { height: 3px; width: 3px; }
        .thumb-scroll::-webkit-scrollbar-track { background: #f3e8ff; }
        .thumb-scroll::-webkit-scrollbar-thumb { background: #c084fc; border-radius: 10px; }

        /* Accordion */
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease;
        }
        .accordion-content.open { max-height: 900px; }

        /* Fade up animation */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease forwards; }

        /* Related card hover */
        .related-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .related-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(147,51,234,0.13); }
        .related-card img { transition: transform 0.6s ease; }
        .related-card:hover img { transform: scale(1.07); }

        /* Trust badge hover */
        .trust-icon { transition: transform 0.2s; }
        .trust-icon:hover { transform: translateY(-3px); }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 uppercase tracking-widest">
          <button onClick={() => window.location.href = '/'} className="hover:text-purple-600 transition-colors">Home</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => window.location.href = '/products'} className="hover:text-purple-600 transition-colors">Products</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-purple-600 font-semibold">{product.category?.name || 'Product'}</span>
        </nav>

        {/* ── MAIN PRODUCT SECTION ── */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-14 fade-up">

          {/* ── IMAGE GALLERY ── */}
          <div className="lg:w-[55%] flex flex-col-reverse sm:flex-row gap-3">

            {/* Thumbnail Strip */}
            {productImages.length > 1 && (
              <div className="flex sm:flex-col flex-row gap-2 sm:w-[72px] w-full sm:max-h-[560px] overflow-auto thumb-scroll">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 sm:w-[68px] sm:h-[68px] w-[60px] h-[60px] overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? 'border-purple-500 shadow-md shadow-purple-200'
                        : 'border-transparent hover:border-purple-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=200&h=200&fit=crop'; }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="relative flex-1 bg-white rounded-2xl overflow-hidden shadow-xl" style={{ aspectRatio: '1/1',maxHeight: '560px'  }}>
              <img
                src={productImages[selectedImage] || 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=800&h=800&fit=crop'}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-opacity duration-300"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=800&h=800&fit=crop'; }}
              />

              {/* Wishlist button */}
              <button
                onClick={handleAddToWishlist}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg transition-all duration-200 hover:scale-110 ${wishlistAdded ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
              >
                <Heart className={`w-5 h-5 ${wishlistAdded ? 'fill-red-500' : ''}`} />
              </button>

              {/* Image counter on mobile */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full sm:hidden">
                  {selectedImage + 1} / {productImages.length}
                </div>
              )}
            </div>
          </div>

          {/* ── PRODUCT INFO ── */}
          <div className="lg:w-[45%] flex flex-col">

            {/* Category tag */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {product.category?.name || 'Cosmic Virtue'}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 fill-white text-white" />
                <span className="text-white text-xs font-bold">4.5</span>
              </div>
              <span className="text-sm text-gray-500">(324 Reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-purple-100">
              <span className="text-4xl font-bold text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                ₹{product.price}
              </span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Tax included</span>
            </div>

            {/* Short description */}
            {product.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-6 capitalize" style={{ fontWeight: 300 }}>
                {product.description.length > 180 ? product.description.substring(0, 180) + '...' : product.description}
              </p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Qty</span>
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-11 text-center text-base font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('increase')}
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
                In Stock
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 mb-7">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:shadow-purple-200 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {addingToCart ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</>
                ) : (
                  <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={addingToCart}
                className="w-full border-2 border-gray-900 text-gray-900 py-4 rounded-xl font-semibold text-sm uppercase tracking-wide hover:bg-gray-900 hover:text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 py-6 border-t border-purple-100">
              {[
                { icon: <Truck className="w-5 h-5" />, label: 'Free Delivery' },
                { icon: <RotateCcw className="w-5 h-5" />, label: 'Easy Returns' },
                { icon: <Shield className="w-5 h-5" />, label: 'Secure Pay' },
              ].map((item, i) => (
                <div key={i} className="trust-icon flex flex-col items-center gap-2 text-center">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-purple-600">
                    {item.icon}
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-2 mt-1">
              {[
                { icon: <Leaf className="w-3 h-3" />, label: '100% Natural' },
                { icon: <Award className="w-3 h-3" />, label: 'Certified Safe' },
                { icon: <Package className="w-3 h-3" />, label: 'Eco Packaging' },
                { icon: <Sparkles className="w-3 h-3" />, label: 'Handcrafted' },
              ].map((badge, i) => (
                <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-xs font-medium border border-purple-100">
                  {badge.icon}
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── ACCORDION DETAILS ── */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-14">

          {/* Description */}
          <AccordionSection
            title="Product Description"
            isOpen={openAccordion === 'description'}
            onToggle={() => toggleAccordion('description')}
          >
            <p className="text-gray-600 text-sm leading-relaxed mb-4 capitalize" style={{ fontWeight: 300 }}>
              {product.description}
            </p>
            {product.fragnance && (
              <>
                <h4 className="text-base font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Scent Profile
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed capitalize" style={{ fontWeight: 300 }}>
                  {product.fragnance}
                </p>
              </>
            )}
          </AccordionSection>

          {/* Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <AccordionSection
              title="Ingredients"
              isOpen={openAccordion === 'ingredients'}
              onToggle={() => toggleAccordion('ingredients')}
            >
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient, index) => (
                  <span key={index} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-100">
                    {ingredient}
                  </span>
                ))}
              </div>
            </AccordionSection>
          )}

          {/* Key Features */}
          {product.keyFeatures && product.keyFeatures.length > 0 && (
            <AccordionSection
              title="Key Features"
              isOpen={openAccordion === 'features'}
              onToggle={() => toggleAccordion('features')}
            >
              <ul className="space-y-2.5">
                {product.keyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-gray-600" style={{ fontWeight: 300 }}>
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </AccordionSection>
          )}

          {/* Dimensions */}
          {product.dimension && (
            <AccordionSection
              title="Product Specifications"
              isOpen={openAccordion === 'specs'}
              onToggle={() => toggleAccordion('specs')}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Height</p>
                  <p className="text-base font-bold text-gray-900">{product.dimension.height} cm</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Weight</p>
                  <p className="text-base font-bold text-gray-900">{product.dimension.weight} g</p>
                </div>
              </div>
            </AccordionSection>
          )}

          {/* How to Use */}
          {product.category?.howtoUse && product.category.howtoUse.length > 0 && (
            <AccordionSection
              title="How to Use"
              isOpen={openAccordion === 'howtouse'}
              onToggle={() => toggleAccordion('howtouse')}
            >
              <ol className="space-y-3">
                {product.category.howtoUse.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-600 leading-relaxed" style={{ fontWeight: 300 }}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </AccordionSection>
          )}

          {/* Why Choose Us */}
          <AccordionSection
            title="Why Choose Cosmic Virtue?"
            isOpen={openAccordion === 'why'}
            onToggle={() => toggleAccordion('why')}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <Sparkles className="w-5 h-5" />, title: 'Premium Quality', desc: 'Handcrafted with finest natural ingredients sourced ethically.' },
                { icon: <Shield className="w-5 h-5" />, title: 'Eco-Friendly', desc: 'Sustainable & biodegradable packaging. Zero plastic.' },
                { icon: <Award className="w-5 h-5" />, title: 'Certified Safe', desc: 'Tested to highest quality and safety standards.' },
              ].map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white mb-3">
                    {item.icon}
                  </div>
                  <h5 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h5>
                  <p className="text-xs text-gray-500 leading-relaxed" style={{ fontWeight: 300 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </AccordionSection>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs text-purple-500 uppercase tracking-widest font-semibold mb-1">Explore More</p>
                <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                  You May Also Like
                </h2>
              </div>
              <button
                onClick={() => navigate('/products')}
                className="text-xs text-purple-600 font-semibold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all hover:text-pink-600"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => window.location.href = `/product/${item.id}`}
                  className="related-card cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md"
                >
                  <div className="overflow-hidden bg-gray-50" style={{ aspectRatio: '1/1'}}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=400&h=400&fit=crop'; }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-500 font-medium">{item.rating}</span>
                    </div>
                    <span className="text-base font-bold text-gray-900">₹{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ── ACCORDION SECTION COMPONENT ──
const AccordionSection = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-purple-50/50 transition-colors group"
      >
        <span
          className="text-base font-bold text-gray-900 group-hover:text-purple-600 transition-colors"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </span>
        <span className="text-gray-400 flex-shrink-0 ml-4 group-hover:text-purple-500 transition-colors">
          {isOpen
            ? <ChevronUp className="w-4 h-4" />
            : <ChevronDown className="w-4 h-4" />
          }
        </span>
      </button>
      <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;