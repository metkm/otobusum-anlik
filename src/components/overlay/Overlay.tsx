import { usePathname } from 'expo-router'
import type { ViewProps } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { LayoutAnimationTransition } from '@/constants/animation'
import { useSettingsStore } from '@/stores'
import { cn } from '@/utils/cn'

export const Overlay = ({ className, ...props }: ViewProps) => {
  // const hideMap = useSettingsStore(useShallow((state) => state.hideMap))
  // const lineCardExpanded = useSettingsStore(useShallow((state) => state.lineCardExpanded))
  // const lineCardShowStops = useSettingsStore(useShallow((state) => state.lineCardShowStops))
  const pathname = usePathname()

  if (pathname === '/markers/nearby') {
    return
  }

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className={cn(
        'absolute justify-end inset-x-0 px-safe top-safe bottom-[calc(var(--navigation-height)+env(safe-area-inset-bottom))]',
        className,
      )}
      pointerEvents="box-none"
      {...props}
    />
  )
}
