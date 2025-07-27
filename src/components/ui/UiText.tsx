import { StyleProp, Text, TextProps, TextStyle } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

import { FontSize, fontSizes } from '@/constants/uiSizes'

interface Props extends TextProps {
  size?: FontSize
  error?: boolean
  dimmed?: boolean
}

export const UiText = ({ style, dimmed, size = 'md', ...rest }: Props) => {
  const { schemeColor } = useTheme()

  const baseStyle: StyleProp<TextStyle> = {
    color: dimmed ? schemeColor.onSurfaceDimmed : schemeColor.onSurface,
    fontSize: fontSizes[size],
    flexShrink: 1,
  }

  return <Text style={[baseStyle, style]} ellipsizeMode="tail" {...rest} />
}
