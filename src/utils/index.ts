// Utility functions for the GOAT application

/**
 * Format currency values
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Format date strings
 */
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate random order number
 */
export const generateOrderNumber = (): string => {
  return Math.random().toString(36).substring(2, 11).toUpperCase();
};

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get logo classes for consistent sizing
 */
export const getLogoClasses = (size: 'small' | 'medium' | 'large' = 'medium'): string => {
  const baseClasses = 'object-contain rounded-lg shadow-sm';
  
  switch (size) {
    case 'small':
      return `w-8 h-8 ${baseClasses}`;
    case 'medium':
      return `w-12 h-12 ${baseClasses}`;
    case 'large':
      return `w-16 h-16 ${baseClasses}`;
    default:
      return `w-12 h-12 ${baseClasses}`;
  }
};

/**
 * Sleep function for async operations
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Generate initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Check if user is on mobile device
 */
export const isMobile = (): boolean => {
  return window.innerWidth < 768;
};

/**
 * Scroll to top of page
 */
export const scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};