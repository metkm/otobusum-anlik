import { Scheme } from "@material/material-color-utilities"

export type SchemePartialKeys = {
  -readonly [K in keyof Scheme]?: string
}

// type TargetKeys = 'surface' | 'onSurface' | 'surfaceContainer' | 'surfaceContainerHigh' | 'primary' | 'onPrimary'

export type ColorTheme = {
  surface: string
  onSurface: string
  surfaceContainer: string
  surfaceContainerHigh: string
  primary: string
  onPrimary: string
}

// export type ColorTheme = {
//   [K in keyof Scheme]: K extends TargetKeys ? string : never
// }

export interface ColorThemes {
  dark: ColorTheme;
  light: ColorTheme;
}

export const defaultColorThemes = {
  light: {
    surface: "#FFF8F4",
    onSurface: "#201B13",
    surfaceContainer: "#FFF8F4",
    surfaceContainerHigh: "#F3E6DA",
    primary: "#7F570F",
    onPrimary: "#FFFFFF",
  },
  dark: {
    surface: "#18120B",
    onSurface: "#EDE1D4",
    surfaceContainer: "#251F17",
    surfaceContainerHigh: "#2F2921",
    primary: "#F3BD6E",
    onPrimary: "#442B00",
  },
} satisfies ColorThemes;
