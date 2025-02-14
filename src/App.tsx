import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './layouts/DashboardLayout';
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

function App() {
  return (
    <ThemeProvider>
      <Router>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/catalog/manage-products" element={<ManageProducts />} />
            <Route path="/catalog/new-product" element={<NewProduct />} />
            <Route path="/orders/manage-orders" element={<ManageOrders />} />
            <Route path="/orders/new-order" element={<NewOrder />} />
            <Route path="/customers/new-customer" element={<NewCustomer />} />
            <Route path="/customers/manage-customers" element={<ManageCustomers />} />
            <Route path="/discounts/manage" element={<ManageDiscounts />} />
            <Route path="/discounts/create" element={<CreateDiscount />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </DashboardLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;