/**
 * Main Application Component
 * 
 * This is the root component of the application that handles:
 * - Routing configuration using react-router-dom
 * - Authentication state management
 * - Theme provider integration
 * - Protected routes via AuthGuard
 */
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthGuard } from './components/AuthGuard';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Home from './pages/Home';
import ManageProducts from './pages/catalog/ManageProducts';
import NewProduct from './pages/catalog/NewProduct';
import ManageOrders from './pages/orders/ManageOrders';
import NewOrder from './pages/orders/NewOrder';
import NewCustomer from './pages/customers/NewCustomer';
import ManageCustomers from './pages/customers/ManageCustomers';
import Profile from './pages/Profile';
import ManageDiscounts from './pages/discounts/ManageDiscounts';
import CreateDiscount from './pages/discounts/CreateDiscount';
import { useAuthStore } from './store/authStore';

const App = () => {
  // Initialize auth state on app load
  const { loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes - Wrapped in AuthGuard */}
          <Route element={<AuthGuard />}>
            <Route element={<DashboardLayout />}>
              {/* Redirect root to home */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              
              {/* Main dashboard routes */}
              <Route path="/home" element={<Home />} />
              
              {/* Catalog management */}
              <Route path="/catalog/manage-products" element={<ManageProducts />} />
              <Route path="/catalog/new-product" element={<NewProduct />} />
              
              {/* Order management */}
              <Route path="/orders/manage-orders" element={<ManageOrders />} />
              <Route path="/orders/new-order" element={<NewOrder />} />
              
              {/* Customer management */}
              <Route path="/customers/new-customer" element={<NewCustomer />} />
              <Route path="/customers/manage-customers" element={<ManageCustomers />} />
              
              {/* Discount management */}
              <Route path="/discounts/manage" element={<ManageDiscounts />} />
              <Route path="/discounts/create" element={<CreateDiscount />} />
              
              {/* User profile */}
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;