import type { ViewProps } from 'react-native'
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { useSettingsStore } from '@/stores'
import { cn } from '@/utils/cn'

export const MapOverlay = ({ className, ...props }: ViewProps) => {
  const hideMap = useSettingsStore(useShallow((state) => state.hideMap))
  const lineCardExpanded = useSettingsStore(useShallow((state) => state.lineCardExpanded))

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn}
      exiting={FadeOut}
      className={cn(
        'absolute bottom-0 inset-x-0 pb-[calc(var(--navigation-height)+env(safe-area-inset-bottom))]',
        hideMap ? 'h-full pt-safe' : lineCardExpanded && 'h-3/4',
        className,
      )}
      pointerEvents="box-none"
      {...props}
    />
  )
}
