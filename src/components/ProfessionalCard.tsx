import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface ProfessionalCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'tilt' | 'glow' | 'scale' | 'none';
  delay?: number;
  onClick?: () => void;
}

export function ProfessionalCard({
  children,
  className = '',
  hoverEffect = 'lift',
  delay = 0,
  onClick,
}: ProfessionalCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { elementRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  const hoverEffects = {
    lift: isHovered 
      ? 'transform -translate-y-2 shadow-xl dark:shadow-gray-900/50' 
      : 'transform translate-y-0 shadow-lg dark:shadow-gray-900/25',
    tilt: isHovered 
      ? 'transform rotate-1 scale-105 shadow-xl dark:shadow-gray-900/50' 
      : 'transform rotate-0 scale-100 shadow-lg dark:shadow-gray-900/25',
    glow: isHovered 
      ? 'shadow-2xl shadow-black/20 dark:shadow-white/10 ring-1 ring-black/5 dark:ring-white/5' 
      : 'shadow-lg dark:shadow-gray-900/25',
    scale: isHovered 
      ? 'transform scale-105 shadow-xl dark:shadow-gray-900/50' 
      : 'transform scale-100 shadow-lg dark:shadow-gray-900/25',
    none: 'shadow-lg dark:shadow-gray-900/25',
  };

  return (
    <div
      ref={elementRef}
      className={`
        bg-white dark:bg-gray-800 
        border border-gray-100 dark:border-gray-700
        rounded-2xl 
        transition-all duration-500 ease-out
        ${hoverEffects[hoverEffect]}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}