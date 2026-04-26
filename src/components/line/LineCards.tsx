import { Dimensions } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { UCarousel } from '../u/UCarousel'

import { LineCard } from './card/LineCard'

import { useLineCardWidth } from '@/composables'
import { LineContext } from '@/composables/useLine'
import { ExitScaleOut } from '@/constants/animation'
import { useLineStore } from '@/stores'

const width = Dimensions.get('window').width

export const LineCards = () => {
  const { cardWidth, snapInterval } = useLineCardWidth()
  const lines = useLineStore(useShallow(state => state.lines()))

  return (
    <UCarousel
      snapInterval={snapInterval}
      style={{ width }}
      contentClassName="p-2 gap-2"
    >
      {lines.map(code => (
        <Animated.View
          key={code}
          exiting={ExitScaleOut}
          layout={LinearTransition}
        >
          <LineContext value={code}>
            <LineCard
              style={{ width: cardWidth }}
              className={lines.length < 2 ? 'rounded-none' : ''}
            />
          </LineContext>
        </Animated.View>
      ))}
    </UCarousel>
  )
}
