import { argbFromHex, hexFromArgb, themeFromSourceColor } from '@material/material-color-utilities'

export const createRandomHslColor = () => {
  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  return [
    randomInt(0, 360),
    randomInt(42, 98),
    randomInt(40, 90),
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

export const createHexColors = () => {
  const hslColor = createRandomHslColor()
  const hexColor = hexFromHsl(...hslColor)
  const argbColor = argbFromHex(hexColor)

  const result = themeFromSourceColor(argbColor)
  const palette = result.palettes.primary

  const count = 11
  const colors = []

  for (let index = count; index > 0; index--) {
    const c = palette.tone(9 * index)
    colors.push(hexFromArgb(c))
  }

  return colors
}
