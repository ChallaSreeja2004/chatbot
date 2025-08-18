// src/theme.js

import { createTheme, responsiveFontSizes } from '@mui/material/styles'; // <-- Import responsiveFontSizes

export const getTheme = (mode) => {
  const sharedSettings = {
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
        fontWeight: 600,
      }
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
          }
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            '&.Mui-focused': {
              color: mode === 'dark' ? '#F9FAFB' : '#1F2937',
            },
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            '&:before, &:after': {
              display: 'none',
            },
            backgroundColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.06)',
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.09)',
            },
            '&.Mui-focused': {
              backgroundColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.09)', boxShadow: 'none',
            },
          },
        },
      },
    },
  };

  let theme; // <-- Declare theme variable

  if (mode === 'dark') {
    theme = createTheme({ // <-- Assign to theme
      ...sharedSettings,
      palette: {
        mode: 'dark',
        primary: { main: '#E5E7EB', contrastText: '#1F2937' },
        accent: { main: '#64748B', contrastText: '#FFFFFF' },
        background: { default: '#111827', paper: '#1F2937' },
        text: { primary: '#F9FAFB', secondary: '#9CA3AF' },
        divider: '#374151',
      },
    });
  } else {
    theme = createTheme({ // <-- Assign to theme
      ...sharedSettings,
      palette: {
        mode: 'light',
        primary: { main: '#1F2937', contrastText: '#FFFFFF' },
        accent: { main: '#1F2937', contrastText: '#FFFFFF' },
        background: { default: '#F9FAFB', paper: '#FFFFFF' },
        text: { primary: '#1F2937', secondary: '#6B7280' },
        divider: '#E5E7EB',
      },
    });
  }

  // --- THIS IS THE CRITICAL CHANGE ---
  // It takes the theme and makes all font sizes responsive.
  return responsiveFontSizes(theme);
};