import React from 'react';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

const baseTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1B5E20'
      },
      secondary: {
        main: '#00C853'
      },
      background: {
        default: '#f4f7f5',
        paper: '#ffffff'
      },
      error: {
        main: '#d32f2f'
      }
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Segoe UI", sans-serif',
      button: {
        textTransform: 'none'
      }
    },
    shape: {
      borderRadius: 12
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            fontWeight: 600
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16
          }
        }
      }
    }
  })
);

export const EcoThemeProvider = ({ children }) => <ThemeProvider theme={baseTheme}>{children}</ThemeProvider>;
