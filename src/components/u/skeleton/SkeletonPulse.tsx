import { ViewProps } from 'react-native'
import Animated from 'react-native-reanimated'

import { cn } from '@/utils/cn'

export const SkeletonPulse = ({ className, ...props }: ViewProps) => (
  <Animated.View
    className={cn('shrink-0 bg-muted rounded-md', className)}
    style={{
      animationDirection: 'alternate',
      animationDuration: 1500,
      animationIterationCount: 'infinite',
      animationName: {
        '50%': {
          opacity: 0.5,
        },
      },
      animationTimingFunction: 'ease-in-out',
    }}
    {...props}
  />
)
