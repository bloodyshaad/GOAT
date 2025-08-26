import React, { useRef } from 'react';
import { useParallaxElement } from '../hooks/useParallax';

interface ParallaxContainerProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down';
  className?: string;
  style?: React.CSSProperties;
}

export function ParallaxContainer({
  children,
  speed = 0.5,
  direction = 'up',
  className = '',
  style = {},
}: ParallaxContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const transform = useParallaxElement(ref, { speed, direction });

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transform,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}

interface ParallaxBackgroundProps {
  children: React.ReactNode;
  backgroundImage?: string;
  backgroundColor?: string;
  speed?: number;
  className?: string;
}

export function ParallaxBackground({
  children,
  backgroundImage,
  backgroundColor,
  speed = 0.3,
  className = '',
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const transform = useParallaxElement(ref, { speed, direction: 'up' });

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Parallax Background */}
      <div
        ref={ref}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
        style={{
          transform,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundColor,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          willChange: 'transform',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}