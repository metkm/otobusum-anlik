import { View } from 'react-native'
import Animated from 'react-native-reanimated'

import { useExpandableCardHeight } from '@/composables'
import type { OnLayoutFunction } from '@/types/shared'
import { cn } from '@/utils/cn'

import { StopCardArrivals } from './StopCardArrivals'
import { StopCardMenu } from './StopCardMenu'
import { StopCardName } from './StopCardName'

interface StopCardProps {
  onLayout?: OnLayoutFunction
  className?: string
}

export const StopCard = ({ onLayout, className }: StopCardProps) => {
  const { style } = useExpandableCardHeight()

  return (
    <Animated.View
      onLayout={onLayout}
      style={style}
      className={cn(
        'border-hairline border-muted bg-default grow overflow-hidden rounded-md',
        className,
      )}
    >
      <View className="border-b-hairline border-muted flex-row items-center gap-2 p-2">
        <StopCardName />
        <StopCardMenu />
      </View>

      <StopCardArrivals />
    </Animated.View>
  )
}
