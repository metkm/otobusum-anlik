import { Theme } from '@material/material-color-utilities'
import Ionicons from '@react-native-vector-icons/ionicons'
import React, { ComponentProps, useCallback } from 'react'
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from 'react-native'
import Animated, { AnimatedProps } from 'react-native-reanimated'

import { useTheme } from '@/hooks/useTheme'

import { UiActivityIndicator } from './UiActivityIndicator'
import { UiText } from './UiText'

import { colors } from '@/constants/colors'
import { ButtonVariants, IconSize, iconSizes } from '@/constants/uiSizes'

type IconValues = ComponentProps<typeof Ionicons>['name']

interface UiButtonPropsBase {
  theme?: Theme
  isLoading?: boolean
  square?: boolean
  onPress?: () => void
  onLongPress?: () => void
  iconSize?: IconSize
  disabled?: boolean
  containerStyle?: StyleProp<ViewStyle>
  iconColor?: string
  textStyle?: StyleProp<TextStyle>
  animatedIconProps?: Partial<AnimatedProps<typeof Ionicons>>
  variant?: ButtonVariants
  iconTrail?: IconValues
  children?: React.ReactNode
}

interface UiButtonPropsWithIcon extends UiButtonPropsBase {
  icon: IconValues
  title?: string
}

interface UiButtonPropsWithTitle extends UiButtonPropsBase {
  icon?: IconValues
  title: string
}

type UiButtonProps = UiButtonPropsWithTitle | UiButtonPropsWithIcon

const AnimatedIonIcons = Animated.createAnimatedComponent(Ionicons)

export const UiButton = ({ iconSize = 'md', variant = 'solid', ...props }: UiButtonProps) => {
  const { getSchemeColorHex, colorsTheme } = useTheme(props.theme)

  const defaultBackground = variant === 'solid'
    ? colors.primary
    : variant === 'soft'
      ? colorsTheme.surfaceContainer
      : undefined

  const dynamicContainer: StyleProp<ViewStyle> = {
    backgroundColor: getSchemeColorHex('secondaryContainer') || defaultBackground,
    opacity: props.disabled ? 0.4 : 1,
  }

  const dynamicText: StyleProp<TextStyle> = {
    color: getSchemeColorHex('onSecondaryContainer') || colorsTheme.color,
  }

  const iconColor = dynamicText.color ?? props.iconColor

  const Icon = useCallback(({ icon }: { icon: IconValues }) => {
    if (props.isLoading) {
      return (
        <UiActivityIndicator
          size="small"
          color={iconColor}
        />
      )
    }

    if (props.animatedIconProps) {
      return (
        <AnimatedIonIcons
          name={icon}
          size={iconSizes[iconSize]}
          animatedProps={props.animatedIconProps}
        />
      )
    }

    return (
      <Ionicons
        name={icon}
        size={iconSizes[iconSize]}
        color={iconColor}
      />
    )
  }, [iconColor, iconSize, props.animatedIconProps, props.isLoading])

  return (
    <TouchableOpacity
      style={[styles.container, dynamicContainer, props.containerStyle, props.square ? styles.square : undefined]}
      onPress={props.onPress}
      onLongPress={props.onLongPress}
    >
      {props.icon && <Icon icon={props.icon} />}

      {props.title && (
        <UiText
          style={[styles.title, dynamicText, props.textStyle]}
          numberOfLines={1}
        >
          {props.title}
        </UiText>
      )}

      {props.iconTrail && <Icon icon={props.iconTrail} />}
      {props.children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    minWidth: 48,
    flexShrink: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  title: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  square: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
})
