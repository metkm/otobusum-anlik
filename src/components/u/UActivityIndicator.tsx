import { ActivityIndicator, type ActivityIndicatorProps, View } from 'react-native'
import { withUniwind } from 'uniwind'

import { cn } from '@/utils/cn'

const StyledActivityIndicator = withUniwind(ActivityIndicator, {
  size: {
    fromClassName: 'sizeClassName',
    styleProperty: 'width',
  },
})

export interface UActivityIndicatorProps extends ActivityIndicatorProps {
  className?: string
  sizeClassName?: string
}

export const UActivityIndicator = ({
  className,
  colorClassName,
  sizeClassName,
  ...props
}: UActivityIndicatorProps) => (
  <View className={cn('items-center justify-center', className)}>
    <StyledActivityIndicator
      colorClassName={cn('accent-default', colorClassName)}
      sizeClassName={cn('size-5', sizeClassName)}
      {...props}
    />
  </View>
)
