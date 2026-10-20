import Lucide from '@react-native-vector-icons/lucide'
import { Href, useRouter } from 'expo-router'
import { ComponentProps } from 'react'
import { BaseButton } from 'react-native-gesture-handler'
import { tv } from 'tailwind-variants'
import { withUniwind } from 'uniwind'

import { UActivityIndicator } from './UActivityIndicator'
import { UIcon } from './UIcon'
import { UText } from './UText'

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
        base: 'p-2.5',
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
        label: 'text-primary',
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
        base: 'bg-neutral-elevated',
        label: 'text-neutral-default',
      },
    },
    {
      color: 'neutral',
      variant: 'solid',
      className: {
        base: 'bg-neutral-muted',
        label: 'text-neutral-default',
      },
    },
    {
      color: 'neutral',
      variant: 'ghost',
      className: {
        base: 'bg-transparent',
        label: 'text-neutral-default',
      },
    },
  ],
  slots: {
    base: 'flex flex-row items-center gap-1.5 rounded-md',
    label: 'shrink font-inter-medium text-xs',
    icon: '',
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
}: {
  label?: string
  icon?: ComponentProps<typeof Lucide>['name']
  trailingIcon?: ComponentProps<typeof Lucide>['name']
  to?: Href
  color?: 'primary' | 'neutral'
  variant?: 'solid' | 'ghost' | 'soft'
  size?: 'md' | 'lg'
  block?: boolean
  disabled?: boolean
  loading?: boolean
  labelClassName?: string
} & BaseButtonProps) => {
  const router = useRouter()

  const { base: uiBase, label: uiLabel, icon: uiIcon } = ui({ color, variant, size, block, disabled })

  const handlePress: BaseButtonProps['onPress'] = () => {
    if (!to) return
    router.push(to)
  }

  return (
    <StyledBaseButton
      className={cn(
        uiBase(),
        className,
      )}
      onPress={handlePress}
      style={style}
      enabled={!disabled}
      {...props}
    >
      {
        loading
          ? (
              <UActivityIndicator
                sizeClassName={uiIcon()}
                className={uiLabel()}
              />
            )
          : icon
            ? (
                <UIcon
                  name={icon}
                  sizeClassName={uiIcon()}
                  colorClassName={uiLabel()}
                />
              )
            : undefined
      }

      {children}

      {label && (
        <UText
          className={cn(
            uiLabel(),
            labelClassName,
          )}
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
    </StyledBaseButton>
  )
}
