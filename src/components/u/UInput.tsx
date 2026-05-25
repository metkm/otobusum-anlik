import { ComponentProps } from 'react'
import { View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { tv } from 'tailwind-variants'

import { UActivityIndicator } from './UActivityIndicator'
import { UIcon } from './UIcon'

import { cn } from '@/utils/cn'

const ui = tv({
  variants: {
    variant: {
      outline: 'ring ring-inset ring-muted',
      soft: 'bg-muted/50',
    },
  },
  slots: {
    base: 'rounded-md px-3',
    icon: 'text-muted',
  },
})

export const UInput = ({
  variant = 'outline',
  className,
  icon,
  loading,
  containerClassName,
  ...props
}: {
  variant?: 'outline' | 'soft'
  icon?: ComponentProps<typeof UIcon>['name']
  loading?: boolean
  containerClassName?: string
} & ComponentProps<TextInput>) => {
  const { base: uiBase, icon: uiIcon } = ui({ variant })

  const _icon = loading
    ? <UActivityIndicator />
    : icon
      ? (
          <UIcon
            name={icon}
            colorClassName={uiIcon()}
          />
        )
      : undefined

  return (
    <View className={cn('relative', containerClassName)}>
      <TextInput
        className={cn(
          uiBase(),
          _icon ? 'pl-8' : undefined,
          className,
        )}
        {...props}
      />

      <View className="absolute left-2.5 inset-y-0 justify-center">
        {_icon}
      </View>
    </View>
  )
}
