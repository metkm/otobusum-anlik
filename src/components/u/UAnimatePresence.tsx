import type { ReactNode } from 'react'
import { View, type ViewProps } from 'react-native'
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated'

import { cn } from '@/utils/cn'

export const UAnimatePresence = ({
  children,
  className,
  ...props
}: {
  children: ReactNode
  className?: string
} & ViewProps ) => (
  <View className={cn('overflow-hidden shrink', className)}>
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutUp}
      className="shrink"
      {...props}
    >
      {children}
    </Animated.View>
  </View>
)
