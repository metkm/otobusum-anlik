import { StyleProp, Text, TextProps, TextStyle } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

import { FontSize, fontSizes } from '@/constants/uiSizes'

interface Props extends TextProps {
  info?: boolean
  size?: FontSize
  error?: boolean
}

export const UiText = ({ style, info, size = 'md', ...rest }: Props) => {
  const { schemeColor } = useTheme()

  const baseStyle: StyleProp<TextStyle> = {
    color: schemeColor.onSurface,
    fontSize: fontSizes[size],
    flexShrink: 1,
  }

  if (info) {
    // baseStyle['color'] = schemeColor.onSurface
    baseStyle['fontWeight'] = 'bold'
  }

  return <Text style={[baseStyle, style]} {...rest} />
}
