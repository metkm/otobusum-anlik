import { argbFromHex, themeFromSourceColor } from '@material/material-color-utilities'

const hslToHex = (h: number, s: number, l: number) => {
  l /= 100
  const a = s * Math.min(l, 1 - l) / 100

  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0') // convert to Hex and prefix "0" if needed
  }

  return `#${f(0)}${f(8)}${f(4)}`
}

const getHslValues = (): [number, number, number] => {
  return [360 * Math.random(), 25 + 70 * Math.random(), 85 + 10 * Math.random()]
}

export const createTheme = (hex?: string) => {
  if (hex) {
    return themeFromSourceColor(argbFromHex(hex))
  }

  const [h, s, l] = getHslValues()
  const colorHex = hslToHex(h, s, l)

  return themeFromSourceColor(argbFromHex(colorHex))
}
