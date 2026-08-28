import { View, ViewProps } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'

import { LineCardMenu } from './LineCardMenu'
import { LineCardName } from './LineCardName'
import { LineCardRoutes } from './LineCardRoutes'
import { LineCardStops } from './LineCardStops'

import { useLineTheme } from '@/composables'
import { cn } from '@/utils/cn'

export const LineCard = ({ className, style, ...props }: ViewProps) => {
  const theme = useLineTheme()
  const background = theme?.backgroundWithColor({ variant: 'ghost' })
  const border = theme?.border({ variant: 'soft' })

  return (
    <Animated.View
      layout={LinearTransition}
      className={cn('bg-muted p-2 rounded-md gap-2 border-2', className)}
      style={[{ borderColor: border?.borderColor }, background, style]}
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
