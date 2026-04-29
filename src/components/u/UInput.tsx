import { ComponentProps } from 'react'
import { View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

import { UActivityIndicator } from './UActivityIndicator'
import { UIcon } from './UIcon'

import { cn } from '@/utils/cn'

export const UInput = ({
  className,
  icon,
  loading,
  ...props
}: { icon?: ComponentProps<typeof UIcon>['name'], loading?: boolean } & ComponentProps<TextInput>) => {
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
    <View className={cn('relative', className)}>
      <TextInput
        className={cn('bg-muted rounded-md px-3', _icon ? 'pl-9' : undefined)}
        {...props}
      />

      <View className="absolute left-2 inset-y-0 justify-center">
        {_icon}
      </View>
    </View>
  )
}
