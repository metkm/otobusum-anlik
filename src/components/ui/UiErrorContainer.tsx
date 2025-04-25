import { StyleProp, TextStyle, ViewStyle, View } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

import { UiText } from './UiText'

export const UiErrorContainer = ({ message }: { message: string }) => {
  const { schemeColor } = useTheme()

  const dynamicBackground: StyleProp<ViewStyle> = {
    backgroundColor: schemeColor.error,
    padding: 14,
    borderRadius: 14,
  }

  const dynamicText: StyleProp<TextStyle> = {
    color: schemeColor.onError,
  }

  return (
    <View style={dynamicBackground}>
      <UiText style={dynamicText}>{message}</UiText>
    </View>
  )
}
