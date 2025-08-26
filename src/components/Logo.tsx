import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface LogoProps {
  className?: string;
  alt?: string;
}

export function Logo({ className = "w-12 h-12", alt = "GOAT Logo" }: LogoProps) {
  const { actualTheme } = useTheme();
  
  const logoSrc = actualTheme === 'dark' ? '/GOAT-dark.png' : '/GOAT.jpg';
  
  return (
    <img 
      src={logoSrc} 
      alt={alt} 
      className={`${className} object-contain rounded-lg shadow-sm group-hover:shadow-md dark:shadow-gray-700 transition-all duration-300 hover-lift`}
    />
  );
}