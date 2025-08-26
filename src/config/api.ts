// API Configuration for unified Vercel deployment
export const API_CONFIG = {
  // Base URL configuration - uses relative path for unified deployment
  BASE_URL: import.meta.env.VITE_API_URL || 
    (import.meta.env.PROD 
      ? '/api'  // Same domain for unified deployment
      : 'http://localhost:5000/api'
    ),
  
  // Timeout configuration
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  
  // Environment checks
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  
  // Feature flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
  ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING !== 'false',
};

// Helper function to get API URL
export const getApiUrl = (endpoint: string = '') => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to check if we're in development
export const isDevelopment = () => API_CONFIG.IS_DEVELOPMENT;

// Helper function to check if we're in production
export const isProduction = () => API_CONFIG.IS_PRODUCTION;