import { View } from 'react-native'
import Animated from 'react-native-reanimated'

import { useExpandableCardHeight } from '@/composables'
import { EnterScaleIn, ExitScaleOut, LayoutAnimationTransition } from '@/constants/animation'
import type { OnLayoutFunction } from '@/types/shared'
import { cn } from '@/utils/cn'

import { StopCardArrivals } from './StopCardArrivals'
import { StopCardMenu } from './StopCardMenu'
import { StopCardName } from './StopCardName'

interface StopCardProps {
  onLayout?: OnLayoutFunction
  className?: string
  showArrivals?: boolean
}

export const StopCard = ({ onLayout, className, showArrivals = true }: StopCardProps) => {
  const { style } = useExpandableCardHeight()

  return (
    <Animated.View
      onLayout={onLayout}
      style={showArrivals ? style : undefined}
      layout={LayoutAnimationTransition}
      className={cn(
        'border-hairline border-muted bg-default overflow-hidden rounded-md',
        className,
      )}
      exiting={ExitScaleOut}
      entering={EnterScaleIn}
    >
      <View className="border-b-hairline border-muted flex-row items-center gap-2 p-2">
        <StopCardName />
        <StopCardMenu />
      </View>

      {showArrivals && <StopCardArrivals />}
    </Animated.View>
  )
}
