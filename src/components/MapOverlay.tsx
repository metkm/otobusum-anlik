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
        'gap-2 items-start',
        hideMap
          ? 'flex-1 pt-safe'
          : lineCardExpanded
            ? `absolute bottom-0 top-[calc(env(safe-area-inset-top)+100)]`
            : 'absolute bottom-0 max-h-92',
        className,
      )}
      {...props}
    />
  )
}
