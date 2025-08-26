import React, { useState } from 'react';
import { X, ShoppingBag, User, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AnimatedSection } from './AnimatedSection';

export function AuthBanner() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);

  // Don't show banner if user is authenticated or banner is dismissed
  if (user || !isVisible) {
    return null;
  }

  return (
    <AnimatedSection animation="fadeInDown" duration={500}>
      <div className="bg-gradient-to-r from-black to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white py-3 px-4 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">Sign in required</span>
            </div>
            
            <div className="hidden sm:flex items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Shop & checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>Save favorites</span>
              </div>
              <span>Track orders</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="border border-white text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors duration-200"
            >
              Sign Up
            </Link>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-300 hover:text-white transition-colors duration-200 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}