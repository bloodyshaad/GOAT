import { useEffect, useState } from 'react';

interface ParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down';
  offset?: number;
}

export function useParallax(options: ParallaxOptions = {}) {
  const { speed = 0.5, direction = 'up', offset = 0 } = options;
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const transform = direction === 'up' 
    ? `translateY(${(scrollY - offset) * speed}px)`
    : `translateY(${-(scrollY - offset) * speed}px)`;

  return { scrollY, transform };
}

export function useParallaxElement(ref: React.RefObject<HTMLElement>, options: ParallaxOptions = {}) {
  const { speed = 0.5, direction = 'up' } = options;
  const [transform, setTransform] = useState('translateY(0px)');

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const rate = scrolled * speed;

      if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
        const yPos = direction === 'up' ? rate : -rate;
        setTransform(`translateY(${yPos}px)`);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref, speed, direction]);

  return transform;
}