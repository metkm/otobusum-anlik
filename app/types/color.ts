export interface ColorSchemes {
  light: ColorScheme
  dark: ColorScheme
}

export interface ColorScheme {
  primary: string
  text: string
  textInverted: string

  // primary50: string
  // primary100: string
  // primary200: string
  // primary300: string
  // primary400: string
  // primary500: string
  // primary600: string
  // primary700: string
  // primary800: string
  // primary900: string
  // primary950: string
  bg: string
  bgMuted: string
  bgElevated: string
  bgAccented: string
}
