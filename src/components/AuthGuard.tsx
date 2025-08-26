import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { EnhancedButton } from './EnhancedButton';
import { AnimatedSection } from './AnimatedSection';

interface AuthGuardProps {
  children: React.ReactNode;
  action?: string;
  showModal?: boolean;
  onClose?: () => void;
}

export function AuthGuard({ 
  children, 
  action = 'purchase', 
  showModal = false, 
  onClose 
}: AuthGuardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showError } = useToast();

  const handleAuthRequired = (actionType: 'login' | 'signup') => {
    const actionMessages = {
      purchase: 'to make purchases',
      'add-to-cart': 'to add items to cart',
      'add-to-wishlist': 'to add items to wishlist',
      checkout: 'to proceed to checkout',
      'view-orders': 'to view your orders',
      'track-order': 'to track orders'
    };

    showError(
      'Authentication Required', 
      `Please ${actionType} ${actionMessages[action as keyof typeof actionMessages] || 'to continue'}`
    );

    if (onClose) onClose();
    
    // Fix: Use pathname string instead of location object
    navigate(actionType === 'login' ? '/login' : '/signup', {
      state: { from: location.pathname }
    });
  };

  // If user is authenticated, render children
  if (user) {
    return <>{children}</>;
  }

  // If showModal is false, just return null (don't render anything)
  if (!showModal) {
    return null;
  }

  // Render authentication modal
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <AnimatedSection animation="scaleIn" duration={300}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You need to be signed in to {action.replace('-', ' ')} on GOAT
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <ShoppingBag className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>Secure checkout and order tracking</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Personalized shopping experience</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Protected account and payment info</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <EnhancedButton
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => handleAuthRequired('login')}
              icon={User}
              iconPosition="left"
            >
              Sign In
            </EnhancedButton>
            
            <EnhancedButton
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => handleAuthRequired('signup')}
            >
              Create Account
            </EnhancedButton>

            {onClose && (
              <button
                onClick={onClose}
                className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 py-2"
              >
                Continue browsing
              </button>
            )}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

// Hook for checking authentication and showing appropriate messages
export function useAuthGuard() {
  const { user } = useAuth();
  const { showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = (action: string = 'continue') => {
    if (!user) {
      showError(
        'Authentication Required',
        `Please sign in to ${action}. Create an account or log in to access all GOAT features.`
      );
      // Fix: Use pathname string instead of location object
      navigate('/login', { state: { from: location.pathname } });
      return false;
    }
    return true;
  };

  const checkAuthForPurchase = () => {
    return requireAuth('make purchases and access your cart');
  };

  const checkAuthForWishlist = () => {
    return requireAuth('save items to your wishlist');
  };

  const checkAuthForOrders = () => {
    return requireAuth('view your orders and track shipments');
  };

  return {
    user,
    isAuthenticated: !!user,
    requireAuth,
    checkAuthForPurchase,
    checkAuthForWishlist,
    checkAuthForOrders
  };
}