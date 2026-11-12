import { View } from 'react-native'
import Animated from 'react-native-reanimated'

import { useExpandableCardHeight } from '@/composables'
import { EnterScaleIn, ExitScaleOut } from '@/constants/animation'

import { StopCardArrivals } from './StopCardArrivals'
import { StopCardMenu } from './StopCardMenu'
import { StopCardName } from './StopCardName'

export const StopCard = () => {
  const { style } = useExpandableCardHeight()

  return (
    <Animated.View
      exiting={ExitScaleOut}
      entering={EnterScaleIn}
      style={style}
      className="border-hairline border-muted bg-default grow overflow-hidden rounded-md"
    >
      <View className="border-hairline border-muted flex-row items-center gap-2 border-b p-2">
        <StopCardName />
        <StopCardMenu />
      </View>

      <StopCardArrivals />
    </Animated.View>
  )
}
