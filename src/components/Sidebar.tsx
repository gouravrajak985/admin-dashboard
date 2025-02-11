import React, { useState } from 'react';
import { ChevronDown, LayoutDashboard, ShoppingBag, Package, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

const MenuItem = ({ 
  icon: Icon, 
  label, 
  subItems = [], 
  isActive = false,
  path,
  subItemPaths = []
}: { 
  icon: React.ElementType;
  label: string;
  subItems?: string[];
  isActive?: boolean;
  path?: string;
  subItemPaths?: string[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (subItems.length > 0) {
      setIsOpen(!isOpen);
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
  
  return (
    <aside className={`fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] overflow-y-auto border-r ${
      theme === 'dark' 
        ? 'bg-black border-gray-800' 
        : 'bg-white border-gray-200'
    }`}>
      <nav className="py-4">
        <MenuItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          isActive={location.pathname === '/dashboard'}
          path="/dashboard"
        />
        <MenuItem 
          icon={Package} 
          label="Catalog" 
          subItems={['Manage Products', 'New Product']}
          subItemPaths={['/catalog/manage-products', '/catalog/new-product']}
          isActive={location.pathname.startsWith('/catalog')}
        />
        <MenuItem 
          icon={ShoppingBag} 
          label="Orders" 
          subItems={['Manage Orders', 'Add Order']}
          subItemPaths={['/orders/manage', '/orders/new']}
          isActive={location.pathname.startsWith('/orders')}
        />
        <MenuItem 
          icon={Users} 
          label="Customers" 
          subItems={['Manage Customers', 'Add Customer']}
          subItemPaths={['/customers/manage', '/customers/new']}
          isActive={location.pathname.startsWith('/customers')}
        />
      </nav>
    </aside>
  );
};

export default Sidebar;