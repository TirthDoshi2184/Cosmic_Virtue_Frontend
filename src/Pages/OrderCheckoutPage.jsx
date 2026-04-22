  const SKIP_OTP = false; // 🔥 DEV ONLY

  import { auth } from '../utils/firebase';
  import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

  import React, { useState, useEffect } from "react";
  import {
    CreditCard,
    Truck,
    MapPin,
    User,
    Phone,
    Mail,
    Home,
    Building,
    Navigation,
    Lock,
    ShoppingBag,
    CheckCircle,
    ChevronRight,
    AlertCircle,
    Loader2,
    Bookmark,
    BookmarkPlus,
    ChevronDown,
    ChevronUp,
  } from "lucide-react";
  import { useNavigate } from "react-router-dom";

  const OrderCheckoutPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [activeStep, setActiveStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [showSavedAddresses, setShowSavedAddresses] = useState(false);
    const [showOrderSummary, setShowOrderSummary] = useState(true);

    // Add these new state variables
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [shippingCharge, setShippingCharge] = useState(50); // default fallback

    const [confirmationResult, setConfirmationResult] = useState(null);

    const [stateList, setStateList] = useState([]);
const [cityList, setCityList] = useState([]);
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    // Form States
    const [contactInfo, setContactInfo] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });

    const [shippingAddress, setShippingAddress] = useState({
  address: "", apartment: "", city: "", state: "",
  stateCode: "",   // ← add this
  pincode: "", country: "India", landmark: "",
});

    const [billingAddress, setBillingAddress] = useState({
      address: "",
      apartment: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    });

    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("online");
    const [saveAddress, setSaveAddress] = useState(false);

// Cleanup reCAPTCHA on unmount only
useEffect(() => {
  // ✅ Clear any previously stored verification state
  localStorage.removeItem('userPhone');
  localStorage.removeItem('phoneVerified');

  return () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  };
}, []);
// STATES
useEffect(() => {
  fetch('https://api.countrystatecity.in/v1/countries/IN/states', {
    headers: { 'X-CSCAPI-KEY': '6c2ac2fda3c996e2b63b3f17704a86a6b40df89a798c8c3ab332a522b8424d82' }
  })
  .then(r => r.json())
  .then(data => {
    console.log('States loaded:', data.length);
    setStateList(Array.isArray(data) ? data.sort((a, b) => a.name.localeCompare(b.name)) : []);
  })
  .catch(err => console.error('Failed to load states:', err));
}, []);

// CITIES
useEffect(() => {
  if (!shippingAddress.stateCode) return;
  setCityList([]);
  fetch(`https://api.countrystatecity.in/v1/countries/IN/states/${shippingAddress.stateCode}/cities`, {
    headers: { 'X-CSCAPI-KEY': '6c2ac2fda3c996e2b63b3f17704a86a6b40df89a798c8c3ab332a522b8424d82' }
  })
  .then(r => r.json())
  .then(data => {
    console.log('Cities loaded:', data.length);
    setCityList(Array.isArray(data) ? data.sort((a, b) => a.name.localeCompare(b.name)) : []);
  })
  .catch(err => console.error('Failed to load cities:', err));
}, [shippingAddress.stateCode]);
// ============================================
    // UTILITY FUNCTIONS
    // ============================================

    const isUserLoggedIn = () => {
      const token = localStorage.getItem("token");
      return !!token;
    };

    const getUserId = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return user.id || user._id;
      } catch (error) {
        console.error("Error getting user ID:", error);
        return null;
      }
    };

    const getUserToken = () => {
      return localStorage.getItem("token");
    };

    const getLocalCart = () => {
      try {
        return JSON.parse(localStorage.getItem("cart") || "[]");
      } catch (error) {
        console.error("Error reading cart from localStorage:", error);
        return [];
      }
    };

    const getSavedAddresses = () => {
      try {
        return JSON.parse(localStorage.getItem("savedAddresses") || "[]");
      } catch (error) {
        console.error("Error reading saved addresses:", error);
        return [];
      }
    };

    // Add these functions after getSavedAddresses()

    // CHANGE: sendOTP function
const sendOTP = async () => {
  const phone = contactInfo.phone;
  if (!/^[0-9]{10}$/.test(phone)) {
    alert('Please enter a valid 10-digit phone number');
    return;
  }

  setVerifying(true);

  try {
    // ✅ Only create verifier if it doesn't already exist
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => {},
          'expired-callback': () => {
            // Don't null it here — just let next sendOTP recreate if needed
            window.recaptchaVerifier = null;
          }
        }
      );
      // ✅ Render it once explicitly
      await window.recaptchaVerifier.render();
    }

    const result = await signInWithPhoneNumber(
      auth,
      `+91${phone}`,
      window.recaptchaVerifier
    );

    setConfirmationResult(result);
    setOtpSent(true);
    alert('OTP sent to your phone!');

  } catch (error) {
    console.error('Firebase OTP error:', error.code, error.message);

    // ✅ On error, fully destroy so next attempt starts clean
    if (window.recaptchaVerifier) {
      try { window.recaptchaVerifier.clear(); } catch (e) {}
      window.recaptchaVerifier = null;
    }
    // ✅ Wipe DOM so Firebase doesn't complain on retry
    const container = document.getElementById('recaptcha-container');
    if (container) container.innerHTML = '';

    alert('Failed to send OTP. Please try again.');
  }

  setVerifying(false);
};
// CHANGE: verifyOTP function
    const verifyOTP = async () => {
  if (SKIP_OTP) {
    setPhoneVerified(true);
    return;
  }

  if (!confirmationResult) {
    alert('Please request OTP first');
    return;
  }

  setVerifying(true);

  try {
    // Verify OTP with Firebase
    const userCredential = await confirmationResult.confirm(otp);

    // Get Firebase token to send to your backend
    const firebaseToken = await userCredential.user.getIdToken();

    // Verify token with your backend
    const response = await fetch(`${API_BASE_URL}/checkout/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: contactInfo.phone,
        firebaseToken,           // send token instead of otp
      }),
    });

    const data = await response.json();

    if (data.success) {
      setPhoneVerified(true);
      loadAddressesByPhone(contactInfo.phone);
      alert('Phone verified successfully! ✓');
    } else {
      alert(data.message || 'Verification failed');
    }

  } catch (error) {
    console.error('OTP verify error:', error);
    alert('Invalid OTP. Please try again.');
  }

  setVerifying(false);
};
    // CHANGE: Load addresses by phone
const loadAddressesByPhone = async (phone) => {
  try {
    // Try backend first
    const res = await fetch(`${API_BASE_URL}/checkout/addresses/${phone}`);
    const data = await res.json();
    if (data.success && data.data.length > 0) {
      setSavedAddresses(data.data);
    } else {
      // Fallback to localStorage
      const key = `savedAddresses_${phone}`;
      const addresses = JSON.parse(localStorage.getItem(key) || "[]");
      setSavedAddresses(addresses);
    }
  } catch (error) {
    console.error("Error loading addresses:", error);
  }
};
    // CHANGE: Save address with phone
    const saveAddressWithPhone = async (address) => {
  const phone = contactInfo.phone;
  if (!phoneVerified) {
    alert("Please verify your phone number first");
    return;
  }

  try {
    // Save to backend
    await fetch(`${API_BASE_URL}/checkout/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, ...address })
    });
    // Refresh list
    loadAddressesByPhone(phone);
  } catch(err){
    // Fallback to localStorage
    const key = `savedAddresses_${phone}`;
    const addresses = JSON.parse(localStorage.getItem(key) || "[]");
    addresses.push({ id: Date.now(), phone, ...address, savedAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(addresses));
    setSavedAddresses(addresses);
  }
};

    const [pincodeStatus, setPincodeStatus] = useState(null); // null | 'checking' | 'ok' | 'error'

const checkPincodeServiceability = async (pincode) => {
  if (pincode.length !== 6 || !/^[0-9]{6}$/.test(pincode)) {
    setPincodeStatus(null);
    return;
  }

  setPincodeStatus('checking');

  try {
    const res = await fetch(`${API_BASE_URL}/checkout/serviceability/${pincode}`);
    const data = await res.json();

    if (!data.serviceable) {
      setPincodeStatus('error');
      setErrors(prev => ({
        ...prev,
        pincode: '⚠️ Sorry, we do not deliver to this pincode yet'
      }));
    } else {
      setPincodeStatus('ok');
      setShippingCharge(data.shippingCharge); // ADD THIS
      // Only clear if it was previously an error
      setErrors(prev => {
        const updated = { ...prev };
        delete updated.pincode;
        return updated;
      });
    }
  } catch (err) {
    console.error('Pincode check failed:', err);
    setPincodeStatus(null); // fail silently
    // Don't set error - let checkout proceed
  }
};
    const saveAddressToLocal = (address) => {
      try {
        const addresses = getSavedAddresses();
        const newAddress = {
          id: Date.now(),
          ...address,
          savedAt: new Date().toISOString(),
        };
        addresses.push(newAddress);
        localStorage.setItem("savedAddresses", JSON.stringify(addresses));
        setSavedAddresses(addresses);
      } catch (error) {
        console.error("Error saving address:", error);
      }
    };

    const fetchCartFromAPI = async () => {
      try {
        const token = getUserToken();
        
        if (!token) {
          throw new Error("User not authenticated");
        }

        const response = await fetch(`${API_BASE_URL}/cart`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }

        const data = await response.json();

        const transformedCart =
          data.cart?.items?.map((item) => ({
            id: item._id,
            productId: item.productId?._id || item.productId,
            name: item.productId?.name || item.name,
            price: item.productId?.price || item.price,
            quantity: item.quantity,
            image: Array.isArray(item.productId?.img)
              ? item.productId.img[0]
              : item.productId?.img || item.image,
            size: item.size || "Standard",
          })) || [];

        return transformedCart;
      } catch (error) {
        console.error("Error fetching cart from API:", error);
        return [];
      }
    };

    // ============================================
    // LOAD CART AND SAVED ADDRESSES ON MOUNT
    // ============================================
    // Modify the existing useEffect to add this at the end:

    useEffect(() => {
  const loadCart = async () => {
    setLoading(true);
    try {
      let cart = [];
      
      if (isUserLoggedIn()) {
        cart = await fetchCartFromAPI();
      } else {
        cart = getLocalCart();
      }
      
      // If cart is empty, wait and retry once
      if (cart.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
        cart = isUserLoggedIn() ? await fetchCartFromAPI() : getLocalCart();
      }
      
      setCartItems(cart);

      // ADD THESE LINES:
      const addresses = getSavedAddresses();
setSavedAddresses(addresses);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };
  
  if (SKIP_OTP) {
    setPhoneVerified(true);
  }

  loadCart();
}, []);
    // ============================================
    // CALCULATIONS
    // ============================================
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shipping = subtotal > 999 ? 0 : shippingCharge;
    // const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping ;

    // ============================================
    // VALIDATION
    // ============================================
    const validateContactInfo = () => {
      const newErrors = {};

      if (!contactInfo.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!contactInfo.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
      if (!contactInfo.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(contactInfo.email)) {
        newErrors.email = "Email is invalid";
      }
      if (!contactInfo.phone.trim()) {
        newErrors.phone = "Phone is required";
      } else if (!/^[0-9]{10}$/.test(contactInfo.phone.replace(/\s/g, ""))) {
        newErrors.phone = "Phone must be 10 digits";
      }

      return newErrors;
    };

    const validateShippingAddress = () => {
      const newErrors = {};

      if (!shippingAddress.address.trim()) {
        newErrors.address = "Address is required";
      }
      if (!shippingAddress.city.trim()) {
        newErrors.city = "City is required";
      }
      if (!shippingAddress.state.trim()) {
        newErrors.state = "State is required";
      }
      if (!shippingAddress.pincode.trim()) {
        newErrors.pincode = "Pincode is required";
      } else if (!/^[0-9]{6}$/.test(shippingAddress.pincode)) {
        newErrors.pincode = "Pincode must be 6 digits";
      }

      return newErrors;
    };

    const validateBillingAddress = () => {
      if (sameAsShipping) return {};

      const newErrors = {};

      if (!billingAddress.address.trim()) {
        newErrors.billingAddress = "Address is required";
      }
      if (!billingAddress.city.trim()) {
        newErrors.billingCity = "City is required";
      }
      if (!billingAddress.state.trim()) {
        newErrors.billingState = "State is required";
      }
      if (!billingAddress.pincode.trim()) {
        newErrors.billingPincode = "Pincode is required";
      } else if (!/^[0-9]{6}$/.test(billingAddress.pincode)) {
        newErrors.billingPincode = "Pincode must be 6 digits";
      }

      return newErrors;
    };

    // ============================================
    // STEP NAVIGATION
    // ============================================
    const handleNextStep = () => {
      let newErrors = {};

      if (activeStep === 1) {
        // ADD THIS CHECK:
        if (!phoneVerified) {
          alert("Please verify your phone number to continue");
          return;
        }
        newErrors = validateContactInfo();
      } else if (activeStep === 2) {
        newErrors = { ...validateShippingAddress(), ...validateBillingAddress() };

        // REPLACE saveAddressToLocal with saveAddressWithPhone:
        if (Object.keys(newErrors).length === 0 && saveAddress && phoneVerified) {
          const addressToSave = {
            ...contactInfo,
            ...shippingAddress,
          };
          saveAddressWithPhone(addressToSave); // CHANGED THIS LINE
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      setActiveStep(activeStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const handlePreviousStep = () => {
      setActiveStep(activeStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ============================================
    // LOAD SAVED ADDRESS
    // ============================================
    const loadSavedAddress = (address) => {
      setContactInfo({
        firstName: address.firstName || "",
        lastName: address.lastName || "",
        email: address.email || "",
        phone: address.phone || "",
      });

      setShippingAddress({
  address: address.address || "",
  apartment: address.apartment || "",
  city: address.city || "",
  state: address.state || "",
  stateCode: address.stateCode || "",   // ← add this
  pincode: address.pincode || "",
  country: address.country || "India",
  landmark: address.landmark || "",
});

      setShowSavedAddresses(false);
       if (address.pincode) {
    checkPincodeServiceability(address.pincode);
  }
    };

    // ============================================
    // PLACE ORDER
    // ============================================
  const handlePlaceOrder = async () => {
  if (!paymentMethod) {
    setErrors({ payment: "Please select a payment method" });
    return;
  }

  setProcessing(true);

  try {
    const userId    = getUserId();
    const orderData = {
      contactInfo,
      shippingAddress,
      billingAddress: sameAsShipping ? shippingAddress : billingAddress,
      items:          cartItems,
      paymentMethod,
      pricing: { subtotal, shipping, total },
      phoneVerified,
      userId
    };

    const response = await fetch(`${API_BASE_URL}/checkout/orders`, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(getUserToken() && { Authorization: `Bearer ${getUserToken()}` })
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to place order');

    const { orderId, orderNumber } = data.data;

    if (paymentMethod === 'cod') {
      localStorage.setItem('cart', '[]');
      navigate('/order-success', {
        state: {
          orderData:   data.data,
          orderNumber: orderNumber,
          tracking:    data.data.tracking
        }
      });
      return;
    }

    const rzpRes = await fetch(`${API_BASE_URL}/checkout/payment/create-order`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ amount: total, orderId })
    });

    const rzpData = await rzpRes.json();
    if (!rzpData.success) throw new Error('Payment initialization failed');

    // ✅ FIX: declare paymentFailed flag BEFORE building options
    let paymentFailed = false;

    // ✅ FIX: build complete options object BEFORE calling new Razorpay()
    const options = {
      key:         rzpData.data.keyId,
      amount:      rzpData.data.amount,
      currency:    rzpData.data.currency,
      name:        'Your Candle Brand',
      description: `Order #${orderNumber}`,
      image:       '/logo.png',
      order_id:    rzpData.data.razorpayOrderId,

      prefill: {
        name:    `${contactInfo.firstName} ${contactInfo.lastName}`,
        email:   contactInfo.email,
        contact: contactInfo.phone
      },

      theme: {
        color: '#7C3AED'
      },

      handler: async (razorpayResponse) => {
        try {
          const verifyRes = await fetch(`${API_BASE_URL}/checkout/payment/verify`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
              razorpay_order_id:   razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature:  razorpayResponse.razorpay_signature,
              orderId
            })
          });

          const verifyData = await verifyRes.json();

          if (!verifyData.success) {
            throw new Error('Payment verification failed');
          }

          localStorage.setItem('cart', '[]');
          navigate('/order-success', {
            state: {
              orderData:   verifyData.data,
              orderNumber: orderNumber,
              tracking:    verifyData.data.tracking
            }
          });
        } catch (err) {
          alert('Payment done but verification failed. Please contact support with Order #' + orderNumber);
        }
      },

      // ✅ FIX: ondismiss is defined here inside options, before new Razorpay()
      modal: {
        ondismiss: () => {
          if (paymentFailed) return; // failure handler already ran
          setProcessing(false);
          const retry = window.confirm(
            `Payment was cancelled. Your order #${orderNumber} is saved.\n\nClick OK to retry payment, or Cancel to go to Order History.`
          );
          if (retry) {
            rzp.open();
          } else {
            navigate('/orders');
          }
        }
      }
    };

    // ✅ FIX: construct AFTER options is fully built
    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', (response) => {
      paymentFailed = true;
      setProcessing(false);
      alert(`Payment failed: ${response.error.description}. Order #${orderNumber} is saved — retry from Order History.`);
    });

    rzp.open();

  }catch (error) {
    console.error('Order error:', error);
    setProcessing(false); // ✅ always reset processing on any error
    alert(error.message || 'Failed to place order. Please try again.');
  } finally {
    if (paymentMethod === 'cod') setProcessing(false);
  }
};
    // ============================================
    // RENDER LOADING STATE
    // ============================================
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading checkout...</p>
          </div>
        </div>
      );
    }

    // ============================================
    // RENDER EMPTY CART STATE
    // ============================================
    if (cartItems.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="p-8 bg-white rounded-full inline-block mb-6 shadow-lg">
              <ShoppingBag className="w-20 h-20 text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add some items to your cart before checking out
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      );
    }

    // ============================================
    // ORDER SUMMARY COMPONENT (reusable)
    // ============================================
    const OrderSummary = ({ isMobile = false }) => (
      <div
        className={`bg-white rounded-2xl shadow-xl p-6 border border-purple-100 ${isMobile ? "" : "sticky top-4"}`}
      >
        {isMobile && (
          <button
            onClick={() => setShowOrderSummary(!showOrderSummary)}
            className="w-full flex items-center justify-between mb-4 lg:hidden"
          >
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
              Order Summary
            </h3>
            {showOrderSummary ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
        )}

        {!isMobile && (
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-600" />
            Order Summary
          </h3>
        )}

        <div className={`${isMobile && !showOrderSummary ? "hidden" : ""}`}>
          {/* Cart Items */}
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id || item.productId} className="flex gap-3">
                <div className="relative">
                  <img
                    src={
                      item.image ||
                      "https://images.unsplash.com/photo-1602874801006-47c1c969a405?w=200&h=200&fit=crop"
                    }
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1602874801006-47c1c969a405?w=200&h=200&fit=crop";
                    }}
                  />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">{item.size}</p>
                  <p className="text-sm font-bold text-purple-600 mt-1">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Subtotal (
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
              </span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
  <span>Shipping</span>
  <span className="font-medium">
    {subtotal > 999 ? (
      <span className="text-green-600 font-semibold">FREE</span>
    ) : pincodeStatus === 'checking' ? (
      <span className="text-blue-500 flex items-center gap-1">
        <Loader2 className="w-3 h-3 animate-spin" /> Calculating...
      </span>
    ) : pincodeStatus === 'ok' ? (
      <span className="text-gray-800 font-semibold">₹{shippingCharge.toFixed(2)}</span>
    ) : (
      <span className="text-gray-400 text-xs">Enter pincode</span>
    )}
  </span>
</div>
            {/* <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (GST 18%)</span>
              <span className="font-medium">₹{tax.toFixed(2)}</span>
            </div> */}

            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
  <span className="text-lg font-bold text-gray-800">Total</span>
  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
    {pincodeStatus === 'ok' || subtotal > 999
      ? `₹${total.toFixed(2)}`
      : `₹${(subtotal + shippingCharge).toFixed(2)}`
    }
  </span>
</div>
          </div>

          {/* Free Shipping Progress */}
          {subtotal < 999 && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-purple-700 font-medium mb-2">
                Add ₹{(999 - subtotal).toFixed(2)} more for FREE shipping! 🎉
              </p>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Trust Badges */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Lock className="w-4 h-4 text-green-600" />
              <span>Secure & encrypted checkout</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Fast & reliable delivery</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <CheckCircle className="w-4 h-4 text-purple-600" />
              <span>100% satisfaction guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    );

    // ============================================
    // MAIN RENDER
    // ============================================
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-3">
              Checkout
            </h1>
            <p className="text-gray-600">
              Complete your order in just a few steps
            </p>
          </div>

          {/* Progress Steps */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${((activeStep - 1) / 2) * 100}%` }}
                />
              </div>

              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeStep >= 1
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-white border-2 border-gray-300 text-gray-400"
                  }`}
                >
                  {activeStep > 1 ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${activeStep >= 1 ? "text-purple-600" : "text-gray-400"}`}
                >
                  Contact
                </span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeStep >= 2
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-white border-2 border-gray-300 text-gray-400"
                  }`}
                >
                  {activeStep > 2 ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <MapPin className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${activeStep >= 2 ? "text-purple-600" : "text-gray-400"}`}
                >
                  Address
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeStep >= 3
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-white border-2 border-gray-300 text-gray-400"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${activeStep >= 3 ? "text-purple-600" : "text-gray-400"}`}
                >
                  Payment
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mobile Order Summary - Shows at top on mobile */}
            <div className="lg:hidden">
              <OrderSummary isMobile={true} />
            </div>

            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* STEP 1: CONTACT INFORMATION */}
              {activeStep === 1 && (
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-purple-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Contact Information
                    </h2>
                  </div>

                  <div className="space-y-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        First Name *
      </label>
      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={contactInfo.firstName}
          onChange={(e) =>
            setContactInfo({ ...contactInfo, firstName: e.target.value })
          }
          className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
            errors.firstName ? "border-red-500" : "border-gray-200"
          }`}
          placeholder="John"
        />
      </div>
      {errors.firstName && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {errors.firstName}
        </p>
      )}
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Last Name *
      </label>
      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={contactInfo.lastName}
          onChange={(e) =>
            setContactInfo({ ...contactInfo, lastName: e.target.value })
          }
          className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
            errors.lastName ? "border-red-500" : "border-gray-200"
          }`}
          placeholder="Doe"
        />
      </div>
      {errors.lastName && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {errors.lastName}
        </p>
      )}
    </div>
  </div>

  {/* Email Address - plain input, no OTP */}
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Email Address *
    </label>
    <div className="relative">
      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="email"
        value={contactInfo.email}
        onChange={(e) =>
          setContactInfo({ ...contactInfo, email: e.target.value })
        }
        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
          errors.email ? "border-red-500" : "border-gray-200"
        }`}
        placeholder="your.email@example.com"
      />
    </div>
    {errors.email && (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {errors.email}
      </p>
    )}
  </div>

  {/* Phone Number - OTP verification via MSG91 */}
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Phone Number *{" "}
      {phoneVerified && (
        <span className="text-green-600 ml-2">✓ Verified</span>
      )}
    </label>
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="tel"
          value={contactInfo.phone}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
            setContactInfo({ ...contactInfo, phone: val });
            setPhoneVerified(false);
            setOtpSent(false);
          }}
          disabled={!SKIP_OTP && phoneVerified}
          className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
            phoneVerified
              ? "border-green-500 bg-green-50"
              : errors.phone
              ? "border-red-500"
              : "border-gray-200"
          }`}
          placeholder="9876543210"
          maxLength="10"
        />
      </div>

      {!phoneVerified && (
        <button
          onClick={sendOTP}
          disabled={
            verifying ||
            !contactInfo.phone ||
            !/^[0-9]{10}$/.test(contactInfo.phone)
          }
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {verifying ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : otpSent ? (
            "Resend OTP"
          ) : (
            "Send OTP"
          )}
        </button>
      )}
    </div>
    {errors.phone && (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {errors.phone}
      </p>
    )}
  </div>

  {/* OTP Input Box - shown after Send OTP */}
  {otpSent && !phoneVerified && (
    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Enter OTP
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter 6-digit OTP"
          maxLength="6"
        />
        <button
          onClick={verifyOTP}
          disabled={verifying || otp.length !== 6}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {verifying ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Verify"
          )}
        </button>
      </div>
      <p className="text-xs text-purple-700 mt-2">
        OTP sent to +91 {contactInfo.phone}. Valid for 5 minutes.
      </p>
    </div>
  )}
</div>

<div className="mt-8">
  <button
    onClick={handleNextStep}
    disabled={!phoneVerified}
    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {!phoneVerified ? (
      <>
        <Lock className="w-5 h-5" />
        Verify Phone to Continue
      </>
    ) : (
      <>
        Continue to Shipping
        <ChevronRight className="w-5 h-5" />
      </>
    )}
  </button>
</div>
                </div>
              )}

              {/* STEP 2: SHIPPING & BILLING ADDRESS */}
              {activeStep === 2 && (
                <div className="space-y-6">
                  {/* Saved Addresses */}
                  {savedAddresses.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-purple-100">
                      <button
                        onClick={() => setShowSavedAddresses(!showSavedAddresses)}
                        className="w-full flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                            <Bookmark className="w-5 h-5 text-white" />
                          </div>
                          <h2 className="text-2xl font-bold text-gray-800">
                            Saved Addresses
                          </h2>
                        </div>
                        {showSavedAddresses ? (
                          <ChevronUp className="w-6 h-6 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-600" />
                        )}
                      </button>

                      {showSavedAddresses && (
                        <div className="mt-4 space-y-3">
                          {savedAddresses.map((addr) => (
                            <div
                              key={addr.id}
                              onClick={() => loadSavedAddress(addr)}
                              className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 cursor-pointer transition-all"
                            >
                              <p className="font-semibold text-gray-800">
                                {addr.firstName} {addr.lastName}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {addr.address}, {addr.city}, {addr.state} -{" "}
                                {addr.pincode}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {addr.phone}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Shipping Address */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-purple-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        <Truck className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Shipping Address
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Street Address *
                        </label>
                        <div className="relative">
                          <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={shippingAddress.address}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                address: e.target.value,
                              })
                            }
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                              errors.address
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                            placeholder="123 Main Street"
                          />
                        </div>
                        {errors.address && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.address}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Apartment, Suite, etc. (Optional)
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={shippingAddress.apartment}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                apartment: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            placeholder="Apt 4B"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            City *
                          </label>
                          {shippingAddress.stateCode ? (
  <select
    value={shippingAddress.city}
    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
      errors.city ? "border-red-500" : "border-gray-200"
    }`}
  >
    <option value="">Select City</option>
    {cityList.map(c => (
      <option key={c.id} value={c.name}>{c.name}</option>
    ))}
  </select>
) : (
  <input
    disabled
    placeholder="Select a state first"
    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
  />
)}
                          {errors.city && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {errors.city}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            State *
                          </label>
                          <select
  value={shippingAddress.stateCode}
  onChange={(e) => {
    const selected = stateList.find(s => s.iso2 === e.target.value);
    setShippingAddress({
      ...shippingAddress,
      state: selected?.name || "",
      stateCode: e.target.value,
      city: "",   // reset city on state change
    });
  }}
  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
    errors.state ? "border-red-500" : "border-gray-200"
  }`}
>
  <option value="">Select State</option>
  {stateList.map(s => (
    <option key={s.iso2} value={s.iso2}>{s.name}</option>
  ))}
</select>
                          {errors.state && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {errors.state}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Pincode *
                          </label>
                          <input
  type="text"
  value={shippingAddress.pincode}
  onChange={(e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setShippingAddress({ ...shippingAddress, pincode: val });
    checkPincodeServiceability(val);       // ← ADD THIS
  }}
  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
    pincodeStatus === 'error'
      ? 'border-red-500 bg-red-50'
      : pincodeStatus === 'ok'
      ? 'border-green-500 bg-green-50'
      : errors.pincode
      ? 'border-red-500'
      : 'border-gray-200'
  }`}
  placeholder="400001"
  maxLength="6"
/>

{/* ADD status indicators below the input */}
{pincodeStatus === 'checking' && (
  <p className="text-blue-500 text-xs mt-1 flex items-center gap-1">
    <Loader2 className="w-3 h-3 animate-spin" />
    Checking delivery availability...
  </p>
)}
{pincodeStatus === 'ok' && (
  <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
    <CheckCircle className="w-3 h-3" />
    Delivery available at this pincode ✓
  </p>
)}
{pincodeStatus === 'error' && (
  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
    <AlertCircle className="w-3 h-3" />
    {errors.pincode}
  </p>
)}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.country}
                            disabled
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Landmark (Optional)
                        </label>
                        <div className="relative">
                          <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={shippingAddress.landmark}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                landmark: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            placeholder="Near City Mall"
                          />
                        </div>
                      </div>

                      {/* Save Address Checkbox */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="saveAddress"
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label
                          htmlFor="saveAddress"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <BookmarkPlus className="w-4 h-4 text-purple-600" />
                          Save this address for future orders
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-purple-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Billing Address
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        id="sameAsShipping"
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label
                        htmlFor="sameAsShipping"
                        className="text-sm font-medium text-gray-700"
                      >
                        Same as shipping address
                      </label>
                    </div>

                    {!sameAsShipping && (
                      <div className="space-y-4 mt-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            value={billingAddress.address}
                            onChange={(e) =>
                              setBillingAddress({
                                ...billingAddress,
                                address: e.target.value,
                              })
                            }
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                              errors.billingAddress
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                            placeholder="123 Main Street"
                          />
                          {errors.billingAddress && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />{" "}
                              {errors.billingAddress}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              City *
                            </label>
                            {billingAddress.stateCode ? (
  <select
    value={billingAddress.city}
    onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
      errors.city ? "border-red-500" : "border-gray-200"
    }`}
  >
    <option value="">Select City</option>
    {cityList.map(c => (
      <option key={c.id} value={c.name}>{c.name}</option>
    ))}
  </select>
) : (
  <input
    disabled
    placeholder="Select a state first"
    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
  />
)}
                            {errors.billingCity && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />{" "}
                                {errors.billingCity}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              State *
                            </label>
                            <input
                              type="text"
                              value={billingAddress.state}
                              onChange={(e) =>
                                setBillingAddress({
                                  ...billingAddress,
                                  state: e.target.value,
                                })
                              }
                              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                                errors.billingState
                                  ? "border-red-500"
                                  : "border-gray-200"
                              }`}
                              placeholder="Maharashtra"
                            />
                            {errors.billingState && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />{" "}
                                {errors.billingState}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Pincode *
                          </label>
                          <input
                            type="text"
                            value={billingAddress.pincode}
                            onChange={(e) =>
                              setBillingAddress({
                                ...billingAddress,
                                pincode: e.target.value,
                              })
                            }
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                              errors.billingPincode
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                            placeholder="400001"
                            maxLength="6"
                          />
                          {errors.billingPincode && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />{" "}
                              {errors.billingPincode}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handlePreviousStep}
                      className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-purple-500 hover:text-purple-600 transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
  onClick={handleNextStep}
  disabled={pincodeStatus === 'error' || pincodeStatus === 'checking'}
  className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl ... disabled:opacity-50 disabled:cursor-not-allowed"
>
  {pincodeStatus === 'checking' ? (
    <>
      <Loader2 className="w-5 h-5 animate-spin" />
      Checking pincode...
    </>
  ) : (
    <>
      Continue to Payment
      <ChevronRight className="w-5 h-5" />
    </>
  )}
</button>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT METHOD */}
              {activeStep === 3 && (
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-purple-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Online Payment - All methods combined */}
                    <div
                      onClick={() => setPaymentMethod("online")}
                      className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        paymentMethod === "online"
                          ? "border-purple-500 bg-purple-50 shadow-md"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-lg ${
                              paymentMethod === "online"
                                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                                : "bg-gray-200"
                            }`}
                          >
                            <CreditCard
                              className={`w-6 h-6 ${
                                paymentMethod === "online"
                                  ? "text-white"
                                  : "text-gray-600"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-lg">
                              Online Payment
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Credit/Debit Card, UPI, Net Banking, Wallets
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                                💳 Cards
                              </span>
                              <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                                📱 UPI
                              </span>
                              <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                                🏦 Net Banking
                              </span>
                              <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                                👛 Wallets
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ${
                            paymentMethod === "online"
                              ? "border-purple-500 bg-purple-500"
                              : "border-gray-300"
                          } flex items-center justify-center`}
                        >
                          {paymentMethod === "online" && (
                            <div className="w-3 h-3 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Cash on Delivery */}
                    <div
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        paymentMethod === "cod"
                          ? "border-purple-500 bg-purple-50 shadow-md"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-lg ${
                              paymentMethod === "cod"
                                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                                : "bg-gray-200"
                            }`}
                          >
                            <Truck
                              className={`w-6 h-6 ${
                                paymentMethod === "cod"
                                  ? "text-white"
                                  : "text-gray-600"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-lg">
                              Cash on Delivery
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Pay when you receive your order
                            </p>
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ${
                            paymentMethod === "cod"
                              ? "border-purple-500 bg-purple-500"
                              : "border-gray-300"
                          } flex items-center justify-center`}
                        >
                          {paymentMethod === "cod" && (
                            <div className="w-3 h-3 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {errors.payment && (
                    <p className="text-red-500 text-sm mt-4 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.payment}
                    </p>
                  )}

                  <div className="mt-8 p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-purple-900 text-sm">
                          Secure Payment
                        </p>
                        <p className="text-purple-700 text-xs mt-1">
                          Your payment information is encrypted and secure. We
                          never store your card details.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={handlePreviousStep}
                      className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-purple-500 hover:text-purple-600 transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={processing}
                      className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Place Order
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary (Desktop only) */}
            <div className="hidden lg:block lg:col-span-1">
              <OrderSummary />
            </div>
          </div>
        </div>
   <div id="recaptcha-container"></div>
      </div>
    );
  };

  export default OrderCheckoutPage;
