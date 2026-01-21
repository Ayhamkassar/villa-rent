/**
 * Application Theme
 * Centralized styling constants
 */

export const COLORS = {
  // Primary colors
  primary: '#0077b6',
  primaryLight: '#90e0ef',
  primaryDark: '#023e8a',
  
  // Secondary colors
  secondary: '#2ecc71',
  secondaryLight: '#58d68d',
  secondaryDark: '#27ae60',
  
  // Accent colors
  accent: '#1E90FF',
  
  // Status colors
  success: '#28a745',
  warning: '#f39c12',
  error: '#e74c3c',
  info: '#17a2b8',
  
  // Booking status colors
  confirmed: '#2a9d8f',
  pending: '#f39c12',
  cancelled: '#e63946',
  
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Text colors
  text: {
    primary: '#2c3e50',
    secondary: '#7f8c8d',
    light: '#aaaaaa',
    white: '#ffffff',
    dark: '#333333',
  },
  
  // Background colors
  background: {
    primary: '#f0f4f8',
    secondary: '#ffffff',
    card: 'rgba(255, 255, 255, 0.85)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Gradient colors
  gradients: {
    primary: ['#74ebd5', '#ACB6E5'],
    login: ['#ff7e5f', '#feb47b'],
    register: ['#6dd5ed', '#2193b0'],
    details: ['#a8edea', '#fed6e3'],
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 15,
  xxl: 20,
  round: 9999,
};

export const FONT_SIZES = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 24,
  title: 26,
};

export const FONT_WEIGHTS = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
};

export const TAB_BAR = {
  height: 64,
  backgroundColor: 'rgba(116,235,213,0.95)',
};
