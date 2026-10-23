import { View, StyleSheet, type ViewProps } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'

import { cn } from '@/utils/cn'

import { LineCardMenu } from './LineCardMenu'
import { LineCardName } from './LineCardName'
import { LineCardRoutes } from './LineCardRoutes'
import { LineCardStops } from './LineCardStops'

export const LineCard = ({ className, style, ...props }: ViewProps) => (
  <Animated.View
    layout={LinearTransition}
    className={cn('bg-default rounded-md border-muted', className)}
    style={[style, { borderWidth: StyleSheet.hairlineWidth }]}
    {...props}
  >
    <View className="border-width-b-hairline border-muted flex-row items-center justify-between p-2">
      <LineCardName />
      <LineCardMenu />
    </View>

    <LineCardStops />
    <LineCardRoutes />
  </Animated.View>
)
