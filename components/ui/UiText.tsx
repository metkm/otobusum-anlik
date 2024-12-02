import { StyleProp, Text, TextProps, TextStyle } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

type FontSizes = 'sm' | 'md' | 'lg' | 'xl'

interface Props extends TextProps {
  info?: boolean
  size?: FontSizes
}

const fontSizes: Record<FontSizes, number> = {
  sm: 12,
  md: 14,
  lg: 18,
  xl: 22,
}

export const UiText = ({ style, info, size = 'md', ...rest }: Props) => {
  const { colorsTheme } = useTheme()

  const baseStyle: StyleProp<TextStyle> = {
    color: colorsTheme.color,
    fontSize: fontSizes[size],
    flexShrink: 1,
  }

  if (info) {
    baseStyle['color'] = colorsTheme.surfaceContainerHighest
    baseStyle['fontWeight'] = 'bold'
  }

  return <Text style={[baseStyle, style]} {...rest} />
}
