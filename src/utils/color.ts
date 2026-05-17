import { argbFromHex, themeFromSourceColor } from '@material/material-color-utilities'

export const createRandomHslColor = () => {
  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  return [
    randomInt(0, 360),
    randomInt(42, 98),
    randomInt(0, 100),
  ] as const
}

const hexFromHsl = (h: number, s: number, l: number) => {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100

  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0') // convert to Hex and prefix "0" if needed
  }

  return `#${f(0)}${f(8)}${f(4)}`
}

export const createRandomTheme = (hslColor?: [number, number, number]) => {
  const color = hslColor ?? createRandomHslColor()

  const hexColor = hexFromHsl(...color)
  const argbColor = argbFromHex(hexColor)

  return themeFromSourceColor(argbColor)
}
