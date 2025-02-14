import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewCustomer = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('Active');

  const handleSubmit = (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    // Add customer creation logic here
    console.log({
      customerName,
      userName,
      email,
      phone,
      address,
      status,
      isDraft
    });
    navigate('/customers/manage-customers');
  };

  const inputClassName = `w-full p-3 border ${
    theme === 'dark'
      ? 'bg-gray-900 border-gray-800'
      : 'bg-white border-gray-200'
  }`;

  return (
    <div className={`border ${
      theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
    }`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/customers/manage-customers')}
            className={`p-2 mr-4 border ${
              theme === 'dark' ? 'border-gray-800 hover:bg-gray-900' : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">New Customer</h2>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={inputClassName}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">User Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className={inputClassName}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClassName}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClassName}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={`${inputClassName} h-24`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={inputClassName}
            required
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className={`px-6 py-3 border ${
              theme === 'dark'
                ? 'border-gray-800 hover:bg-gray-900'
                : 'border-gray-200 hover:bg-gray-50'
            } flex items-center`}
          >
            <Save className="h-5 w-5 mr-2" />
            Save as Draft
          </button>
          <button
            type="submit"
            className={`px-6 py-3 ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-black'
            } text-white hover:opacity-90 flex items-center`}
          >
            <Save className="h-5 w-5 mr-2" />
            Create Customer
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCustomer;