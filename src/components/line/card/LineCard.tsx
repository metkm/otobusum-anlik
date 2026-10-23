import { View, type ViewProps } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'

import { cn } from '@/utils/cn'

import { LineCardMenu } from './LineCardMenu'
import { LineCardName } from './LineCardName'
import { LineCardRoutes } from './LineCardRoutes'
import { LineCardStops } from './LineCardStops'

export const LineCard = ({ style, className, ...props }: ViewProps) => (
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

    <LineCardStops />
    <LineCardRoutes />
  </Animated.View>
)
