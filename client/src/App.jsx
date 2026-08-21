import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AboutPage from './pages/AboutPage';
import AdminDiscounts from './pages/AdminDiscounts';
import AdminCsvPage from './pages/AdminCsvPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import ShippingReturnsPage from './pages/ShippingReturnsPage';
import FragranceFinderPage from './pages/FragranceFinderPage';
import OurStoryPage from './pages/OurStoryPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerificationPage from './pages/VerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminPanel from './pages/AdminPanel';
import SessionTimeoutWarning from './components/SessionTimeoutWarning';
import { useSessionTimeout } from './hooks/useSessionTimeout';
import ProtectedRoute from './components/ProtectedRoute';
import authService from './services/authService';

function AppContent() {
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  const handleWarning = (show, seconds = 0) => {
    setShowTimeoutWarning(show);
    if (seconds) {
      setSecondsRemaining(seconds);
    }
  };

  const handleExtendSession = () => {
    setShowTimeoutWarning(false);
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  // Initialize session timeout
  useSessionTimeout(handleWarning, handleExtendSession);

  return (
    <>
      <SessionTimeoutWarning
        isVisible={showTimeoutWarning}
        secondsRemaining={secondsRemaining}
        onExtend={handleExtendSession}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:orderNumber" element={<OrderDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/our-story" element={<OurStoryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
        <Route path="/fragrance-finder" element={<FragranceFinderPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* Admin Routes - Require ADMIN role */}
        <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} requiredRole="ADMIN" />} />
        <Route path="/admin/orders" element={<ProtectedRoute element={<AdminOrdersPage />} requiredRole="ADMIN" />} />
        <Route path="/admin/discounts" element={<ProtectedRoute element={<AdminDiscounts />} requiredRole="ADMIN" />} />
        <Route path="/admin/bulkupload" element={<ProtectedRoute element={<AdminCsvPage />} requiredRole="ADMIN" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
