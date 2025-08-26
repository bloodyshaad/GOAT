import React, { useEffect, useState } from 'react';

interface ScrollProgressProps {
  className?: string;
  height?: string;
  color?: string;
}

export function ScrollProgress({ 
  className = '', 
  height = '3px',
  color = 'bg-black dark:bg-white'
}: ScrollProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div className={`fixed top-0 left-0 w-full z-50 ${className}`}>
      <div 
        className={`${color} transition-all duration-150 ease-out`}
        style={{ 
          width: `${scrollProgress}%`,
          height: height,
        }}
      />
    </div>
  );
}