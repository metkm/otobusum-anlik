import { View } from 'react-native'
import Animated from 'react-native-reanimated'

import { useExpandableCardHeight } from '@/composables'
import { EnterScaleIn, ExitScaleOut, LayoutAnimationTransition } from '@/constants/animation'
import type { OnLayoutFunction } from '@/types/shared'

import { StopCardArrivals } from './StopCardArrivals'
import { StopCardMenu } from './StopCardMenu'
import { StopCardName } from './StopCardName'

interface StopCardProps {
  onLayout?: OnLayoutFunction
}

export const StopCard = ({ onLayout }: StopCardProps) => {
  const { style } = useExpandableCardHeight()

  return (
    <Animated.View
      onLayout={onLayout}
      layout={LayoutAnimationTransition}
      exiting={ExitScaleOut}
      entering={EnterScaleIn}
      style={style}
      className="border-hairline border-muted bg-default grow overflow-hidden rounded-md"
    >
      <View className="border-b-hairline border-muted flex-row items-center gap-2 p-2">
        <StopCardName />
        <StopCardMenu />
      </View>

      <StopCardArrivals />
    </Animated.View>
  )
}
