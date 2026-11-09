import { usePathname } from 'expo-router'
import type { ViewProps } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { LayoutAnimationTransition } from '@/constants/animation'
import { useSettingsStore } from '@/stores'
import { cn } from '@/utils/cn'

export const MapOverlay = ({ className, ...props }: ViewProps) => {
  const hideMap = useSettingsStore(useShallow((state) => state.hideMap))
  const lineCardExpanded = useSettingsStore(useShallow((state) => state.lineCardExpanded))
  const lineCardShowStops = useSettingsStore(useShallow((state) => state.lineCardShowStops))
  const pathname = usePathname()

  if (pathname === '/markers/nearby') {
    return
  }

  let heightClass = ''
  if (hideMap) {
    heightClass = 'h-full pt-safe'
  } else if (lineCardExpanded && lineCardShowStops) {
    heightClass = 'h-3/4'
  }

  return (
    <Animated.View
      layout={LayoutAnimationTransition}
      entering={FadeIn}
      exiting={FadeOut}
      className={cn(
        'absolute bottom-0 inset-x-0 pb-[calc(var(--navigation-height)+env(safe-area-inset-bottom))]',
        heightClass,
        className,
      )}
      pointerEvents="box-none"
      {...props}
    />
  )
}
