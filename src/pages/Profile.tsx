import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Save, ArrowLeft, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Profile = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    avatar_url: profile?.avatar_url || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName = `w-full p-3 border ${
    theme === 'dark'
      ? 'bg-gray-900 border-gray-800'
      : 'bg-white border-gray-200'
  }`;

  if (!profile) return null;

  return (
    <div className={`border ${
      theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
    }`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/home')}
            className={`p-2 mr-4 border ${
              theme === 'dark' ? 'border-gray-800 hover:bg-gray-900' : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">Admin Profile</h2>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Profile Header */}
          <div className="mb-8 text-center">
            <div className="relative inline-block">
              <img
                src={profile.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                alt={profile.name}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full cursor-pointer">
                  <Camera className="h-5 w-5" />
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              )}
            </div>
            <h1 className="mt-4 text-2xl font-bold">{profile.name}</h1>
            <p className="text-gray-500">Administrator</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className={`p-6 border ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={inputClassName}
                    />
                  ) : (
                    <p className="p-3">{profile.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={inputClassName}
                    />
                  ) : (
                    <p className="p-3">{profile.phone || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className={inputClassName}
                    />
                  ) : (
                    <p className="p-3">{profile.location || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className={`p-6 border ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Join Date</label>
                  <p className="p-3">{new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Updated</label>
                  <p className="p-3">{new Date(profile.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className={`px-6 py-3 border ${
                      theme === 'dark'
                        ? 'border-gray-800 hover:bg-gray-900'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-3 ${
                      theme === 'dark' ?  theme === 'dark' ? 'bg-gray-900' : 'bg-black'
                    } text-white hover:opacity-90 flex items-center disabled:opacity-50`}
                    disabled={isLoading}
                  >
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className={`px-6 py-3 ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-black'
                  } text-white hover:opacity-90`}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;