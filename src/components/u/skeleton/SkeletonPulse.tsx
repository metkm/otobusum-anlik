import { ViewProps } from 'react-native'
import Animated from 'react-native-reanimated'

import { cn } from '@/utils/cn'

export const SkeletonPulse = ({ className, ...props }: ViewProps) => (
  <Animated.View
    className={cn('shrink-0 bg-black/50 rounded-md', className)}
    style={{
      animationDirection: 'alternate',
      animationDuration: 2000,
      animationIterationCount: 'infinite',
      animationName: {
        from: {
          opacity: 0.5,
        },
        to: {
          opacity: 1,
        },
      },
      animationTimingFunction: 'ease-in-out',
    }}
    {...props}
  />
)
