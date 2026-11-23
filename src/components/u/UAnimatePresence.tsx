import type { ReactNode } from 'react'
import { type ViewProps } from 'react-native'
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated'

export const UAnimatePresence = ({
  children,
  ...props
}: {
  children: ReactNode
} & ViewProps) => (
  <Animated.View
    entering={FadeInDown}
    exiting={FadeOutUp}
    className="shrink overflow-hidden"
    {...props}
  >
    {children}
  </Animated.View>
)
