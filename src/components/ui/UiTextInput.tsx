import { RefObject } from 'react'
import { Platform, StyleProp, StyleSheet, TextInputProps, TextStyle, View, ViewStyle } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

import { useTheme } from '@/hooks/useTheme'

import { UiButton } from './UiButton'

import { IconSize } from '@/constants/uiSizes'
import { IconValue } from '@/types/ui'

interface UiTextInputProps extends TextInputProps {
  icon?: IconValue
  iconSize?: IconSize
  iconPress?: () => void
  ref?: RefObject<TextInput>
  styleContainer?: StyleProp<ViewStyle>
}

export const UiTextInput = ({ iconSize = 'md', icon, iconPress, ref, style, styleContainer, ...props }: UiTextInputProps) => {
  const { schemeColor } = useTheme()

  const dynamicStyle: StyleProp<ViewStyle> = {
    backgroundColor: schemeColor.surfaceContainer,
  }

  const inputStyle: StyleProp<TextStyle> = {
    color: schemeColor.onSurface,
    display: 'flex',
    paddingHorizontal: icon ? 0 : 8 * 2.5,
    flex: 1,
  }

  return (
    <View style={[styles.input, styleContainer, dynamicStyle]}>
      {icon && (
        <View style={styles.iconContainer}>
          <UiButton
            onPress={iconPress}
            icon={icon}
            variant={iconPress ? 'solid' : 'ghost'}
          />
        </View>
      )}
      <TextInput
        ref={ref}
        style={[style, inputStyle]}
        placeholderTextColor={schemeColor.onSurface}
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 999,
    flexDirection: 'row',
    paddingVertical: Platform.OS === 'web' ? 8 : 0,
    gap: 8,
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginLeft: 8,
  },
})
