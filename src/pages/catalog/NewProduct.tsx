import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Upload, X, Plus } from 'lucide-react';

interface Tax {
  id: string;
  name: string;
  percentage: number;
}

const NewProduct = () => {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [newTaxName, setNewTaxName] = useState('');
  const [newTaxPercentage, setNewTaxPercentage] = useState('');
  const [stock, setStock] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [finalPrice, setFinalPrice] = useState(0);

  useEffect(() => {
    const basePrice = parseFloat(price) || 0;
    const taxAmount = taxes.reduce((acc, tax) => {
      return acc + (basePrice * (tax.percentage / 100));
    }, 0);
    setFinalPrice(basePrice + taxAmount);
  }, [price, taxes]);

  const handleAddTax = () => {
    if (newTaxName && newTaxPercentage) {
      setTaxes([
        ...taxes,
        {
          id: Date.now().toString(),
          name: newTaxName,
          percentage: parseFloat(newTaxPercentage)
        }
      ]);
      setNewTaxName('');
      setNewTaxPercentage('');
    }
  };

  const handleRemoveTax = (id: string) => {
    setTaxes(taxes.filter(tax => tax.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (status: 'draft' | 'published') => {
    // Handle save logic here
    console.log({
      title,
      description,
      price: parseFloat(price),
      taxes,
      finalPrice,
      stock: parseInt(stock),
      status
    });
  };

  const inputClassName = `w-full p-2 border ${
    theme === 'dark'
      ? 'bg-gray-900 border-gray-800 text-white'
      : 'bg-white border-gray-200 text-black'
  } focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-gray-600' : 'focus:ring-gray-200'} focus:border-gray-900`;

  const buttonClassName = `px-4 py-2 border ${
    theme === 'dark'
      ? 'border-gray-800 hover:bg-gray-900'
      : 'border-gray-200 hover:bg-gray-50'
  }`;

  return (
    <div className={`border ${
      theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
    }`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold">New Product</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Product Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Product Image</label>
          <div className="flex items-center space-x-4">
            <div className={`w-32 h-32 border-2 border-dashed flex items-center justify-center ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <Upload className="w-8 h-8 text-gray-400" />
                </label>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <p>Upload a product image</p>
              <p>Recommended size: 800x800px</p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClassName}
              placeholder="Enter product title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClassName} h-32 resize-none`}
              placeholder="Enter product description"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Base Price (without tax)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClassName}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          {/* Taxes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Taxes</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTaxName}
                onChange={(e) => setNewTaxName(e.target.value)}
                className={`${inputClassName} flex-1`}
                placeholder="Tax name"
              />
              <input
                type="number"
                value={newTaxPercentage}
                onChange={(e) => setNewTaxPercentage(e.target.value)}
                className={`${inputClassName} w-32`}
                placeholder="Percentage"
                min="0"
                step="0.01"
              />
              <button
                onClick={handleAddTax}
                className={`${buttonClassName} flex items-center`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Tax List */}
            <div className="space-y-2">
              {taxes.map((tax) => (
                <div
                  key={tax.id}
                  className={`flex items-center justify-between p-2 border ${
                    theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                  }`}
                >
                  <span>{tax.name} ({tax.percentage}%)</span>
                  <button
                    onClick={() => handleRemoveTax(tax.id)}
                    className="text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Final Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Final Price (with taxes)</label>
            <input
              type="number"
              value={finalPrice.toFixed(2)}
              className={`${inputClassName} bg-gray-100`}
              disabled
            />
          </div>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium mb-1">Initial Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={inputClassName}
            placeholder="0"
            min="0"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            onClick={() => handleSave('draft')}
            className={buttonClassName}
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            className="px-4 py-2 bg-gray-900 text-white hover:bg-black"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;