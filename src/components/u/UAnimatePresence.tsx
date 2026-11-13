import type { ReactNode } from 'react'
import { View } from 'react-native'
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated'

export const UAnimatePresence = ({ key, children }: { key?: string; children: ReactNode }) => (
  <View className="overflow-hidden">
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
