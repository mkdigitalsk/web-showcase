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

// Light theme colors
const Neutral0Light = '#FFFFFF'
const Neutral20Light = '#C8C8C8'
const Neutral40Light = '#919191'
const Neutral60Light = '#5A5A5A'
const Neutral80Light = '#232323'
const Neutral100Light = '#000000'

const PrimaryLight = '#6200EE'
const SecondaryLight = '#03DAC6'
const ErrorLight = '#FF1A1A'
const SuccessLight = '#4CAF50'
const WarningLight = '#FF9800'

// Dark theme colors
const Neutral0Dark = '#121212'
const Neutral20Dark = '#2C2C2C'
const Neutral40Dark = '#717171'
const Neutral60Dark = '#B0B0B0'
const Neutral80Dark = '#ECECEC'
const Neutral100Dark = '#FFFFFF'

const PrimaryDark = '#BB86FC'
const SecondaryDark = '#03DAC6'
const ErrorDark = '#CF6679'
const SuccessDark = '#81C784'
const WarningDark = '#FFB74D'

export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: PrimaryLight },
        secondary: { main: SecondaryLight },
        error: { main: ErrorLight },
        success: { main: SuccessLight },
        warning: { main: WarningLight },
        neutral: {
          0: Neutral0Light,
          20: Neutral20Light,
          40: Neutral40Light,
          60: Neutral60Light,
          80: Neutral80Light,
          100: Neutral100Light,
        },
        background: { default: Neutral0Light, paper: Neutral0Light },
        text: { primary: Neutral80Light, secondary: Neutral60Light, disabled: Neutral40Light },
      },
    },
    dark: {
      palette: {
        primary: { main: PrimaryDark },
        secondary: { main: SecondaryDark },
        error: { main: ErrorDark },
        success: { main: SuccessDark },
        warning: { main: WarningDark },
        neutral: {
          0: Neutral0Dark,
          20: Neutral20Dark,
          40: Neutral40Dark,
          60: Neutral60Dark,
          80: Neutral80Dark,
          100: Neutral100Dark,
        },
        background: { default: Neutral0Dark, paper: Neutral20Dark },
        text: { primary: Neutral80Dark, secondary: Neutral60Dark, disabled: Neutral40Dark },
      },
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
