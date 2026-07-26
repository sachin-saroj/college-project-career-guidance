import { PaletteOptions } from '@mui/material/styles';

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#4F46E5', // Indigo
    light: '#818CF8',
    dark: '#3730A3',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#0D9488', // Teal
    light: '#2DD4BF',
    dark: '#0F766E',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
  },
  error: { main: '#EF4444' },
  warning: { main: '#F59E0B' },
  info: { main: '#3B82F6' },
  success: { main: '#10B981' },
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#6366F1', // Lighter Indigo
    light: '#818CF8',
    dark: '#4F46E5',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#14B8A6', // Lighter Teal
    light: '#2DD4BF',
    dark: '#0D9488',
    contrastText: '#000000',
  },
  background: {
    default: '#0F172A', // Slate 900
    paper: '#1E293B',   // Slate 800
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
  },
  error: { main: '#F87171' },
  warning: { main: '#FBBF24' },
  info: { main: '#60A5FA' },
  success: { main: '#34D399' },
};
