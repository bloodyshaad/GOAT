// Performance Utilities for GOAT E-commerce Platform

// Debounce function to limit the rate of function calls
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// Throttle function to limit function calls to once per specified time period
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Memoization function to cache function results
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;
}

// Lazy loading utility for images
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string,
  placeholder?: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    
    image.onload = () => {
      img.src = src;
      img.classList.add('loaded');
      resolve();
    };
    
    image.onerror = reject;
    
    if (placeholder) {
      img.src = placeholder;
    }
    
    image.src = src;
  });
}

// Intersection Observer utility for lazy loading
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
}

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  startTiming(label: string): void {
    performance.mark(`${label}-start`);
  }
  
  endTiming(label: string): number {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label, 'measure')[0];
    const duration = measure.duration;
    
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    
    this.metrics.get(label)!.push(duration);
    
    // Clean up marks and measures
    performance.clearMarks(`${label}-start`);
    performance.clearMarks(`${label}-end`);
    performance.clearMeasures(label);
    
    return duration;
  }
  
  getAverageTime(label: string): number {
    const times = this.metrics.get(label);
    if (!times || times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }
  
  getMetrics(): Record<string, { average: number; count: number; total: number }> {
    const result: Record<string, { average: number; count: number; total: number }> = {};
    
    this.metrics.forEach((times, label) => {
      const total = times.reduce((sum, time) => sum + time, 0);
      result[label] = {
        average: total / times.length,
        count: times.length,
        total
      };
    });
    
    return result;
  }
  
  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Bundle size analyzer utility
export function analyzeBundleSize(): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle Analysis:');
    console.log('- React:', (window as unknown as { React?: unknown }).React ? 'Loaded' : 'Not loaded');
    console.log('- Performance API:', 'performance' in window ? 'Available' : 'Not available');
    console.log('- Intersection Observer:', 'IntersectionObserver' in window ? 'Available' : 'Not available');
  }
}

// Memory usage monitoring
export function getMemoryUsage(): Record<string, number> | null {
  if ('memory' in performance) {
    const memory = (performance as unknown as { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
    };
  }
  return null;
}

// Network information utility
export function getNetworkInfo(): Record<string, unknown> | null {
  if ('connection' in navigator) {
    const connection = (navigator as unknown as { connection: { effectiveType: string; downlink: number; rtt: number } }).connection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt
    };
  }
  return null;
}

// Critical resource preloader
export function preloadCriticalResources(resources: string[]): Promise<void[]> {
  const promises = resources.map(resource => {
    return new Promise<void>((resolve, reject) => {
      // For images, use Image() constructor for better compatibility
      if (resource.match(/\.(jpg|jpeg|png|webp|gif)$/)) {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to preload ${resource}`));
        img.src = resource;
        return;
      }
      
      // For other resources, use link preload
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      
      // Determine resource type based on file extension
      if (resource.endsWith('.css')) {
        link.as = 'style';
      } else if (resource.endsWith('.js')) {
        link.as = 'script';
      } else if (resource.match(/\.(woff|woff2|ttf|otf)$/)) {
        link.as = 'font';
        link.crossOrigin = 'anonymous';
      }
      
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to preload ${resource}`));
      
      document.head.appendChild(link);
    });
  });
  
  return Promise.all(promises);
}

// Preload images specifically for better performance
export function preloadImages(imagePaths: string[]): Promise<void[]> {
  const promises = imagePaths.map(path => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to preload image: ${path}`));
      img.src = path;
    });
  });
  
  return Promise.all(promises);
}

// Service Worker registration utility
export function registerServiceWorker(swPath: string = '/sw.js'): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.register(swPath)
      .then(registration => {
        console.log('Service Worker registered successfully:', registration);
        return registration;
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
        return null;
      });
  }
  
  return Promise.resolve(null);
}

// Image optimization utility
export function optimizeImage(
  canvas: HTMLCanvasElement,
  maxWidth: number = 800,
  maxHeight: number = 600,
  quality: number = 0.8
): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');
  
  const { width, height } = canvas;
  
  // Calculate new dimensions
  let newWidth = width;
  let newHeight = height;
  
  if (width > maxWidth) {
    newWidth = maxWidth;
    newHeight = (height * maxWidth) / width;
  }
  
  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = (newWidth * maxHeight) / newHeight;
  }
  
  // Create new canvas with optimized dimensions
  const optimizedCanvas = document.createElement('canvas');
  optimizedCanvas.width = newWidth;
  optimizedCanvas.height = newHeight;
  
  const optimizedCtx = optimizedCanvas.getContext('2d');
  if (!optimizedCtx) throw new Error('Optimized canvas context not available');
  
  optimizedCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
  
  return optimizedCanvas.toDataURL('image/jpeg', quality);
}

// Export performance monitor instance
export const performanceMonitor = PerformanceMonitor.getInstance();