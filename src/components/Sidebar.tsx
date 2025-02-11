import React, { useState } from 'react';
import { ChevronDown, LayoutDashboard, ShoppingBag, Package, Users, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutDialog from './LogoutDialog';

const MenuItem = ({ 
  icon: Icon, 
  label, 
  subItems = [], 
  isActive = false,
  path,
  subItemPaths = [],
  isOpen,
  onToggle,
  id
}: { 
  icon: React.ElementType;
  label: string;
  subItems?: string[];
  isActive?: boolean;
  path?: string;
  subItemPaths?: string[];
  isOpen?: boolean;
  onToggle?: (id: string) => void;
  id: string;
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (subItems.length > 0) {
      onToggle?.(id);
    } else if (path) {
      navigate(path);
    }
  };

  const isSubItemActive = (path: string) => location.pathname === path;

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full flex items-center px-4 py-3 text-sm border-l-2 ${
          isActive 
            ? `${theme === 'dark' ? 'border-white bg-gray-900' : 'border-black bg-gray-100'} ` 
            : `border-transparent ${theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-50'}`
        }`}
      >
        <Icon className="h-5 w-5 mr-3" />
        <span className="flex-1 text-left">{label}</span>
        {subItems.length > 0 && (
          <ChevronDown className={`h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>
      {isOpen && subItems.length > 0 && (
        <div className="ml-8 border-l border-gray-200 dark:border-gray-700">
          {subItems.map((item, index) => (
            <button
              key={item}
              onClick={() => navigate(subItemPaths[index])}
              className={`w-full text-left px-4 py-2 text-sm ${
                isSubItemActive(subItemPaths[index])
                  ? theme === 'dark'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-black'
                  : theme === 'dark'
                    ? 'hover:bg-gray-900'
                    : 'hover:bg-gray-50'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  
  const handleMenuToggle = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
    setIsLogoutDialogOpen(false);
  };

  return (
    <>
      <aside className={`fixed left-0 top-0 w-64 h-screen border-r ${
        theme === 'dark' 
          ? 'bg-black border-gray-800' 
          : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>

        {/* Navigation */}
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <nav className="flex-1 py-4">
            <MenuItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              isActive={location.pathname === '/dashboard'}
              path="/dashboard"
              id="dashboard"
              onToggle={handleMenuToggle}
              isOpen={openMenuId === 'dashboard'}
            />
            <MenuItem 
              icon={Package} 
              label="Catalog" 
              subItems={['Manage Products', 'New Product']}
              subItemPaths={['/catalog/manage-products', '/catalog/new-product']}
              isActive={location.pathname.startsWith('/catalog')}
              id="catalog"
              onToggle={handleMenuToggle}
              isOpen={openMenuId === 'catalog'}
            />
            <MenuItem 
              icon={ShoppingBag} 
              label="Orders" 
              subItems={['Manage Orders', 'Add Order']}
              subItemPaths={['/orders/manage', '/orders/new']}
              isActive={location.pathname.startsWith('/orders')}
              id="orders"
              onToggle={handleMenuToggle}
              isOpen={openMenuId === 'orders'}
            />
            <MenuItem 
              icon={Users} 
              label="Customers" 
              subItems={['Manage Customers', 'Add Customer']}
              subItemPaths={['/customers/manage', '/customers/new']}
              isActive={location.pathname.startsWith('/customers')}
              id="customers"
              onToggle={handleMenuToggle}
              isOpen={openMenuId === 'customers'}
            />
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setIsLogoutDialogOpen(true)}
              className={`w-full flex items-center px-4 py-3 text-sm border ${
                theme === 'dark'
                  ? 'border-gray-800 hover:bg-gray-900'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Sidebar;