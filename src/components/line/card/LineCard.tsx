import { View, type ViewProps } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { useSettingsStore } from '@/stores'
import { cn } from '@/utils/cn'

import { LineCardMenu } from './LineCardMenu'
import { LineCardName } from './LineCardName'
import { LineCardRoutes } from './LineCardRoutes'
import { LineCardStops } from './LineCardStops'

export const LineCard = ({ style, className, ...props }: ViewProps) => {
  const showLineCardStops = useSettingsStore(useShallow((state) => state.lineCardShowStops))

  return (
    <Animated.View
      layout={LinearTransition}
      className={cn('bg-default border-hairline border-muted rounded-md', className)}
      style={style}
      {...props}
    >
      <View className="border-b-hairline border-muted flex-row items-center justify-between p-2">
        <LineCardName />
        <LineCardMenu />
      </View>

      {showLineCardStops && <LineCardStops />}

      <LineCardRoutes />
    </Animated.View>
  )
}
