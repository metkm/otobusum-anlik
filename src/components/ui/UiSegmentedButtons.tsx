import { type Theme } from '@material/material-color-utilities'
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native'

import { useTheme } from '@/hooks/useTheme'

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
  const { getSchemeColorHex } = useTheme()

  const selectedStyle: StyleProp<ViewStyle> = {
    backgroundColor: getSchemeColorHex('tertiaryContainer'),
  }

  const selectedTextStyle: StyleProp<TextStyle> = {
    color: getSchemeColorHex('onTertiaryContainer'),
  }

  const textStyle: StyleProp<TextStyle> = {
    color: getSchemeColorHex('onSecondaryContainer'),
  }

  return (
    <View style={[styles.container, style]}>
      {buttons.map((button) => {
        const selected = typeof value === 'number' ? ((button.value as number) & value) : button.value === value

        return (
          <UiButton
            key={button.label}
            title={button.label}
            variant="ghost"
            containerStyle={[styles.buttonContainer, selected ? selectedStyle : undefined]}
            textStyle={selected ? selectedTextStyle : textStyle}
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
