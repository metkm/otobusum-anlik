import { View, type ViewProps } from 'react-native'
import Animated from 'react-native-reanimated'

import { ItemLayoutAnimation } from '@/constants/animation'
import { cn } from '@/utils/cn'

import { LineCardMenu } from './LineCardMenu'
import { LineCardName } from './LineCardName'
import { LineCardRoutes } from './LineCardRoutes'
import { LineCardStops } from './LineCardStops'

export const LineCard = ({ className, style, ...props }: ViewProps) => (
  <Animated.View
    layout={ItemLayoutAnimation}
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
