import { StyleProp, Text, TextProps, TextStyle } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

import { FontSize, fontSizes } from '@/constants/uiSizes'

interface Props extends TextProps {
  info?: boolean
  size?: FontSize
  error?: boolean
}

export const UiText = ({ style, info, size = 'md', error, ...rest }: Props) => {
  const { colorsTheme, getSchemeColorHex } = useTheme()

  const baseStyle: StyleProp<TextStyle> = {
    color: error ? getSchemeColorHex('onError') : undefined,
    fontSize: fontSizes[size],
    flexShrink: 1,
    backgroundColor: error ? getSchemeColorHex('error') : undefined,
  }

  if (info) {
    baseStyle['color'] = colorsTheme.surfaceContainerHighest
    baseStyle['fontWeight'] = 'bold'
  }

  return <Text style={[baseStyle, style]} {...rest} />
}
