import Ionicons from '@react-native-vector-icons/ionicons'
import { Href, router } from 'expo-router'
import React, { ComponentProps } from 'react'
import { BaseButton } from 'react-native-gesture-handler'
import { tv } from 'tailwind-variants'
import { useResolveClassNames, withUniwind } from 'uniwind'

import { UText } from './UText'

import { IconName } from '@/types/ui'
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
      color: 'neutral',
      variant: 'solid',
      className: {
        base: 'bg-muted',
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
      variant: 'ghost',
      className: {
        base: 'bg-transparent',
        label: 'text-default',
      },
    },
  ],
  slots: {
    base: 'flex flex-row items-center gap-1 py-2 px-3 rounded-md',
    label: 'font-medium',
  },
})

export const UButton = ({
  label,
  className,
  icon,
  square,
  to,
  color = 'primary',
  variant = 'solid',
  ...props
}: {
  label?: string
  icon?: IconName
  square?: boolean
  to?: Href
  color?: 'primary' | 'neutral'
  variant?: 'solid' | 'ghost'
} & BaseButtonProps) => {
  const handlePress: BaseButtonProps['onPress'] = () => {
    if (!to) return
    router.navigate(to)
  }

  const { base: uiBase, label: uiLabel } = ui({ color, variant })

  const uiLabelStyle = useResolveClassNames(uiLabel())

  return (
    <StyledBaseButton
      className={cn(
        uiBase(),
        square ? 'p-3' : 'py-2 px-3',
        className,
      )}
      onPress={handlePress}
      {...props}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={uiLabelStyle.color}
        />
      )}

      {label && (
        <UText
          className={uiLabel()}
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
