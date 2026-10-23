import type { ComponentProps } from 'react'
import { View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { type VariantProps } from 'tailwind-variants'

import { cn, tv } from '@/utils/cn'

import { UActivityIndicator } from './UActivityIndicator'
import { UIcon } from './UIcon'

const ui = tv({
  slots: {
    base: 'rounded-md p-3 grow',
    icon: 'text-muted',
  },
  variants: {
    variant: {
      outline: 'border-hairline border-accented',
      soft: 'bg-neutral-elevated',
    },
  },
})

export const UInput = ({
  variant = 'outline',
  className,
  icon,
  loading,
  containerClassName,
  children,
  ...props
}: {
  variant?: VariantProps<typeof ui>['variant']
  icon?: ComponentProps<typeof UIcon>['name']
  loading?: boolean
  containerClassName?: string
} & ComponentProps<TextInput>) => {
  const { base: uiBase, icon: uiIcon } = ui({ variant })

  const Icon = () => {
    if (loading) {
      return <UActivityIndicator className="absolute left-2.5" />
    }

    if (icon) {
      return (
        <UIcon
          name={icon}
          colorClassName={uiIcon()}
          className="absolute left-2.5"
        />
      )
    }
  }

  return (
    <View className={cn('relative flex-row items-center', containerClassName)}>
      <TextInput
        className={cn(uiBase(), icon || loading ? 'pl-10' : undefined, className)}
        {...props}
      />

      <Icon />

      {children}
    </View>
  )
}
