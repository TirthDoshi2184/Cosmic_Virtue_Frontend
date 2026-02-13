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
  AlertCircle,
  Loader2,
  Eye,
  Download,
  RefreshCw,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Box,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [emailVerified, setEmailVerified] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [trackingData, setTrackingData] = useState({});
const [trackingLoading, setTrackingLoading] = useState({});

  const API_BASE_URL = "http://localhost:3000";

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  const isUserLoggedIn = () => {
    return !!localStorage.getItem("userToken");
  };

  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.id || user._id;
    } catch (error) {
      return null;
    }
  };

  const getUserToken = () => {
    return localStorage.getItem("userToken");
  };

  const getSavedEmail = () => {
    return localStorage.getItem("userEmail");
  };

  // ============================================
  // FETCH ORDERS
  // ============================================
  const fetchOrders = async () => {
    setLoading(true);
    try {
      let response;

      if (isUserLoggedIn()) {
        // Fetch by userId for logged-in users
        const userId = getUserId();
        const token = getUserToken();

        response = await fetch(`${API_BASE_URL}/checkout/orders/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Fetch by email for guest users
        const email = getSavedEmail() || userEmail;

        if (!email) {
          setShowEmailInput(true);
          setLoading(false);
          return;
        }

        response = await fetch(`${API_BASE_URL}/checkout/orders/email/${email}`);
      }

      const data = await response.json();

      if (data.success) {
        setOrders(data.data || []);
        setEmailVerified(true);
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
  // Don't re-fetch if already loaded
  if (trackingData[orderId]) return;

  setTrackingLoading(prev => ({ ...prev, [orderId]: true }));

  try {
    const response = await fetch(`${API_BASE_URL}/checkout/orders/${orderId}/track`);
    const data = await response.json();

    if (data.success) {
      setTrackingData(prev => ({ ...prev, [orderId]: data }));
    }
  } catch (error) {
    console.error('Tracking fetch failed:', error);
  } finally {
    setTrackingLoading(prev => ({ ...prev, [orderId]: false }));
  }
};

  // ============================================
  // LOAD ORDERS ON MOUNT
  // ============================================
  useEffect(() => {
    const savedEmail = getSavedEmail();
    if (savedEmail) {
      setUserEmail(savedEmail);
      setEmailVerified(true);
    }

    if (isUserLoggedIn() || savedEmail) {
      fetchOrders();
    } else {
      setShowEmailInput(true);
      setLoading(false);
    }
  }, []);

  // ============================================
  // EMAIL VERIFICATION FOR GUEST USERS
  // ============================================
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (userEmail && /\S+@\S+\.\S+/.test(userEmail)) {
      localStorage.setItem("userEmail", userEmail);
      fetchOrders();
    } else {
      alert("Please enter a valid email address");
    }
  };

  // ============================================
  // STATUS HELPERS
  // ============================================
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      processing: "bg-blue-100 text-blue-800 border-blue-300",
      shipped: "bg-purple-100 text-purple-800 border-purple-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      processing: <Package className="w-4 h-4" />,
      shipped: <Truck className="w-4 h-4" />,
      delivered: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  const getPaymentStatusColor = (status) => {
    return status === "completed"
      ? "text-green-600"
      : status === "failed"
        ? "text-red-600"
        : "text-yellow-600";
  };

  // ============================================
  // FILTER ORDERS
  // ============================================
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.orderStatus === filterStatus);

  // ============================================
  // RENDER ORDER NUMBER
  // ============================================
  const getOrderNumber = (orderId) => {
    return orderId.toString().slice(-8).toUpperCase();
  };

  // ============================================
  // FORMAT DATE
  // ============================================
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ============================================
  // RENDER LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER EMAIL INPUT (GUEST USERS)
  // ============================================
  if (showEmailInput && !emailVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-purple-100">
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
              <Mail className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              View Your Orders
            </h2>
            <p className="text-gray-600">
              Enter your email to access your order history
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View Orders
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-purple-500 hover:text-purple-600 transition-all duration-300"
            >
              Back to Home
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER EMPTY STATE
  // ============================================
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="p-8 bg-white rounded-full inline-block mb-6 shadow-lg">
            <ShoppingBag className="w-20 h-20 text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            No Orders Yet
          </h2>
          <p className="text-gray-600 mb-8">
            You haven't placed any orders yet. Start shopping to see your order
            history here!
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Shopping
            </button>
            {!isUserLoggedIn() && (
              <button
                onClick={() => {
                  localStorage.removeItem("userEmail");
                  setEmailVerified(false);
                  setShowEmailInput(true);
                }}
                className="w-full px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-purple-500 hover:text-purple-600 transition-all duration-300"
              >
                Use Different Email
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
                Order History
              </h1>
              <p className="text-gray-600">
                {isUserLoggedIn()
                  ? "Track and manage your orders"
                  : `Orders for ${userEmail}`}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchOrders}
                className="px-4 py-2 border-2 border-purple-500 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all duration-300 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>

              {!isUserLoggedIn() && (
                <button
                  onClick={() => {
                    localStorage.removeItem("userEmail");
                    setEmailVerified(false);
                    setShowEmailInput(true);
                    setOrders([]);
                  }}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-purple-500 hover:text-purple-600 transition-all duration-300"
                >
                  Change Email
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-6 flex flex-wrap gap-2">
          {[
            { value: "all", label: "All Orders", icon: Package },
            { value: "pending", label: "Pending", icon: Clock },
            { value: "processing", label: "Processing", icon: Box },
            { value: "shipped", label: "Shipped", icon: Truck },
            { value: "delivered", label: "Delivered", icon: CheckCircle },
            { value: "cancelled", label: "Cancelled", icon: XCircle },
          ].map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  filterStatus === filter.value
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{filter.label}</span>
                <span className="sm:hidden">{filter.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Orders Count */}
        <div className="mb-6 text-center sm:text-left">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-bold text-purple-600">
              {filteredOrders.length}
            </span>{" "}
            {filterStatus === "all" ? "" : filterStatus} order
            {filteredOrders.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Order Header */}
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        Order #{getOrderNumber(order._id)}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(order.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ShoppingBag className="w-4 h-4" />
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Order Status */}
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 border ${getStatusColor(order.orderStatus)}`}
                    >
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus.charAt(0).toUpperCase() +
                        order.orderStatus.slice(1)}
                    </span>
                    {/* AWB Quick Badge */}
{order.nimbusAwb && (
  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-mono flex items-center gap-1">
    <Truck className="w-3 h-3" />
    {order.nimbusAwb}
  </span>
)}

                    {/* Total */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ₹{order.pricing.total.toFixed(2)}
                      </p>
                    </div>

                    {/* Expand Button */}
                    <button
                      onClick={() => {
  const newExpanded = expandedOrder === order._id ? null : order._id;
  setExpandedOrder(newExpanded);
  // Fetch live tracking when expanding a shipped/confirmed order
  if (newExpanded && ['confirmed', 'shipped', 'delivered'].includes(order.orderStatus)) {
    fetchLiveTracking(order._id);
  }
}}
                      className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                      {expandedOrder === order._id ? (
                        <ChevronUp className="w-6 h-6 text-purple-600" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-purple-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {order.items.slice(0, 4).map((item, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200"
                    >
                      <img
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1602874801006-47c1c969a405?w=200&h=200&fit=crop"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1602874801006-47c1c969a405?w=200&h=200&fit=crop";
                        }}
                      />
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-purple-100 border-2 border-purple-300 flex items-center justify-center">
                      <p className="text-purple-600 font-bold">
                        +{order.items.length - 4}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Order Details */}
              {expandedOrder === order._id && (
                <div className="p-6 bg-gray-50 space-y-6">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-purple-600" />
                      Order Items
                    </h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-4 bg-white p-4 rounded-lg border border-gray-200"
                        >
                          <img
                            src={
                              item.image ||
                              "https://images.unsplash.com/photo-1602874801006-47c1c969a405?w=200&h=200&fit=crop"
                            }
                            alt={item.name}
                            className="w-20 h-20 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1602874801006-47c1c969a405?w=200&h=200&fit=crop";
                            }}
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Size: {item.size}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity}
                              </p>
                              <p className="font-bold text-purple-600">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-purple-600" />
                      Price Breakdown
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>₹{order.pricing.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>
                          {order.pricing.shipping === 0 ? (
                            <span className="text-green-600 font-semibold">
                              FREE
                            </span>
                          ) : (
                            `₹${order.pricing.shipping.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax (GST)</span>
                        <span>₹{order.pricing.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="font-bold text-gray-800">Total</span>
                        <span className="text-xl font-bold text-purple-600">
                          ₹{order.pricing.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Address Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Contact Information */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-purple-600" />
                        Contact Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-800">
                          <span className="font-semibold">Name:</span>{" "}
                          {order.contactInfo.firstName}{" "}
                          {order.contactInfo.lastName}
                        </p>
                        <p className="text-gray-800 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          {order.contactInfo.email}
                        </p>
                        {order.contactInfo.phone && (
                          <p className="text-gray-800 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            {order.contactInfo.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-purple-600" />
                        Shipping Address
                      </h4>
                      <div className="text-sm text-gray-800">
                        <p>{order.shippingAddress.address}</p>
                        {order.shippingAddress.apartment && (
                          <p>{order.shippingAddress.apartment}</p>
                        )}
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state} -{" "}
                          {order.shippingAddress.pincode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                        {order.shippingAddress.landmark && (
                          <p className="text-gray-600 mt-1">
                            Landmark: {order.shippingAddress.landmark}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-purple-600" />
                      Payment Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-semibold text-gray-800">
                          {order.paymentMethod === "cod"
                            ? "Cash on Delivery"
                            : "Online Payment"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Status:</span>
                        <span
                          className={`font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}
                        >
                          {order.paymentStatus.charAt(0).toUpperCase() +
                            order.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tracking Info — NimbusPost Live Tracking */}
{(order.nimbusAwb || order.trackingNumber) && (
  <div className="bg-white p-4 rounded-lg border border-gray-200">
    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
      <Truck className="w-5 h-5 text-purple-600" />
      Tracking Information
    </h4>

    {/* Static AWB Info */}
    <div className="space-y-2 text-sm mb-4">
      <div className="flex justify-between">
        <span className="text-gray-600">AWB Number:</span>
        <span className="font-semibold text-gray-800 font-mono">
          {order.nimbusAwb || order.trackingNumber}
        </span>
      </div>

      {order.nimbusCourier && (
        <div className="flex justify-between">
          <span className="text-gray-600">Courier Partner:</span>
          <span className="font-semibold text-gray-800">
            {order.nimbusCourier}
          </span>
        </div>
      )}

      {order.estimatedDelivery && (
        <div className="flex justify-between">
          <span className="text-gray-600">Estimated Delivery:</span>
          <span className="font-semibold text-gray-800">
            {formatDate(order.estimatedDelivery)}
          </span>
        </div>
      )}
    </div>

    {/* Live Tracking Timeline */}
    {trackingLoading[order._id] ? (
      <div className="flex items-center gap-2 text-purple-600 py-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Fetching live tracking...</span>
      </div>

    ) : trackingData[order._id]?.tracking?.data?.length > 0 ? (
      <div className="mt-3">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
          Live Updates
        </p>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-purple-100" />

          <div className="space-y-4">
            {trackingData[order._id].tracking.data.map((event, idx) => (
              <div key={idx} className="flex gap-4 relative">
                {/* Dot */}
                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center z-10 ${
                  idx === 0
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-gray-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    idx === 0 ? 'bg-white' : 'bg-gray-400'
                  }`} />
                </div>

                <div className="flex-1 pb-1">
                  <p className={`text-sm font-semibold ${
                    idx === 0 ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    {event.activity || event.status || event.description}
                  </p>
                  {event.location && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </p>
                  )}
                  {(event.date || event.timestamp) && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(event.date || event.timestamp).toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    ) : trackingData[order._id] && (
      <p className="text-sm text-gray-500 italic">
        No tracking updates available yet.
      </p>
    )}

    {/* Refresh tracking button */}
    <button
      onClick={() => {
        // Clear cached data to force re-fetch
        setTrackingData(prev => {
          const updated = { ...prev };
          delete updated[order._id];
          return updated;
        });
        fetchLiveTracking(order._id);
      }}
      className="mt-3 text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors"
    >
      <RefreshCw className="w-3 h-3" />
      Refresh tracking
    </button>
  </div>
)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;