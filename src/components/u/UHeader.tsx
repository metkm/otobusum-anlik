import type { ReactNode } from 'react'
import { View } from 'react-native'

import { cn } from '@/utils/cn'

import { UIcon, type IconName } from './UIcon'
import { UText } from './UText'

interface UHeaderProps {
  title?: string
  description?: string
  icon?: IconName
  children?: ReactNode
  className?: string
}

export const UHeader = ({ icon, title, description, children, className }: UHeaderProps) => (
  <View
    className={cn(
      'flex-row items-center justify-between gap-2 bg-default border-b-hairline border-muted p-3',
      className,
    )}
  >
    <View className="flex-row items-center gap-2">
      {icon && (
        <UIcon
          name={icon}
          sizeClassName="size-8"
        />
      )}

      {(title || description) && (
        <View className="w-auto shrink">
          {title && <UText className="font-inter-medium">{title}</UText>}

          {description && (
            <UText className="font-inter-medium text-muted text-sm">{description}</UText>
          )}
        </View>
      )}
    </View>

    {children}
  </View>
)

export const USheetHeader = ({ icon, title, description, children }: UHeaderProps) => (
  <UHeader
    icon={icon}
    title={title}
    description={description}
    className="pt-5"
  >
    {children}
  </UHeader>
)
