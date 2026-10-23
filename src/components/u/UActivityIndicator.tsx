import type { ComponentProps } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { withUniwind } from 'uniwind'

import { cn } from '@/utils/cn'

const StyledActivityIndicator = withUniwind(ActivityIndicator, {
  size: {
    fromClassName: 'sizeClassName',
    styleProperty: 'width',
  },
})

export const UActivityIndicator = ({
  className,
  ...props
}: {
  className?: string
} & ComponentProps<typeof StyledActivityIndicator>) => (
  <View className={cn('items-center justify-center', className)}>
    <ActivityIndicator
      colorClassName="accent-(--ui-text)"
      {...props}
    />
  </View>
)
