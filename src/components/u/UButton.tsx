import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import type Lucide from '@react-native-vector-icons/lucide'
import type { ComponentProps } from 'react'
import { Touchable } from 'react-native-gesture-handler'
import { tv, type VariantProps } from 'tailwind-variants'
import { withUniwind } from 'uniwind'

import { cn } from '@/utils/cn'

import { UActivityIndicator } from './UActivityIndicator'
import { UIcon } from './UIcon'
import { UText } from './UText'

const StyledTouchable = withUniwind(Touchable)

type TouchableProps = ComponentProps<typeof StyledTouchable>

const ui = tv({
  compoundVariants: [
    {
      className: {
        base: 'bg-primary',
        label: 'text-inverted',
      },
      color: 'primary',
      variant: 'solid',
    },
    {
      className: {
        base: 'bg-primary/15',
        label: 'text-primary',
      },
      color: 'primary',
      variant: 'soft',
    },
    {
      className: {
        base: 'bg-transparent',
        label: 'text-primary',
      },
      color: 'primary',
      variant: 'ghost',
    },
    {
      className: {
        base: 'bg-neutral-elevated',
        label: 'text-neutral-default',
      },
      color: 'neutral',
      variant: 'soft',
    },
    {
      className: {
        base: 'bg-neutral-muted',
        label: 'text-neutral-default',
      },
      color: 'neutral',
      variant: 'solid',
    },
    {
      className: {
        base: 'bg-transparent',
        label: 'text-neutral-default',
      },
      color: 'neutral',
      variant: 'ghost',
    },
    {
      className: {
        base: 'bg-error',
        label: 'text-inverted',
      },
      color: 'error',
      variant: 'solid',
    },
    {
      className: {
        base: 'bg-error/15',
        label: 'text-error',
      },
      color: 'error',
      variant: 'soft',
    },
    {
      className: {
        base: 'bg-transparent',
        label: 'text-error',
      },
      color: 'error',
      variant: 'ghost',
    },
  ],
  slots: {
    base: 'flex flex-row items-center gap-1.5 rounded-md disabled:opacity-50',
    icon: '',
    label: 'shrink font-inter-medium text-xs',
  },
  variants: {
    block: {
      true: 'justify-center',
    },
    color: {
      error: '',
      neutral: '',
      primary: '',
    },
    disabled: {
      true: {
        base: 'opacity-50',
      },
    },
    size: {
      lg: {
        base: 'p-3',
        icon: 'size-4.5',
      },
      md: {
        base: 'p-2.5',
        icon: 'size-4',
      },
    },
    variant: {
      ghost: '',
      soft: '',
      solid: '',
    },
  },
})

export const UButton = ({
  label,
  className,
  icon,
  trailingIcon,
  to,
  color = 'primary',
  variant = 'solid',
  size = 'md',
  block,
  children,
  style,
  disabled,
  loading,
  labelClassName,
  ...props
}: TouchableProps & {
  label?: string
  icon?: ComponentProps<typeof Lucide>['name']
  trailingIcon?: ComponentProps<typeof Lucide>['name']
  to?: { pathname: string; params?: object }
  color?: VariantProps<typeof ui>['color']
  variant?: VariantProps<typeof ui>['variant']
  size?: 'md' | 'lg'
  block?: boolean
  disabled?: boolean
  loading?: boolean
  labelClassName?: string
}) => {
  const navigation = useTrueSheetNavigation()

  const {
    base: uiBase,
    label: uiLabel,
    icon: uiIcon,
  } = ui({ block, color, disabled, size, variant })

  const handlePress: TouchableProps['onPress'] = () => {
    if (!to) {
      return
    }

    navigation.navigate(to.pathname, to.params)
  }

  const Icon = () => {
    if (loading) {
      return (
        <UActivityIndicator
          sizeClassName={uiIcon()}
          className={uiLabel()}
        />
      )
    }

    if (icon) {
      return (
        <UIcon
          name={icon}
          sizeClassName={uiIcon()}
          colorClassName={uiLabel()}
        />
      )
    }
  }

  return (
    <StyledTouchable
      className={cn(uiBase(), className)}
      onPress={handlePress}
      style={style}
      underlayColor="black"
      animationDuration={0}
      androidRipple={{}}
      disabled={disabled}
      {...props}
    >
      <Icon />

      {children}

      {label && (
        <UText
          className={cn(uiLabel(), labelClassName)}
          numberOfLines={1}
        >
          {label}
        </UText>
      )}

      {trailingIcon && (
        <UIcon
          name={trailingIcon}
          sizeClassName={uiIcon()}
          colorClassName={uiLabel()}
          className="ml-auto"
        />
      )}
    </StyledTouchable>
  )
}
