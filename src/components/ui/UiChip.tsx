import { StyleSheet, TextProps, View } from 'react-native'
import { UiText } from './UiText'
import { useTheme } from '@/hooks/useTheme'

interface UiChipProps {
  children?: TextProps['children']
}

export const UiChip = ({ children }: UiChipProps) => {
  const { colorsTheme } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colorsTheme.surfaceContainer }]}>
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
