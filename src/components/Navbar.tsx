/**
 * Navigation Bar Component
 * 
 * Top navigation bar that provides:
 * - Global search functionality
 * - Theme toggle (light/dark)
 * - Messaging and notification access
 * - User profile menu with authentication options
 * 
 * Features:
 * - Responsive design
 * - Dark mode support
 * - Dropdown menu for profile actions
 */
import React, { useState } from 'react';
import { Search, Sun, Moon, MessageCircle, Bell, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Profile from '../pages/Profile';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Mock user data - replace with actual user data in production
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  };

  // Dynamic class names based on theme
  const buttonClassName = `p-2 rounded-md hover:bg-shopify-surface ${
    theme === 'dark' 
      ? 'border-gray-800' 
      : 'text-shopify-text-secondary'
  }`;

  return (
    <nav className={`fixed top-0 left-64 right-0 h-16 ${
      theme === 'dark' 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-shopify-border'
    } border-b px-4 flex items-center justify-between z-10`}>
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-shopify-text-secondary" />
          <input
            type="text"
            placeholder="Search..."
            className={`w-full pl-10 pr-4 py-2 border rounded-md ${
              theme === 'dark' 
                ? 'bg-gray-900 border-gray-800 placeholder-gray-500'
                : 'bg-shopify-surface border-shopify-border placeholder-shopify-text-secondary focus:border-shopify-focus focus:ring-1 focus:ring-shopify-focus'
            }`}
          />
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={buttonClassName}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        
        {/* Messages */}
        <button className={buttonClassName} aria-label="Messages">
          <MessageCircle className="h-5 w-5" />
        </button>
        
        {/* Notifications */}
        <button className={buttonClassName} aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </button>

        {/* Profile Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`flex items-center space-x-3 p-2 rounded-md ${
              theme === 'dark' 
                ? 'hover:bg-gray-800' 
                : 'hover:bg-shopify-surface'
            }`}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-full"
            />
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium">{profile?.name}</p>
              <p className="text-xs text-shopify-text-secondary">{profile?.email}</p>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            } ring-1 ring-black ring-opacity-5`}>
              <div className="py-1">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowProfileMenu(false);
                  }}
                  className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-800' 
                      : 'hover:bg-shopify-surface text-shopify-text'
                  }`}
                >
                  <User className="inline-block w-4 h-4 mr-2" />
                  Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;