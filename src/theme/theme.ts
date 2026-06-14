import { createTheme } from '@mui/material/styles'

// Extend MUI palette types
declare module '@mui/material/styles' {
  interface Palette {
    neutral: {
      0: string
      20: string
      40: string
      60: string
      80: string
      100: string
    }
  }
  interface PaletteOptions {
    neutral?: {
      0: string
      20: string
      40: string
      60: string
      80: string
      100: string
    }
  }
}

const palette = {
  primary: '#6200EE',
  secondary: '#03DAC6',
  error: '#FF1A1A',
  success: '#4CAF50',
  warning: '#FF9800',
  neutral: {
    0: '#FFFFFF',
    20: '#C8C8C8',
    40: '#919191',
    60: '#5A5A5A',
    80: '#232323',
    100: '#000000',
  },
}

export const theme = createTheme({
  palette: {
    primary: {
      main: palette.primary,
    },
    secondary: {
      main: palette.secondary,
    },
    error: {
      main: palette.error,
    },
    success: {
      main: palette.success,
    },
    warning: {
      main: palette.warning,
    },
    neutral: palette.neutral,
    background: {
      default: palette.neutral[0],
      paper: palette.neutral[0],
    },
    text: {
      primary: palette.neutral[80],
      secondary: palette.neutral[60],
      disabled: palette.neutral[40],
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
  },
})
