import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashBoard";
import HomePage from "./components/HomePage";
import AddProduct from "./components/AddProduct";
import ProductsPage from "./components/ProductsPage";
import CartPage from "./components/CartPage";
import OtpPage from "./components/OtpPage";
import EmailOtpPage from "./components/EmailOtpPage";
import OtpVerifyPage from "./components/OtpVerifyPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentPage from "./components/PaymentPage"
import OrdersPage from "./components/OrdersPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Dashboard */}
        <Route path="/user" element={<UserDashboard />} />

        {/* Protected Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Product Related */}
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Orders */}
        <Route path="/orders" element={<OrdersPage />} />

        {/* OTP Flow */}
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/register-email" element={<EmailOtpPage />} />
        <Route path="/verify-otp" element={<OtpVerifyPage />} />

        {/* Payment */}
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
