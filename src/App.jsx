// App.js
import { useLocation, Routes, Route, matchPath } from "react-router-dom";
import { useEffect } from "react";

// Import Components
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

// Import Pages
import HomePage from './Pages/HomePage';
import Login from './Pages/LoginPage';
import Register from './Pages/RegisterPage';
import Products from './Pages/ProductPage';
import ProductDetail from './Pages/ProductDetail';

// import Wishlist from './pages/Wishlist';
import About from './Pages/AboutUsPage';
import Contact from './Pages/ContactUs';
// import Profile from './pages/Profile';
import Orders from './Pages/OrderHistory';
import OrderCheckout from './Pages/OrderCheckoutPage';
import CartSidebar from "./Pages/CartPage";
import OrderCheckoutPage from "./Pages/OrderCheckoutPage";
import OrderHistoryPage from "./Pages/OrderHistory";
import Categories from "./Pages/CategoryPage";
import WishlistPage from "./Pages/WishlistPage";
import PrivacyPolicy from "./Pages/Privacy_Policy";
import TermsAndConditions from "./Pages/Terms_Condition_Page";
import ProfilePage from "./Pages/ProfilePage";
import AdminLogin from "./Pages/Admin/AdminLogin";
import AdminRoute from "./Components/AdminRoute";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminProducts from "./Pages/Admin/AdminProduct";
import AdminOrders from "./Pages/Admin/AdminOrders";
import AdminUsers from "./Pages/Admin/AdminUser";
import AdminSettings from "./Pages/Admin/AdminSetting";
import AdminRegister from "./Pages/Admin/AdminRegister";
import AdminOrderDetail from "./Pages/Admin/AdminOrderDetails";
import AdminLayout from "./Pages/Admin/AdminSidebar";

// ScrollToTop Component
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}


function App() {
  const location = useLocation();

  // Paths where navbar/footer should be hidden
  const hideLayoutPaths = [
    "/admin"
  ];

  // Check if current path matches any of the patterns
  const hideLayout = hideLayoutPaths.some(path => {
    const match = matchPath({ path, end: false }, location.pathname);
    return match !== null;
  });

  return (
    <>
      <ScrollToTop />
      
      {/* Conditionally render Navbar */}
      {!hideLayout && <Navbar />}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartSidebar />} />
        <Route path="/checkout" element={<OrderCheckoutPage />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/term" element={<TermsAndConditions/>}/>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/order-success" element={<OrderHistoryPage />} />


        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={
            <AdminRegister />

        } />
        <Route path="/admin" element={
  <AdminRoute>
    <AdminLayout />
  </AdminRoute>
}>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="products" element={<AdminProducts />} />
  <Route path="orders" element={<AdminOrders />} />
  <Route path="orders/:id" element={<AdminOrderDetail/>} />
  <Route path="users" element={<AdminUsers />} />
  <Route path="settings" element={<AdminSettings />} />
</Route>
        {/* 404 Route - should be last */}
        <Route path="*" element={
          <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-white mb-4">404</h1>
              <p className="text-gray-400 text-xl">Page Not Found</p>
            </div>
          </div>
        } />
      </Routes>

      {/* Conditionally render Footer */}
      {!hideLayout && <Footer />}
    </>
  );
}

export default App;