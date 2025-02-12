import React, { useState } from 'react';
import { ExternalLink, Edit, Trash2, ArrowLeft, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const products = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80',
    title: 'Premium Headphones',
    price: 199.99,
    stock: 45,
    status: 'Live',
    sku: 'HDX-100'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&q=80',
    title: 'Wireless Mouse',
    price: 49.99,
    stock: 32,
    status: 'Saved',
    sku: 'WM-200'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&q=80',
    title: 'Mechanical Keyboard',
    price: 159.99,
    stock: 15,
    status: 'Live',
    sku: 'KB-300'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&q=80',
    title: 'Gaming Monitor',
    price: 299.99,
    stock: 8,
    status: 'Saved',
    sku: 'GM-400'
  }
];

const ManageProducts = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`border ${
      theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
    }`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className={`p-2 mr-4 border ${
              theme === 'dark' ? 'border-gray-800 hover:bg-gray-900' : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">Manage Products</h2>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border ${
                  theme === 'dark' 
                    ? 'bg-gray-900 border-gray-800' 
                    : 'bg-white border-gray-200'
                }`}
              />
            </div>
          </div>
          <div className="flex space-x-4 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-2 border ${
                theme === 'dark' 
                  ? 'bg-gray-900 border-gray-800' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <option value="">All Status</option>
              <option value="Live">Live</option>
              <option value="Saved">Saved</option>
            </select>
            <button 
              onClick={() => navigate('/catalog/new-product')}
              className={`px-4 py-2 border ${
                theme === 'dark' 
                  ? 'border-gray-800 hover:bg-gray-900' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              Add New Product
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
          } border-b ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'
          }`}>
            {filteredProducts.map((product) => (
              <tr key={product.id} className={
                theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-50'
              }>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      className="h-16 w-16 object-cover border dark:border-gray-800"
                      src={product.image}
                      alt={product.title}
                    />
                    <div className="ml-4">
                      <div className="font-medium">{product.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {product.sku}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span className={`${product.stock < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                    {product.stock} units
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-medium border ${
                    product.status === 'Live'
                      ? 'border-green-200 text-green-500'
                      : 'border-yellow-200 text-yellow-500'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <button 
                      className={`p-2 border ${
                        theme === 'dark' ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-100'
                      }`}
                      title="View Product"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button 
                      className={`p-2 border ${
                        theme === 'dark' ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-100'
                      }`}
                      title="Edit Product"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      className={`p-2 border ${
                        theme === 'dark' ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-100'
                      }`}
                      title="Delete Product"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;