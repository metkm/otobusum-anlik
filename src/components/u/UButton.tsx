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
        icon: 'size-4',
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
        base: 'bg-primary/15',
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
    label: 'shrink font-inter-medium',
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
        >
          {label}
        </UText>
      )}
    </StyledBaseButton>
  )
}
