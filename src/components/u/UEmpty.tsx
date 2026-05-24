import { ComponentProps } from 'react'
import { View } from 'react-native'

import { UIcon } from './UIcon'
import { UText } from './UText'

import { cn } from '@/utils/cn'

export const UEmpty = ({
  title,
  icon,
  description,
  className,
}: {
  title: string
  icon?: ComponentProps<typeof UIcon>['name']
  description?: string
  className?: string
}) => {
  return (
    <View className={cn('gap-2 items-center justify-center p-2 rounded-md', className)}>
      {icon && (
        <UIcon
          name={icon}
          sizeClassName="size-6"
          colorClassName="text-default"
          className="bg-muted rounded-md p-2"
        />
      )}

      <UText className="font-inter-medium">{title}</UText>

      {description && (
        <UText className="text-xs text-muted">{description}</UText>
      )}
    </View>
  )
}
