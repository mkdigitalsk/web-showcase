import { createTheme } from '@mui/material/styles'
import { Light, Dark } from '@mkdigitalsk/design-system'

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

// Brand colors composed from the design system (@mkdigitalsk/design-system), not defined here.
const Neutral0Light = Light.neutral[0]
const Neutral20Light = Light.neutral[20]
const Neutral40Light = Light.neutral[40]
const Neutral60Light = Light.neutral[60]
const Neutral80Light = Light.neutral[80]
const Neutral100Light = Light.neutral[100]

const PrimaryLight = Light.primary
const SecondaryLight = Light.secondary
const ErrorLight = Light.error
const SuccessLight = Light.success
const WarningLight = Light.warning

const Neutral0Dark = Dark.neutral[0]
const Neutral20Dark = Dark.neutral[20]
const Neutral40Dark = Dark.neutral[40]
const Neutral60Dark = Dark.neutral[60]
const Neutral80Dark = Dark.neutral[80]
const Neutral100Dark = Dark.neutral[100]

const PrimaryDark = Dark.primary
const SecondaryDark = Dark.secondary
const ErrorDark = Dark.error
const SuccessDark = Dark.success
const WarningDark = Dark.warning

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
