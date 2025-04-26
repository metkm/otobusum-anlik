import { Scheme } from '@material/material-color-utilities'

export type SchemePartialKeys = {
  -readonly [K in keyof Scheme]?: string
}

export type ColorScheme = {
  surface: string
  surfaceContainer: string
  surfaceContainerHigh: string
  onSurface: string
  onSurfaceDimmed: string
  primary: string
  onPrimary: string
  error: string
  onError: string

  // These 2 fields are exists in material theme but not in the
  // neutral colors. Only filled when colors are derived from material theme
  primaryContainer?: string
  onPrimaryContainer?: string
}

export interface ColorSchemes {
  dark: ColorScheme
  light: ColorScheme
}

// #F0A300
// Material You 3 colors that generated from the primary color

// export const defaultColorSchemes = {
//   light: {
//     surface: '#FFF8F4',
//     onSurface: '#201B13',
//     surfaceContainer: '#FFF8F4',
//     surfaceContainerHigh: '#F3E6DA',
//     primary: '#7F570F',
//     onPrimary: '#FFFFFF',
//     secondary: '#6F5B40',
//     onSecondary: '#FFFFFF',
//     secondaryContainer: '#FADEBC',
//     onSecondaryContainer: '#56442A',
//     error: '#BA1A1A',
//     onError: '#FFFFFF',
//     primaryContainer: '#FFDDB1',
//     onPrimaryContainer: '#624000',
//   },
//   dark: {
//     surface: '#18120B',
//     onSurface: '#EDE1D4',
//     surfaceContainer: '#251F17',
//     surfaceContainerHigh: '#2F2921',
//     primary: '#F3BD6E',
//     onPrimary: '#442B00',
//     secondary: '#DDC2A1',
//     onSecondary: '#3E2E16',
//     secondaryContainer: '#56442A',
//     onSecondaryContainer: '#FADEBC',
//     error: '#FFB4AB',
//     onError: '#690005',
//     primaryContainer: '#624000',
//     onPrimaryContainer: '#FFDDB1',
//   },
// } satisfies ColorSchemes

export const defaultColorSchemes: ColorSchemes = {
  light: {
    surface: '#fafafa',
    surfaceContainer: '#f5f5f5',
    surfaceContainerHigh: '#e5e5e5',
    onSurface: '#404040',
    onSurfaceDimmed: '#737373',
    primary: '#7F570F',
    onPrimary: '#FFFFFF',
    error: '#BA1A1A',
    onError: '#FFFFFF',
  },
  dark: {
    surface: '#171717',
    surfaceContainer: '#262626',
    surfaceContainerHigh: '#404040',
    onSurface: '#e5e5e5',
    onSurfaceDimmed: '#737373',
    primary: '#F3BD6E',
    onPrimary: '#442B00',
    error: '#FFB4AB',
    onError: '#690005',
  },
}
