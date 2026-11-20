import { usePathname } from 'expo-router'
import type { ViewProps } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

import { cn } from '@/utils/cn'

export const Overlay = ({ className, ...props }: ViewProps) => {
  const pathname = usePathname()

  if (pathname === '/markers/nearby') {
    return
  }

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className={cn(
        'absolute inset-x-0 top-safe bottom-0 px-safe pb-nav-offset-2 overflow-hidden',
        className,
      )}
      pointerEvents="box-none"
      {...props}
    />
  )
}
