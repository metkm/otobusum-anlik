import { View } from 'react-native'

import { cn } from '@/utils/cn'

import { IconName, UIcon } from './UIcon'
import { UText } from './UText'

export const UEmpty = ({
  title,
  icon,
  description,
  className,
}: {
  title: string
  icon?: IconName
  description?: string
  className?: string
}) => (
  <View className={cn('gap-2 items-center justify-center p-2 rounded-md bg-muted/15', className)}>
    {icon && (
      <UIcon
        name={icon}
        sizeClassName="size-6"
        className="bg-muted rounded-md p-2"
      />
    )}

    <UText className="font-inter-medium">{title}</UText>

    {description && <UText className="text-muted text-sm">{description}</UText>}
  </View>
)
