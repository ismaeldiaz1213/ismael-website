export const colors = {
  // Primary Colors - Desaturated Deep Ocean
  primary: {
    main: '#0a1929',      // Deep navy base
    light: '#112240',     // Slightly lighter navy for layering
    lighter: '#1d2d50',   // Muted blue-gray
    dark: '#020c1b',      // Almost black navy
  },

  // Accent Colors - Muted Technical Grays
  accent: {
    main: '#94a3b8',      // Cool slate gray
    light: '#cbd5e1',     // Soft silver
    dark: '#64748b',      // Muted steel
  },

  // Text Colors - High Readability, Low Strain
  text: {
    main: '#e2e8f0',      // Soft off-white (easy on eyes)
    light: '#94a3b8',     // Muted slate for secondary text
    dark: '#1e293b',      // Dark slate for contrast on light buttons
  },

  // Background Colors - Deep & Dark
  bg: {
    dark: '#0a1929',
    darker: '#020c1b',
    card: 'rgba(17, 34, 64, 0.4)', // Muted navy transparency
    overlay: 'rgba(2, 12, 27, 0.95)',
  },

  // Semantic Colors - Desaturated
  success: '#52b788',     // Muted "Circuit" Green
  warning: '#b79d52',     // Muted Gold
  error: '#b75252',       // Muted Brick Red
  info: '#5296b7',        // Muted Steel Blue

  // Ocean shades - Dark & Muted
  ocean: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Cyan shades - Shifted toward Teal/Slate
  cyan: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  utility: {
    white: '#ffffff',
    black: '#000000',
  }
}

export type ColorName = keyof typeof colors
