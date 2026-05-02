import { ComponentProps } from 'react'
import Animated from 'react-native-reanimated'
import { AnimatedView } from 'react-native-reanimated/lib/typescript/component/View'

import { cn } from '@/utils/cn'

export const SkeletonPulse = ({ className, ...props }: ComponentProps<AnimatedView>) => {
  return (
    <Animated.View
      className={cn('shrink-0 bg-black/50 rounded-md', className)}
      style={{
        animationName: {
          '50%': {
            opacity: 0.5,
          },
        },
        animationDuration: 2000,
        animationIterationCount: 'infinite',
      }}
      {...props}
    />
  )
}
