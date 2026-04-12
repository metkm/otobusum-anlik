// import { StyleProp, Text, TextProps } from 'react-native'

// import { useTheme } from '@/hooks/useTheme'

// import { FontSize, fontSizes } from '@/constants/uiSizes'

// interface Props extends TextProps {
//   size?: FontSize
//   error?: boolean
//   dimmed?: boolean
// }

import React from 'react'
import { Text, TextProps } from 'react-native'

import { cn } from '@/utils/cn'

export const UiText = ({ className, ...props }: TextProps) => {
  return (
    <Text
      className={cn(
        'text-black dark:text-white',
        className,
      )}
      {...props}
    />
  )

  // const { schemeColor } = useTheme()

  // const baseStyle: StyleProp<TextStyle> = {
  //   color: dimmed ? schemeColor.onSurfaceDimmed : schemeColor.onSurface,
  //   fontSize: fontSizes[size],
  //   flexShrink: 1,
  // }

  // return <Text style={[baseStyle, style]} ellipsizeMode="tail" {...rest} />
}
