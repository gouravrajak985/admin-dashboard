import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard } from 'lucide-react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64 mt-16">
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <LayoutDashboard className="h-8 w-8 mr-2" />
              <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>
            {/* <p className="text-sm text-gray-500">Developed by Avirrav</p> */}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
