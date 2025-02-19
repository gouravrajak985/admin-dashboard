/**
 * Authentication Guard Component
 * 
 * This component protects routes by:
 * - Checking if a user is authenticated
 * - Redirecting to login if not authenticated
 * - Showing a loading state while checking auth status
 * - Rendering child routes only when authenticated
 */
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const AuthGuard = () => {
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-shopify-green border-t-transparent"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!user) return null;

  // Render child routes if authenticated
  return <Outlet />;
};