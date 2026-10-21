import { View, ViewProps } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'

import { cn } from '@/utils/cn'

import { LineCardMenu } from './LineCardMenu'
import { LineCardName } from './LineCardName'
import { LineCardRoutes } from './LineCardRoutes'
import { LineCardStops } from './LineCardStops'

export const LineCard = ({ className, style, ...props }: ViewProps) => {
  return (
    <Animated.View
      layout={LinearTransition}
      className={cn('p-2 bg-default gap-2 rounded-md border-2 border-muted', className)}
      style={style}
      {...props}
    >
      <View className="flex-row items-center justify-between pl-1">
        <LineCardName />
        <LineCardMenu />
      </View>

      <LineCardStops />
      <LineCardRoutes />
    </Animated.View>
  )
}
