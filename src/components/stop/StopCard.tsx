import { View } from 'react-native'
import Animated from 'react-native-reanimated'

import { EnterScaleIn, ExitScaleOut, LayoutAnimationTransition } from '@/constants/animation'

import { StopCardArrivals } from './StopCardArrivals'
import { StopCardMenu } from './StopCardMenu'
import { StopCardName } from './StopCardName'

export const StopCard = () => (
  <Animated.View
    // layout={LayoutAnimationTransition}
    exiting={ExitScaleOut}
    entering={EnterScaleIn}
    className="border-hairline border-muted bg-default grow overflow-hidden rounded-md"
  >
    <View className="border-hairline border-muted flex-row items-center gap-2 border-b p-2">
      <StopCardName />
      <StopCardMenu />
    </View>

    <StopCardArrivals />
  </Animated.View>
)
