import type { ComponentProps } from 'react'
import { ActivityIndicator, View } from 'react-native'

import { cn } from '@/utils/cn'

export const UActivityIndicator = ({
  className,
  colorClassName,
  ...props
}: {
  className?: string
} & ComponentProps<typeof ActivityIndicator>) => (
  <View className={cn('items-center justify-center', className)}>
    <ActivityIndicator
      colorClassName={cn('accent-default', colorClassName)}
      {...props}
    />
  </View>
)
