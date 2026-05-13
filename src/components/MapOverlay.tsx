import { View, ViewProps } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useSettingsStore } from '@/stores'
import { cn } from '@/utils/cn'

export const MapOverlay = ({ className, ...props }: ViewProps) => {
  const hideMap = useSettingsStore(useShallow(state => state.hideMap))

  return (
    <View
      className={cn(
        'gap-2 items-start',
        hideMap ? 'flex-1 pt-safe' : 'absolute bottom-0',
        className,
      )}
      {...props}
    />
  )
}
