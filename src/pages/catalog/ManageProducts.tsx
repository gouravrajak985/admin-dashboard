import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ExternalLink, Edit, Trash2, ArrowLeft, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../../store/productStore';
import type { Product } from '../../types/database';

const getStatusColor = (status: Product['status']) => {
  return status === 'Live' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-yellow-100 text-yellow-800';
};

const ManageProducts = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { products, isLoading, error, fetchProducts, updateProduct, deleteProduct } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Live' | 'Saved' | ''>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditedProduct({ ...product });
  };

  const handleUpdateProduct = async () => {
    if (editedProduct) {
      try {
        await updateProduct(editedProduct.id, {
          title: editedProduct.title,
          description: editedProduct.description,
          price: editedProduct.price,
          stock: editedProduct.stock,
          status: editedProduct.status,
          sku: editedProduct.sku,
          category: editedProduct.category,
          brand: editedProduct.brand,
          dimensions: editedProduct.dimensions,
          weight: editedProduct.weight
        });
        setSelectedProduct(null);
        setEditedProduct(null);
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const inputClassName = `w-full p-2 border rounded-md ${
    theme === 'dark'
      ? 'bg-gray-900 border-gray-800'
      : 'bg-white border-shopify-border'
  }`;

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    const matchesStatus = !statusFilter || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-shopify-green border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading products: {error}
      </div>
    );
  }

  return (
    <div className={`border rounded-lg ${
      theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-shopify-border'
    }`}>
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/50">
          <div className={`relative max-w-4xl w-full mx-4 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          } rounded-lg shadow-xl`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Edit Product</h2>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setEditedProduct(null);
                  }}
                  className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={editedProduct?.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80'}
                    alt={editedProduct?.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Title</label>
                    <input
                      type="text"
                      value={editedProduct?.title}
                      onChange={(e) => setEditedProduct(prev => prev ? { ...prev, title: e.target.value } : null)}
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">SKU</label>
                    <input
                      type="text"
                      value={editedProduct?.sku}
                      onChange={(e) => setEditedProduct(prev => prev ? { ...prev, sku: e.target.value } : null)}
                      className={inputClassName}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Price</label>
                      <input
                        type="number"
                        value={editedProduct?.price}
                        onChange={(e) => setEditedProduct(prev => prev ? { ...prev, price: parseFloat(e.target.value) } : null)}
                        className={inputClassName}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Stock</label>
                      <input
                        type="number"
                        value={editedProduct?.stock}
                        onChange={(e) => setEditedProduct(prev => prev ? { ...prev, stock: parseInt(e.target.value) } : null)}
                        className={inputClassName}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={editedProduct?.status}
                      onChange={(e) => setEditedProduct(prev => prev ? { ...prev, status: e.target.value as Product['status'] } : null)}
                      className={inputClassName}
                    >
                      <option value="Live">Live</option>
                      <option value="Saved">Saved</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={editedProduct?.description}
                  onChange={(e) => setEditedProduct(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className={`${inputClassName} h-32`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    type="text"
                    value={editedProduct?.category}
                    onChange={(e) => setEditedProduct(prev => prev ? { ...prev, category: e.target.value } : null)}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Brand</label>
                  <input
                    type="text"
                    value={editedProduct?.brand}
                    onChange={(e) => setEditedProduct(prev => prev ? { ...prev, brand: e.target.value } : null)}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={editedProduct?.dimensions}
                    onChange={(e) => setEditedProduct(prev => prev ? { ...prev, dimensions: e.target.value } : null)}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight</label>
                  <input
                    type="text"
                    value={editedProduct?.weight}
                    onChange={(e) => setEditedProduct(prev => prev ? { ...prev, weight: e.target.value } : null)}
                    className={inputClassName}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setEditedProduct(null);
                  }}
                  className={`px-4 py-2 border rounded-md ${
                    theme === 'dark'
                      ? 'border-gray-800 hover:bg-gray-800'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProduct}
                  className="px-4 py-2 bg-shopify-green text-white rounded-md hover:bg-shopify-green-dark"
                >
                  Update Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 border-b border-shopify-border dark:border-gray-800">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/home')}
            className={`p-2 mr-4 border rounded-md ${
              theme === 'dark' ? 'border-gray-800 hover:bg-gray-900' : 'border-shopify-border hover:bg-shopify-surface'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">Manage Products</h2>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-shopify-text-secondary" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                  theme === 'dark' 
                    ? 'bg-gray-900 border-gray-800' 
                    : 'bg-white border-shopify-border'
                }`}
              />
            </div>
          </div>
          <div className="flex space-x-4 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'Live' | 'Saved' | '')}
              className={`px-4 py-2 border rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-900 border-gray-800' 
                  : 'bg-white border-shopify-border'
              }`}
            >
              <option value="">All Status</option>
              <option value="Live">Live</option>
              <option value="Saved">Saved</option>
            </select>
            <button 
              onClick={() => navigate('/catalog/new-product')}
              className="px-4 py-2 bg-shopify-green text-white rounded-md hover:bg-shopify-green-dark"
            >
              Add New Product
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${
            theme === 'dark' ? 'bg-gray-900' : 'bg-shopify-surface'
          } border-b ${
            theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
          }`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            theme === 'dark' ? 'divide-gray-800' : 'divide-shopify-border'
          }`}>
            {filteredProducts.map((product) => (
              <tr key={product.id} className={
                theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-shopify-surface'
              }>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      className="h-16 w-16 object-cover rounded-md border dark:border-gray-800"
                      src={product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80'}
                      alt={product.title}
                    />
                    <div className="ml-4">
                      <div className="font-medium">{product.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-shopify-text-secondary">
                  {product.sku}
                </td>
                <td className="px-6 py-4 text-shopify-text-secondary">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span className={`${product.stock < 10 ? 'text-red-500' : 'text-shopify-text-secondary'}`}>
                    {product.stock} units
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <button 
                      className={`p-2 border rounded-md ${
                        theme === 'dark' ? 'border-gray-800 hover:bg-gray-800' : 'border-shopify-border hover:bg-shopify-surface'
                      }`}
                      title="View Product"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleEditClick(product)}
                      className={`p-2 border rounded-md ${
                        theme === 'dark' ? 'border-gray-800 hover:bg-gray-800' : 'border-shopify-border hover:bg-shopify-surface'
                      }`}
                      title="Edit Product"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className={`p-2 border rounded-md ${
                        theme === 'dark' ? 'border-gray-800 hover:bg-gray-800' : 'border-shopify-border hover:bg-shopify-surface'
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