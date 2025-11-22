// Priority options for tasks
export const PRIORITY_OPTIONS = ['extreme', 'moderate', 'low'] as const;

export type Priority = (typeof PRIORITY_OPTIONS)[number];

// Date filter options
export const DATE_FILTERS = [
  { id: 'today', label: 'Deadline Today' },
  { id: '5days', label: 'Expires in 5 days' },
  { id: '10days', label: 'Expires in 10 days' },
  { id: '30days', label: 'Expires in 30 days' },
] as const;

// Navigation items
export const NAV_ITEMS = [
  { name: 'Dashboard', href: '/', icon: '/dashboard.png' },
  { name: 'My Todos', href: '/todos', icon: '/my task.png' },
  { name: 'Account Information', href: '/profile', icon: '/people.png' },
] as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_URL || 'https://todo-app.pioneeralpha.com',
  ENDPOINTS: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    TODOS: '/todos',
    PROFILE: '/profile',
  },
} as const;

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
} as const;

// Date filter calculation (in days)
export const FILTER_DAYS = {
  today: 0,
  '5days': 5,
  '10days': 10,
  '30days': 30,
} as const;
