import React from 'react';
import { Logo } from './Logo';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'black' | 'white' | 'gray';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = 'medium', 
  color = 'black', 
  className = '',
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const colorClasses = {
    black: 'border-black border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-300 border-t-transparent'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]}
          border-2 rounded-full animate-spin
        `}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className={`mt-2 text-sm font-medium ${
          color === 'white' ? 'text-white' : 
          color === 'gray' ? 'text-gray-600' : 'text-black'
        }`}>
          {text}
        </p>
      )}
    </div>
  );
}

// Full page loading spinner
export function PageLoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <div className="mb-4 animate-pulse">
          <Logo className="w-16 h-16 shadow-sm" />
        </div>
        <LoadingSpinner size="large" text={text} />
      </div>
    </div>
  );
}

// Inline loading spinner for buttons
export function ButtonLoadingSpinner({ size = 'small' }: { size?: 'small' | 'medium' }) {
  return (
    <LoadingSpinner 
      size={size} 
      color="white" 
      className="inline-flex"
    />
  );
}

// Card loading skeleton
export function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 aspect-[3/4] rounded-2xl mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );
}

// Product grid skeleton
export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}