import Lucide from '@react-native-vector-icons/lucide'
import { Href, router } from 'expo-router'
import React, { ComponentProps } from 'react'
import { BaseButton } from 'react-native-gesture-handler'
import { tv } from 'tailwind-variants'
import { withUniwind } from 'uniwind'

import { UActivityIndicator } from './UActivityIndicator'
import { UIcon } from './UIcon'
import { UText } from './UText'

import { useLineTheme } from '@/composables/useLineTheme'
import { cn } from '@/utils/cn'

const StyledBaseButton = withUniwind(BaseButton)

type BaseButtonProps = ComponentProps<typeof StyledBaseButton>

const ui = tv({
  variants: {
    color: {
      primary: '',
      neutral: '',
    },
    variant: {
      solid: '',
      ghost: '',
      soft: '',
    },
    size: {
      md: {
        base: 'p-2',
        icon: 'size-4.5',
      },
      lg: {
        base: 'p-3',
        icon: 'size-4.5',
      },
    },
    block: {
      true: 'justify-center',
    },
    square: {
      true: '',
    },
    disabled: {
      true: 'opacity-75',
    },
  },
  compoundVariants: [
    {
      color: 'primary',
      variant: 'solid',
      className: {
        base: 'bg-primary',
        label: 'text-inverted',
      },
    },
    {
      color: 'primary',
      variant: 'soft',
      className: {
        base: 'bg-primary/10',
        label: 'text-default',
      },
    },
    {
      color: 'primary',
      variant: 'ghost',
      className: {
        base: 'bg-transparent',
        label: 'text-primary',
      },
    },
    {
      color: 'neutral',
      variant: 'soft',
      className: {
        base: 'bg-muted',
        label: 'text-default',
      },
    },
    {
      color: 'neutral',
      variant: 'solid',
      className: {
        base: 'bg-muted',
        label: 'text-default',
      },
    },
    {
      color: 'neutral',
      variant: 'ghost',
      className: {
        base: 'bg-transparent',
        label: 'text-default',
      },
    },
  ],
  slots: {
    base: 'bg-muted flex flex-row items-center gap-1.5 rounded-md',
    label: 'font-medium truncate shrink-1 text-sm',
    icon: '',
  },
})

export const UButton = ({
  label,
  className,
  icon,
  to,
  color = 'primary',
  variant = 'solid',
  size = 'md',
  block,
  children,
  style,
  disabled,
  loading,
  ...props
}: {
  label?: string
  icon?: ComponentProps<typeof Lucide>['name']
  to?: Href
  color?: 'primary' | 'neutral'
  variant?: 'solid' | 'ghost' | 'soft'
  size?: 'md' | 'lg'
  block?: boolean
  disabled?: boolean
  loading?: boolean
} & BaseButtonProps) => {
  const theme = useLineTheme()
  const { base: uiBase, label: uiLabel, icon: uiIcon } = ui({ color, variant, size, block, disabled })

  const handlePress: BaseButtonProps['onPress'] = () => {
    if (!to) return
    router.navigate(to)
  }

  const themeBackground = theme?.background({ variant })
  const themeText = theme?.text({ variant })

  return (
    <StyledBaseButton
      className={cn(
        uiBase(),
        className,
        'disabled:bg-red-500',
      )}
      onPress={handlePress}
      style={[themeBackground, style]}
      enabled={!disabled}
      {...props}
    >
      {
        loading
          ? (
              <UActivityIndicator
                sizeClassName={uiIcon()}
                className={uiLabel()}
                color={themeText?.color}
              />
            )
          : icon
            ? (
                <UIcon
                  name={icon}
                  sizeClassName={uiIcon()}
                  colorClassName={uiLabel()}
                  color={themeText?.color}
                />
              )
            : undefined
      }

      {children}

      {label && (
        <UText
          className={uiLabel()}
          numberOfLines={1}
          style={themeText}
          // style={themeStyle ? { color: themeStyle?.color } : undefined}
        >
          {label}
        </UText>
      )}
    </StyledBaseButton>
  )
}

// import { type Theme } from '@material/material-color-utilities'
// import Ionicons from '@react-native-vector-icons/ionicons'
// import React, { useCallback } from 'react'
// import { Platform, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
// import { BaseButton } from 'react-native-gesture-handler'

// import { useTheme } from '@/hooks/useTheme'

// import { UiActivityIndicator } from './UiActivityIndicator'
// import { UiText } from './UiText'

// import { ButtonVariants, iconSizes, size } from '@/constants/uiSizes'
// import { IconValue } from '@/types/ui'

// export interface UiButtonPropsBase {
//   theme?: Theme
//   isLoading?: boolean
//   square?: boolean
//   onPress?: () => void
//   onLongPress?: () => void
//   size?: size
//   disabled?: boolean
//   containerStyle?: StyleProp<ViewStyle>
//   innerContainerStyle?: StyleProp<ViewStyle>
//   iconColor?: string
//   textStyle?: StyleProp<TextStyle>
//   variant?: ButtonVariants
//   iconTrail?: IconValue
//   children?: React.ReactNode
//   align?: 'left'
//   error?: boolean
// }

// export interface UiButtonPropsWithIcon extends UiButtonPropsBase {
//   icon: IconValue
//   title?: string
// }

// export interface UiButtonPropsWithTitle extends UiButtonPropsBase {
//   icon?: IconValue
//   title: string
// }

// export type UiButtonProps = UiButtonPropsWithTitle | UiButtonPropsWithIcon

// export const UiButton = ({ size = 'md', variant = 'solid', error, ...props }: UiButtonProps) => {
//   const { schemeColor } = useTheme()

//   const defaultBackground
//     = variant === 'solid'
//       ? schemeColor.primary
//       : variant === 'error'
//         ? schemeColor.error
//         : variant === 'soft'
//           ? schemeColor.surfaceContainer
//           : undefined

//   const defaultTextColor
//     = variant === 'solid'
//       ? schemeColor.onPrimary
//       : variant === 'error'
//         ? schemeColor.onError
//         : variant === 'soft'
//           ? schemeColor.onSurface
//           : schemeColor.onSurface

//   const dynamicContainer: StyleProp<ViewStyle> = {
//     backgroundColor: defaultBackground,
//     opacity: props.disabled ? 0.5 : 1,
//   }

//   const dynamicText: StyleProp<TextStyle> = {
//     color: defaultTextColor,
//     ...(props.align === 'left' ? { flexGrow: 1, textAlign: 'left' } : {}),
//   }

//   const iconColor = dynamicText.color ?? props.iconColor

//   const Icon = useCallback(
//     ({ icon }: { icon: IconValue }) => {
//       if (props.isLoading) {
//         return <UiActivityIndicator size="small" color={iconColor} />
//       }

//       return (
//         <Ionicons
//           name={icon}
//           size={iconSizes[size]}
//           color={iconColor}
//         />
//       )
//     },
//     [iconColor, size, props.isLoading],
//   )

//   return (
//     <BaseButton
//       style={[
//         dynamicContainer,
//         styles.container,
//         props.containerStyle,
//         props.square ? styles.squareRadius : undefined,
//       ]}
//       onPress={props.onPress}
//       onLongPress={props.onLongPress}
//       rippleColor="black"
//       enabled={!props.disabled}
//     >
//       <View
//         {...(Platform.OS !== 'web'
//           ? {
//               accessible: true,
//               accessibilityRole: 'button',
//             }
//           : {})}
//         style={[
//           styles.innerContainer,
//           props.square ? styles.square : undefined,
//           props.innerContainerStyle,
//         ]}
//       >
//         {props.icon && <Icon icon={props.icon} />}

//         {props.title && (
//           <UiText
//             style={[styles.title, dynamicText, props.textStyle]}
//             size={size}
//             numberOfLines={1}
//           >
//             {props.title}
//           </UiText>
//         )}

//         {props.iconTrail && <Icon icon={props.iconTrail} />}
//         {props.children}
//       </View>
//     </BaseButton>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     minWidth: 48,
//     borderRadius: 999,
//     pointerEvents: 'auto',
//     flexGrow: 0,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   innerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 4,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   title: {
//     textAlign: 'center',
//     textAlignVertical: 'center',
//   },
//   square: {
//     borderRadius: 14,
//     paddingVertical: 14,
//     paddingHorizontal: 14,
//   },
//   squareRadius: {
//     borderRadius: 14,
//   },
// })
