import type { ReactNode } from 'react'
import { View } from 'react-native'
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated'

import { cn } from '@/utils/cn'

export const UAnimatePresence = ({
  key,
  children,
  className,
}: {
  key?: string
  children: ReactNode
  className?: string
}) => (
  <View className={cn('overflow-hidden shrink', className)}>
    <Animated.View
      key={key}
      entering={FadeInDown}
      exiting={FadeOutUp}
      className="shrink"
    >
      {children}
    </Animated.View>
  </View>
)
