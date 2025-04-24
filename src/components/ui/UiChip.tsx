import { StyleSheet, TextProps, View } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

import { UiText } from './UiText'

interface UiChipProps {
  children?: TextProps['children']
}

export const UiChip = ({ children }: UiChipProps) => {
  const { colorsTheme } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colorsTheme.surfaceContainer }]}>
      <UiText size="sm" info>
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
