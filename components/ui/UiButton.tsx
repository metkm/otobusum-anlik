import { Theme } from '@material/material-color-utilities'
import Ionicons from '@react-native-vector-icons/ionicons'
import React, { ComponentProps, useCallback } from 'react'
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { BaseButton } from 'react-native-gesture-handler'
import Animated, { AnimatedProps } from 'react-native-reanimated'

import { useTheme } from '@/hooks/useTheme'

import { UiActivityIndicator } from './UiActivityIndicator'
import { UiText } from './UiText'

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
  align?: 'left'
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
    ? getSchemeColorHex('primary')
    : variant === 'soft'
      ? getSchemeColorHex('surface')
      : undefined

  const defaultTextColor = variant === 'solid'
    ? getSchemeColorHex('onPrimary')
    : variant === 'soft'
      ? getSchemeColorHex('onSurface')
      : colorsTheme.color

  const dynamicContainer: StyleProp<ViewStyle> = {
    backgroundColor: props.theme ? getSchemeColorHex('secondaryContainer') : defaultBackground,
    opacity: props.disabled ? 0.75 : 1,
  }

  const dynamicText: StyleProp<TextStyle> = {
    color: props.theme ? getSchemeColorHex('onSecondaryContainer') : defaultTextColor,
    ...(
      props.align === 'left'
        ? { flexGrow: 1, textAlign: 'left' }
        : {}
    ),
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
    <BaseButton
      style={[styles.container, dynamicContainer, props.containerStyle, props.square ? styles.square : undefined]}
      onPress={props.onPress}
      onLongPress={props.onLongPress}
      rippleColor="black"
    >
      <View style={styles.innerContainer}>
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
      </View>
    </BaseButton>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 48,
    flexShrink: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  innerContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
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
