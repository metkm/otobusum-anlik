import { StyleSheet, TextProps, View } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

import { UiText } from './UiText'

interface UiChipProps {
  children?: TextProps['children']
}

export const UiChip = ({ children }: UiChipProps) => {
  const { schemeColor } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: schemeColor.surfaceContainerHigh }]}>
      <UiText size="sm">
        {children}
      </UiText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    borderRadius: 999,
  },
})
