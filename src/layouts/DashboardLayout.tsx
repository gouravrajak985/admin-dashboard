/**
 * Dashboard Layout Component
 * 
 * Main layout wrapper for the dashboard that provides:
 * - Consistent layout structure across dashboard pages
 * - Sidebar navigation
 * - Top navigation bar
 * - Theme-aware styling
 * - Responsive design
 * 
 * This component wraps all authenticated dashboard routes and provides
 * the common UI elements and layout structure.
 */
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard } from 'lucide-react';

const DashboardLayout = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-shopify-surface text-shopify-text'
    }`}>
      {/* Top Navigation */}
      <Navbar />

      <div className="flex">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-6 ml-64 mt-16">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <LayoutDashboard className="h-8 w-8 mr-2 text-shopify-green" />
              <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>
          </div>

          {/* Page Content - Rendered via Outlet */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;