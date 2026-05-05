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
      outline: 'border border-muted',
      soft: 'bg-muted/50',
    },
  },
  slots: {
    base: 'rounded-md px-3',
  },
})

export const UInput = ({
  variant = 'outline',
  className,
  icon,
  loading,
  ...props
}: {
  variant?: 'outline' | 'soft'
  icon?: ComponentProps<typeof UIcon>['name']
  loading?: boolean
} & ComponentProps<TextInput>) => {
  const { base: uiBase } = ui({ variant })

  const _icon = loading
    ? <UActivityIndicator />
    : icon
      ? (
          <UIcon
            name={icon}
            colorClassName="text-default"
          />
        )
      : undefined

  return (
    <View className="relative">
      <TextInput
        // 'bg-muted rounded-md px-3',
        className={cn(
          uiBase(),
          _icon ? 'pl-9' : undefined,
          className,
        )}
        {...props}
      />

      <View className="absolute left-2 inset-y-0 justify-center">
        {_icon}
      </View>
    </View>
  )
}
