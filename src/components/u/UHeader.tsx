import { ReactNode } from 'react'
import { View } from 'react-native'

import { cn } from '@/utils/cn'

import { IconName, UIcon } from './UIcon'
import { UText } from './UText'

interface UHeaderProps {
  title?: string
  description?: string
  icon?: IconName
  children?: ReactNode
  className?: string
}

export const UHeader = ({ icon, title, description, children, className }: UHeaderProps) => {
  return (
    <View
      className={cn(
        'flex-row items-center justify-between gap-2 bg-default border-b border-muted p-2',
        className,
      )}
    >
      <View className="flex-row items-center gap-2">
        {icon && <UIcon name={icon} sizeClassName="size-6" />}

        {(title || description) && (
          <View className="w-auto shrink">
            {title && <UText className="font-inter-medium">{title}</UText>}

            {description && (
              <UText className="font-inter-medium text-muted text-xs">{description}</UText>
            )}
          </View>
        )}
      </View>

      {children}
    </View>
  )
}

export const USheetHeader = ({ icon, title, description, children }: UHeaderProps) => {
  return (
    <UHeader icon={icon} title={title} description={description} className="pt-8">
      {children}
    </UHeader>
  )
}
