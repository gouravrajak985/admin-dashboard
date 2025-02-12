import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import ManageProducts from './pages/catalog/ManageProducts';
import NewProduct from './pages/catalog/NewProduct';
import ManageOrders from './pages/orders/ManageOrders';
import NewOrder from './pages/orders/NewOrder';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/catalog/manage-products" element={<ManageProducts />} />
            <Route path="/catalog/new-product" element={<NewProduct />} />
            <Route path="/orders/manage" element={<ManageOrders />} />
            <Route path="/orders/new" element={<NewOrder />} />
          </Routes>
        </DashboardLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;