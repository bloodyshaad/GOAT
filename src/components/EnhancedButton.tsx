import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface EnhancedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient' | 'magnetic';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  loading?: boolean;
}

export function EnhancedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
  loading = false,
}: EnhancedButtonProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === 'magnetic') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setMousePosition({ x: x * 0.3, y: y * 0.3 });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const variantClasses = {
    primary: `
      bg-black dark:bg-white text-white dark:text-black
      hover:bg-gray-800 dark:hover:bg-gray-200
      hover:shadow-lg hover:shadow-black/25 dark:hover:shadow-white/25
      transform hover:scale-105 hover:-translate-y-1
      transition-all duration-300 ease-out
      relative overflow-hidden
      before:absolute before:inset-0 before:bg-gradient-to-r 
      before:from-transparent before:via-white/20 before:to-transparent
      before:translate-x-[-100%] hover:before:translate-x-[100%]
      before:transition-transform before:duration-700 before:ease-out
    `,
    secondary: `
      border-2 border-black dark:border-white text-black dark:text-white
      bg-transparent hover:bg-black dark:hover:bg-white
      hover:text-white dark:hover:text-black
      transform hover:scale-105 hover:-translate-y-1
      transition-all duration-300 ease-out
      relative overflow-hidden
      before:absolute before:inset-0 before:bg-black dark:before:bg-white
      before:translate-y-[100%] hover:before:translate-y-0
      before:transition-transform before:duration-300 before:ease-out
      before:z-[-1]
    `,
    ghost: `
      text-black dark:text-white bg-transparent
      hover:bg-black/10 dark:hover:bg-white/10
      transform hover:scale-105
      transition-all duration-300 ease-out
      relative
      after:absolute after:inset-0 after:rounded-lg
      after:bg-gradient-to-r after:from-black/0 after:via-black/5 after:to-black/0
      dark:after:from-white/0 dark:after:via-white/5 dark:after:to-white/0
      after:translate-x-[-100%] hover:after:translate-x-[100%]
      after:transition-transform after:duration-500 after:ease-out
    `,
    gradient: `
      bg-gradient-to-r from-black via-gray-800 to-black
      dark:from-white dark:via-gray-200 dark:to-white
      text-white dark:text-black
      hover:from-gray-800 hover:via-black hover:to-gray-800
      dark:hover:from-gray-200 dark:hover:via-white dark:hover:to-gray-200
      transform hover:scale-105 hover:-translate-y-1
      transition-all duration-300 ease-out
      shadow-lg hover:shadow-xl
      relative overflow-hidden
      before:absolute before:inset-0 before:bg-gradient-to-r
      before:from-transparent before:via-white/30 before:to-transparent
      before:translate-x-[-100%] hover:before:translate-x-[100%]
      before:transition-transform before:duration-1000 before:ease-out
    `,
    magnetic: `
      bg-black dark:bg-white text-white dark:text-black
      hover:shadow-2xl hover:shadow-black/30 dark:hover:shadow-white/30
      transition-all duration-300 ease-out
      relative overflow-hidden
      before:absolute before:inset-0 before:bg-gradient-to-r
      before:from-transparent before:via-white/20 before:to-transparent
      before:translate-x-[-100%] hover:before:translate-x-[100%]
      before:transition-transform before:duration-700 before:ease-out
    `,
  };

  const magneticStyle = variant === 'magnetic' ? {
    transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) ${isHovered ? 'scale(1.05)' : 'scale(1)'}`,
  } : {};

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        font-semibold rounded-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-black dark:focus:ring-white
        active:scale-95
        flex items-center justify-center gap-2
        ${className}
      `}
      style={magneticStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
          <span className="relative z-10">{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </>
      )}
    </button>
  );
}