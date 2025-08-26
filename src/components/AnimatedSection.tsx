import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'fadeIn' | 'scaleIn';
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

export function AnimatedSection({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 800,
  className = '',
  threshold = 0.1,
}: AnimatedSectionProps) {
  const { elementRef, isVisible } = useIntersectionObserver({
    threshold,
    triggerOnce: true,
  });

  const animationClasses = {
    fadeInUp: isVisible 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 translate-y-8',
    fadeInLeft: isVisible 
      ? 'opacity-100 translate-x-0' 
      : 'opacity-0 -translate-x-8',
    fadeInRight: isVisible 
      ? 'opacity-100 translate-x-0' 
      : 'opacity-0 translate-x-8',
    fadeIn: isVisible 
      ? 'opacity-100' 
      : 'opacity-0',
    scaleIn: isVisible 
      ? 'opacity-100 scale-100' 
      : 'opacity-0 scale-95',
  };

  return (
    <div
      ref={elementRef}
      className={`
        transition-all ease-out
        ${animationClasses[animation]}
        ${className}
      `}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}