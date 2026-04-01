import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingBag,
  Loader2,
  RefreshCw,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Box,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [userPhone, setUserPhone] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [trackingData, setTrackingData] = useState({});
  const [trackingLoading, setTrackingLoading] = useState({});

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  const isUserLoggedIn = () => !!localStorage.getItem("token");

  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.id || user._id;
    } catch { return null; }
  };

  const getUserToken = () => localStorage.getItem("token");
  const getSavedPhone = () => localStorage.getItem("userPhone");

  // ============================================
  // FETCH ORDERS
  // ============================================
  const fetchOrders = async () => {
    setLoading(true);
    try {
      let response;
      if (isUserLoggedIn()) {
        const userId = getUserId();
        const token = getUserToken();
        response = await fetch(`${API_BASE_URL}/checkout/orders/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const phone = getSavedPhone() || userPhone;
        if (!phone) {
          setShowPhoneInput(true);
          setLoading(false);
          return;
        }
        response = await fetch(`${API_BASE_URL}/checkout/orders/phone/${phone}`);
      }
      const data = await response.json();
      if (data.success) {
        setOrders(data.data || []);
        setPhoneVerified(true);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveTracking = async (orderId) => {
    if (trackingData[orderId]) return;
    setTrackingLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/orders/${orderId}/track`);
      const data = await response.json();
      if (data.success) {
        setTrackingData(prev => ({ ...prev, [orderId]: data }));
      }
    } catch (error) {
      console.error("Tracking fetch failed:", error);
    } finally {
      setTrackingLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // ============================================
  // LOAD ORDERS ON MOUNT
  // ============================================
  useEffect(() => {
    const savedPhone = getSavedPhone();
    if (savedPhone) { setUserPhone(savedPhone); setPhoneVerified(true); }
    if (isUserLoggedIn() || savedPhone) {
      fetchOrders();
    } else {
      setShowPhoneInput(true);
      setLoading(false);
    }
  }, []);

  // ============================================
  // PHONE SUBMIT (GUEST)
  // ============================================
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (userPhone && /^\d{10}$/.test(userPhone)) {
      localStorage.setItem("userPhone", userPhone);
      fetchOrders();
    } else {
      alert("Please enter a valid phone number");
    }
  };

  // ============================================
  // STATUS HELPERS
  // ============================================
  const getStatusConfig = (status) => {
    const map = {
      pending:    { bg: "bg-yellow-100 text-yellow-800 border-yellow-200",  dot: "bg-yellow-400",  icon: <Clock className="w-3.5 h-3.5" /> },
      processing: { bg: "bg-blue-100 text-blue-800 border-blue-200",        dot: "bg-blue-400",    icon: <Box className="w-3.5 h-3.5" /> },
      shipped:    { bg: "bg-purple-100 text-purple-800 border-purple-200",  dot: "bg-purple-500",  icon: <Truck className="w-3.5 h-3.5" /> },
      delivered:  { bg: "bg-green-100 text-green-800 border-green-200",     dot: "bg-green-500",   icon: <CheckCircle className="w-3.5 h-3.5" /> },
      cancelled:  { bg: "bg-red-100 text-red-800 border-red-200",           dot: "bg-red-400",     icon: <XCircle className="w-3.5 h-3.5" /> },
    };
    return map[status] || { bg: "bg-gray-100 text-gray-700 border-gray-200", dot: "bg-gray-400", icon: <Clock className="w-3.5 h-3.5" /> };
  };

  const getPaymentStatusColor = (status) =>
    status === "completed" ? "text-green-600" : status === "failed" ? "text-red-500" : "text-yellow-600";

  const filteredOrders = filterStatus === "all" ? orders : orders.filter(o => o.orderStatus === filterStatus);
  const getOrderNumber = (id) => id.toString().slice(-8).toUpperCase();
  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
  const getOrderName = (order) => order.items[0]?.name || "Your Order";
  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-14 h-14 text-purple-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            Loading your orders…
          </h2>
          <p className="text-gray-400 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>Just a moment</p>
        </div>
      </div>
    );
  }

  // ============================================
  // GUEST PHONE INPUT
  // ============================================
  if (showPhoneInput && !phoneVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;600&display=swap');`}</style>
        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8 sm:p-10 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              View Your Orders
            </h2>
            <p className="text-gray-500 text-sm" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
              Enter the phone number you used when placing your order
            </p>
          </div>

          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={userPhone}
                  onChange={e => setUserPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                  placeholder="your phone number"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm uppercase tracking-wide rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl hover:shadow-purple-200"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              View My Orders
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full py-3.5 border-2 border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:border-purple-400 hover:text-purple-600 transition-all"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Back to Home
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================
  // EMPTY STATE
  // ============================================
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;600&display=swap');`}</style>
        <div className="text-center max-w-sm">
          <div className="w-28 h-28 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-14 h-14 text-purple-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            No Orders Yet
          </h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
            You haven't placed any orders yet. Start shopping to see your order history here!
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm uppercase tracking-wide rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-200"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Start Shopping
            </button>
            {!isUserLoggedIn() && (
              <button
                onClick={() => { localStorage.removeItem("userPhone"); setPhoneVerified(false); setShowPhoneInput(true); }}
                className="w-full py-3.5 border-2 border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:border-purple-400 hover:text-purple-600 transition-all"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Use Different Phone
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN PAGE
  // ============================================
  const filters = [
    { value: "all",        label: "All Orders",  icon: Package },
    { value: "pending",    label: "Pending",     icon: Clock },
    { value: "processing", label: "Processing",  icon: Box },
    { value: "shipped",    label: "Shipped",     icon: Truck },
    { value: "delivered",  label: "Delivered",   icon: CheckCircle },
    { value: "cancelled",  label: "Cancelled",   icon: XCircle },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');

        .order-card { transition: box-shadow 0.3s ease; }
        .order-card:hover { box-shadow: 0 16px 48px rgba(147,51,234,0.12); }

        .input-focus {
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-focus:focus {
          border-color: #9333ea;
          box-shadow: 0 0 0 3px rgba(147,51,234,0.1);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50" style={{ fontFamily: "'Montserrat', sans-serif" }}>

        {/* ── HERO HEADER ── */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-12 sm:py-16 px-4 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-14 -right-14 w-72 h-72 bg-white/10 rounded-full pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Back button */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Home
            </button>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-px w-8 bg-white/50"></span>
                  <Sparkles className="w-4 h-4 text-white/70" />
                  <span className="text-white/70 text-xs uppercase tracking-[0.3em]">Your Account</span>
                </div>
                <h1
                  className="text-3xl sm:text-5xl font-bold text-white leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Order History
                </h1>
                <p className="text-white/70 text-sm mt-2" style={{ fontWeight: 300 }}>
                  {isUserLoggedIn() ? "Track and manage all your orders" : `Orders for ${userPhone ? userPhone : "your phone number"}`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchOrders}
                  className="flex items-center gap-2 bg-white/15 border border-white/30 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/25 transition-all"
                >
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
                {!isUserLoggedIn() && (
                  <button
                    onClick={() => { localStorage.removeItem("userPhone"); setPhoneVerified(false); setShowPhoneInput(true); setOrders([]); }}
                    className="flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all"
                  >
                    Change Phone
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

          {/* ── FILTER TABS ── */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-2 mb-8 flex flex-wrap gap-1.5 sm:gap-2">
            {filters.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setFilterStatus(value)}
                className={`flex-1 min-w-[80px] sm:min-w-[110px] px-3 sm:px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 transition-all duration-300 ${
                  filterStatus === value
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                    : "text-gray-500 hover:bg-purple-50 hover:text-purple-600"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* ── ORDER COUNT ── */}
          <p className="text-sm text-gray-400 mb-6 font-medium">
            Showing{" "}
            <span className="text-purple-600 font-bold">{filteredOrders.length}</span>{" "}
            {filterStatus !== "all" && filterStatus} order{filteredOrders.length !== 1 ? "s" : ""}
          </p>

          {/* ── ORDERS LIST ── */}
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const statusCfg = getStatusConfig(order.orderStatus);
              const isExpanded = expandedOrder === order._id;

              return (
                <div key={order._id} className="order-card bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">

                  {/* ── ORDER HEADER ── */}
                  <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-50/60 to-pink-50/60 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      {/* Left: icon + meta */}
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-md">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {getOrderName(order)}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(order.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <ShoppingBag className="w-3.5 h-3.5" />
                              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: badges + total + toggle */}
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Status badge */}
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusCfg.bg}`}>
                          {statusCfg.icon}
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>

                        {/* AWB badge */}
                        {order.nimbusAwb && (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-mono">
                            <Truck className="w-3 h-3" />
                            {order.nimbusAwb}
                          </span>
                        )}

                        {/* Total */}
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Total</p>
                          <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            ₹{order.pricing.total.toFixed(2)}
                          </p>
                        </div>

                        {/* Expand toggle */}
                        <button
                          onClick={() => {
                            const newExpanded = isExpanded ? null : order._id;
                            setExpandedOrder(newExpanded);
                            if (newExpanded && ["confirmed", "shipped", "delivered"].includes(order.orderStatus)) {
                              fetchLiveTracking(order._id);
                            }
                          }}
                          className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-purple-500 hover:bg-purple-50 transition-all"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ── ITEM IMAGE STRIP ── */}
                  <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center gap-2.5">
                    {order.items.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-gray-100">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1602874801006-47c1c969a405?w=200&h=200&fit=crop"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.src = "https://images.unsplash.com/photo-1602874801006-47c1c969a405?w=200&h=200&fit=crop"; }}
                        />
                      </div>
                      
                    ))}
                    {/* After the images map, add this */}
<div className="flex flex-col justify-center ml-2">
  <p className="text-sm font-semibold text-gray-800 line-clamp-1" style={{ fontFamily: "'Playfair Display', serif" }}>
    {order.items.map(i => i.name).join(", ")}
  </p>
  <p className="text-xs text-gray-400 mt-1">
    {order.items.reduce((sum, i) => sum + i.quantity, 0)} item{order.items.reduce((sum, i) => sum + i.quantity, 0) !== 1 ? "s" : ""} · {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
  </p>
</div>
                    {order.items.length > 4 && (
                      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-200 flex items-center justify-center">
                        <p className="text-purple-600 font-bold text-sm">+{order.items.length - 4}</p>
                      </div>
                    )}
                  </div>

                  {/* ── EXPANDED DETAILS ── */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 bg-gray-50/50 space-y-5">

                      {/* Order items */}
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-purple-500" />
                          Order Items
                        </h4>
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:border-purple-200 transition-colors">
                              <img
                                src={item.image || "https://images.unsplash.com/photo-1602874801006-47c1c969a405?w=200&h=200&fit=crop"}
                                alt={item.name}
                                className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                                style={{ width: '72px', height: '72px' }}
                                onError={e => { e.target.src = "https://images.unsplash.com/photo-1602874801006-47c1c969a405?w=200&h=200&fit=crop"; }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm leading-snug mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                                  {item.name}
                                </p>
                                <p className="text-xs text-purple-500 font-medium mb-2">Size: {item.size}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                                  <span className="font-bold text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pricing + Contact + Address — 3-col on lg */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                        {/* Pricing */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-purple-500" /> Price Breakdown
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-500">
                              <span>Subtotal</span>
                              <span className="font-medium text-gray-700">₹{order.pricing.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                              <span>Shipping</span>
                              <span className={`font-semibold ${order.pricing.shipping === 0 ? "text-green-600" : "text-gray-700"}`}>
                                {order.pricing.shipping === 0 ? "FREE" : `₹${order.pricing.shipping.toFixed(2)}`}
                              </span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                              <span>Tax (GST)</span>
                              <span className="font-medium text-gray-700">₹{order.pricing.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                              <span className="font-bold text-gray-900">Total</span>
                              <span className="font-bold text-base bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                ₹{order.pricing.total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Contact */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-purple-500" /> Contact Info
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p className="font-semibold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                              {order.contactInfo.firstName} {order.contactInfo.lastName}
                            </p>
                            <p className="flex items-center gap-2 text-gray-500 text-xs">
                              <Mail className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                              {order.contactInfo.email}
                            </p>
                            {order.contactInfo.phone && (
                              <p className="flex items-center gap-2 text-gray-500 text-xs">
                                <Phone className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                                {order.contactInfo.phone}
                              </p>
                            )}
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Payment</h5>
                            <div className="space-y-1.5 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Method</span>
                                <span className="font-semibold text-gray-700">
                                  {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Status</span>
                                <span className={`font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-purple-500" /> Shipping Address
                          </h4>
                          <div className="text-sm text-gray-600 space-y-0.5" style={{ fontWeight: 300 }}>
                            <p className="font-semibold text-gray-800">{order.shippingAddress.address}</p>
                            {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
                            <p>{order.shippingAddress.country}</p>
                            {order.shippingAddress.landmark && (
                              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {order.shippingAddress.landmark}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ── TRACKING ── */}
                      {(order.nimbusAwb || order.trackingNumber) && (
                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Truck className="w-4 h-4 text-purple-500" /> Tracking Information
                          </h4>

                          {/* Static info */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                            <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                              <p className="text-[10px] text-purple-400 uppercase tracking-wider font-semibold mb-1">AWB Number</p>
                              <p className="font-mono font-bold text-purple-700 text-sm">{order.nimbusAwb || order.trackingNumber}</p>
                            </div>
                            {order.nimbusCourier && (
                              <div className="bg-pink-50 rounded-xl p-3 border border-pink-100">
                                <p className="text-[10px] text-pink-400 uppercase tracking-wider font-semibold mb-1">Courier</p>
                                <p className="font-semibold text-pink-700 text-sm">{order.nimbusCourier}</p>
                              </div>
                            )}
                            {order.estimatedDelivery && (
                              <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                                <p className="text-[10px] text-green-500 uppercase tracking-wider font-semibold mb-1">Est. Delivery</p>
                                <p className="font-semibold text-green-700 text-sm">{formatDate(order.estimatedDelivery)}</p>
                              </div>
                            )}
                          </div>

                          {/* Live tracking timeline */}
                          {trackingLoading[order._id] ? (
                            <div className="flex items-center gap-2.5 text-purple-600 py-3">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm" style={{ fontWeight: 300 }}>Fetching live tracking…</span>
                            </div>
                          ) : trackingData[order._id]?.tracking?.data?.length > 0 ? (
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Live Updates</p>
                              <div className="relative">
                                {/* Vertical line */}
                                <div className="absolute left-[9px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 to-pink-200" />
                                <div className="space-y-5">
                                  {trackingData[order._id].tracking.data.map((event, idx) => (
                                    <div key={idx} className="flex gap-4 relative">
                                      <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center z-10 mt-0.5 ${
                                        idx === 0 ? "bg-gradient-to-br from-purple-600 to-pink-600 shadow-md" : "bg-gray-200"
                                      }`}>
                                        <div className={`w-2 h-2 rounded-full ${idx === 0 ? "bg-white" : "bg-gray-400"}`} />
                                      </div>
                                      <div className="flex-1">
                                        <p className={`text-sm font-semibold leading-snug ${idx === 0 ? "text-purple-700" : "text-gray-600"}`} style={{ fontFamily: "'Playfair Display', serif" }}>
                                          {event.activity || event.status || event.description}
                                        </p>
                                        {event.location && (
                                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                            <MapPin className="w-3 h-3" /> {event.location}
                                          </p>
                                        )}
                                        {(event.date || event.timestamp) && (
                                          <p className="text-xs text-gray-400 mt-0.5">
                                            {new Date(event.date || event.timestamp).toLocaleString("en-IN")}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : trackingData[order._id] ? (
                            <p className="text-sm text-gray-400 italic" style={{ fontWeight: 300 }}>No tracking updates available yet.</p>
                          ) : null}

                          {/* Refresh tracking */}
                          <button
                            onClick={() => {
                              setTrackingData(prev => { const u = { ...prev }; delete u[order._id]; return u; });
                              fetchLiveTracking(order._id);
                            }}
                            className="mt-4 flex items-center gap-1.5 text-xs text-purple-500 hover:text-purple-700 font-semibold transition-colors"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Refresh tracking
                          </button>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
};

export default OrderHistoryPage;