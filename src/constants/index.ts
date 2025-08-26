// Application Constants
export const APP_CONFIG = {
  name: 'GOAT',
  fullName: 'GOAT',
  version: '1.0.0',
  description: 'Modern E-Commerce Application',
} as const;

// Route Constants
export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ACCOUNT: '/account',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  USER: 'goat-user',
  USERS: 'goat-users',
  CART: 'goat-cart',
  PREFERENCES: 'goat-preferences',
} as const;

// Validation Constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /\S+@\S+\.\S+/,
  PHONE_REGEX: /^\+?[\d\s\-()]+$/,
} as const;

// UI Constants
export const UI = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  TOAST_DURATION: 3000,
  LOADING_DELAY: 1000,
} as const;

// Demo Data
export const DEMO_USER = {
  email: 'demo@goat.com',
  password: 'password',
  name: 'Demo User',
  id: 'demo',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`,
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_CREDENTIALS: 'Invalid email or password',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  GENERIC_ERROR: 'An error occurred. Please try again.',
  TERMS_REQUIRED: 'Please accept the terms and conditions',
  USER_EXISTS: 'An account with this email already exists',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  REGISTRATION_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Successfully logged out!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
} as const;