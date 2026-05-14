import { ViewProps } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { useSettingsStore } from '@/stores'
import { cn } from '@/utils/cn'

export const MapOverlay = ({ className, ...props }: ViewProps) => {
  const hideMap = useSettingsStore(useShallow(state => state.hideMap))
  const lineCardExpanded = useSettingsStore(useShallow(state => state.lineCardExpanded))

  return (
    <Animated.View
      layout={LinearTransition}
      className={cn(
        'absolute bottom-0',
        hideMap
          ? 'h-full pt-safe'
          : lineCardExpanded
            ? 'h-3/4'
            : '',
        className,
      )}
      pointerEvents="box-none"
      {...props}
    />
  )
}
