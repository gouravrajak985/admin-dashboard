import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
}

const StatCard = ({ title, value, change, isPositive, icon: Icon }: StatCardProps) => {
  const { theme } = useTheme();
  
  return (
    <div className={`p-6 border ${
      theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
        </div>
        <div className={`p-3 border ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <Icon className="h-6 w-6 text-gray-500" />
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </span>
        <span className="ml-2 text-sm text-gray-500">from last month</span>
      </div>
    </div>
  );
};

export default StatCard;
