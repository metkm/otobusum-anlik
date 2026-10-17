import { ReactNode } from 'react'
import { View } from 'react-native'

import { IconName, UIcon } from './UIcon'
import { UText } from './UText'

import { cn } from '@/utils/cn'

interface UHeaderProps {
  title: string
  description?: string
  icon?: IconName
  children?: ReactNode
  className?: string
}

export const UHeader = ({ icon, title, description, children, className }: UHeaderProps) => {
  return (
    <View className={cn('flex-row justify-between gap-2 bg-muted/50 border-y border-muted p-2', className)}>
      <View className="flex-row gap-2 items-center">
        {icon && (
          <UIcon
            name={icon}
            sizeClassName="size-6"
          />
        )}

        <View className="shrink w-auto">
          <UText className="font-inter-medium">{title}</UText>

          {description && (
            <UText className="font-inter-medium text-xs text-muted">{description}</UText>
          )}
        </View>
      </View>

      {children}
    </View>
  )
}

export const USheetHeader = ({ icon, title, description, children }: UHeaderProps) => {
  return (
    <UHeader
      icon={icon}
      title={title}
      description={description}
      className="mt-8"
    >
      {children}
    </UHeader>
  )
}
