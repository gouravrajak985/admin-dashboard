import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuthStore } from '../../store/authStore';

const Login = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { signIn, user, isLoading: authLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/home');
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      <div className={`max-w-md w-full mx-4 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      } rounded-lg shadow-lg p-8`}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <LayoutDashboard className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold mb-1">Admin Panel</h2>
          <p className="text-sm text-gray-500">Developed by Avirrav</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-300'
              }`}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-300'
              }`}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="remember" className="ml-2 text-sm">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Sign In
              </>
            )}
          </button>

          <p className="text-center text-sm">
            Don't have an account?{' '}
            <a
              href="/signup"
              className="text-blue-500 hover:text-blue-600"
              onClick={(e) => {
                e.preventDefault();
                navigate('/signup');
              }}
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;