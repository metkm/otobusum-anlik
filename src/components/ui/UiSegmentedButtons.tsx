import { type Theme } from '@material/material-color-utilities'
import {
  StyleSheet,
  TouchableOpacityProps,
  View,
} from 'react-native'

import { UiButton } from './UiButton'

interface Button<T> {
  label: string
  value: T
}

interface UiSegmentedButtonsProps<T> extends TouchableOpacityProps {
  buttons: Button<T>[]
  value?: T
  onValueChange?: (value: T) => void
  theme?: Theme
}

export const UiSegmentedButtons = <T,>({ buttons, value, style, onValueChange }: UiSegmentedButtonsProps<T>) => {
  return (
    <View style={[styles.container, style]}>
      {buttons.map((button) => {
        const selected = typeof value === 'number' ? ((button.value as number) & value) : button.value === value

        return (
          <UiButton
            key={button.label}
            title={button.label}
            variant={selected ? 'solid' : 'soft'}
            containerStyle={styles.buttonContainer}
            onPress={() => onValueChange?.(button.value)}
            square
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginHorizontal: 8,
  },
  buttonContainer: {
    flexGrow: 1,
  },
})
