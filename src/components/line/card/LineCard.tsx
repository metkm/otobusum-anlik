import { type ViewProps, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { useExpandableCardHeight } from '@/composables'
import { ExitScaleOut, EnterScaleIn, LayoutAnimationTransition } from '@/constants/animation'
import { useSettingsStore } from '@/stores'
import { cn } from '@/utils/cn'

import { LineCardMenu } from './LineCardMenu'
import { LineCardName } from './LineCardName'
import { LineCardRoutes } from './LineCardRoutes'
import { LineCardStops } from './LineCardStops'

export const LineCard = ({ className, ...props }: ViewProps) => {
  const showLineCardStops = useSettingsStore(useShallow((state) => state.lineCardShowStops))
  const hideMap = useSettingsStore(useShallow((state) => state.hideMap))
  const { style } = useExpandableCardHeight()

  return (
    <Animated.View
      // key={showLineCardStops.toString()}
      layout={LayoutAnimationTransition}
      style={showLineCardStops ? style : undefined}
      className={cn(
        'bg-default border-hairline border-muted rounded-md overflow-hidden grow',
        className,
      )}
      exiting={ExitScaleOut}
      entering={EnterScaleIn}
      {...props}
    >
      <View className="border-b-hairline border-muted flex-row items-center justify-between p-2">
        <LineCardName />
        <LineCardMenu />
      </View>

      {(showLineCardStops || hideMap) && <LineCardStops />}

      <Animated.View layout={LayoutAnimationTransition}>
        <LineCardRoutes />
      </Animated.View>
    </Animated.View>
  )
}
