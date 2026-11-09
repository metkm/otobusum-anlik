import { View, type ViewProps } from 'react-native'
import Animated from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { LayoutAnimationTransition } from '@/constants/animation'
import { useSettingsStore } from '@/stores'
import { cn } from '@/utils/cn'

import { LineCardMenu } from './LineCardMenu'
import { LineCardName } from './LineCardName'
import { LineCardRoutes } from './LineCardRoutes'
import { LineCardStops } from './LineCardStops'

export const LineCard = ({ style, className, ...props }: ViewProps) => {
  const showLineCardStops = useSettingsStore(useShallow((state) => state.lineCardShowStops))
  const hideMap = useSettingsStore(useShallow((state) => state.hideMap))

  return (
    <Animated.View
      layout={LayoutAnimationTransition}
      className={cn(
        'bg-default border-hairline border-muted rounded-md overflow-hidden',
        className,
      )}
      style={style}
      {...props}
    >
      <View className="border-b-hairline border-muted flex-row items-center justify-between p-2">
        <LineCardName />
        <LineCardMenu />
      </View>

      {(showLineCardStops || hideMap) && <LineCardStops />}

      <LineCardRoutes />
    </Animated.View>
  )
}
