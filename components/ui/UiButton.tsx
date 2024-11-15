import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native'
import { UiActivityIndicator } from './UiActivityIndicator'
import { Ionicons } from '@expo/vector-icons'

export interface UiButtonProps extends TouchableOpacityProps {
  title?: string
  isLoading?: boolean
  icon?: keyof typeof Ionicons.glyphMap
  disabled?: boolean
  textStyle?: StyleProp<TextStyle>
}

export function UiButton({ style, ...props }: UiButtonProps) {
  const dynamicStyle: StyleProp<ViewStyle> = {
    opacity: props.disabled ? 0.4 : 1,
  }

  return (
    <TouchableOpacity style={[styles.button, dynamicStyle, style]} {...props}>
      {props.isLoading
        ? (
            <UiActivityIndicator size={18} />
          )
        : props.icon
          ? (
              <Ionicons name={props.icon} size={18} color="white" style={props.textStyle} />
            )
          : null}

      {props.title && (
        <Text style={[styles.title, props.textStyle]} numberOfLines={1}>
          {props.title}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    gap: 4,
    minWidth: 48,
    padding: 8,
    paddingHorizontal: 12,
    flexShrink: 1,
  },
  title: {
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
})
