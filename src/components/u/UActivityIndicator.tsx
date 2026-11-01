import { ActivityIndicator, type ActivityIndicatorProps, View } from 'react-native'

import { cn } from '@/utils/cn'

export interface UActivityIndicatorProps extends ActivityIndicatorProps {
  className?: string
}

export const UActivityIndicator = ({
  className,
  colorClassName,
  ...props
}: UActivityIndicatorProps) => (
  <View className={cn('items-center justify-center', className)}>
    <ActivityIndicator
      colorClassName={cn('accent-default', colorClassName)}
      {...props}
    />
  </View>
)
