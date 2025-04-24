import { StyleProp, StyleSheet, TextInputProps, TextStyle, View, ViewStyle } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

import { useTheme } from '@/hooks/useTheme'
import { IconSize, iconSizes } from '@/constants/uiSizes'
import { IconValue } from '@/types/ui'
import { Ref } from 'react'
import Icon from '@react-native-vector-icons/ionicons'

interface UiTextInputProps extends TextInputProps {
  icon?: IconValue
  iconSize?: IconSize
  cRef?: Ref<TextInput>
  styleContainer?: StyleProp<ViewStyle>
}

export const UiTextInput = ({ iconSize = 'md', cRef, style, styleContainer, icon, ...props }: UiTextInputProps) => {
  const { getSchemeColorHex, colorsTheme } = useTheme()

  const dynamicStyle: StyleProp<ViewStyle> = {
    backgroundColor: colorsTheme.surfaceContainerLow,
  }

  const inputStyle: StyleProp<TextStyle> = {
    color: getSchemeColorHex('onSurface'),
    paddingLeft: icon ? 14 * 2 : 14,
    display: 'flex',
  }

  return (
    <View style={[styles.input, styleContainer, dynamicStyle]}>
      <View style={styles.iconContainer}>
        {icon && (
          <Icon name={icon} color={getSchemeColorHex('onSurfaceVariant')} size={iconSizes[iconSize]} />
        )}
      </View>

      <TextInput
        ref={cRef}
        style={[style, inputStyle]}
        placeholderTextColor={getSchemeColorHex('onSurfaceVariant')} // should be less opacity
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 999,
    paddingLeft: 14,
    paddingRight: 14,
    paddingVertical: 6,
    position: 'relative',
    display: 'flex',
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    marginLeft: 14,
  },
})
