// Dark Sunset Color Scheme - Deep Blue through Purple & Pink to Warm Coral
export const colors = {
  // Primary Blue (Bright for gradients)
  dukeBlue: {
    50: '#dbeafe',
    100: '#bfdbfe',
    200: '#93c5fd',
    300: '#60a5fa',
    400: '#3b82f6',
    500: '#2563eb',
    600: '#1d4ed8',
    700: '#1e40af',
    800: '#1e3a8a',
    900: '#172554',
  },
  
  // Purple (Sunset transition)
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  // Rose/Pink (Sunset glow)
  rose: {
    50: '#fff7ed',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Sunset Orange (Warm, bright)
  sunset: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  
  // Neutral grays for dark theme
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
  
  // Dark theme specific
  white: '#ffffff',
  black: '#000000',
  
  // Midnight/Dark base (keep these very dark)
  midnight: '#0a1628',
  dark: '#0f1419',
  darkAccent: '#1a2847',
  
  // Gradient accent (warm peachy sunset)
  sunsetAccent: '#fb923c',
}

export type ColorName = keyof typeof colors
