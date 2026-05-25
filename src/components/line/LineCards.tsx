import { Dimensions } from 'react-native'
import Animated, { LinearTransition, SharedValue } from 'react-native-reanimated'

import { UCarousel } from '../u/UCarousel'

import { LineCard } from './card/LineCard'

import { useLineCardWidth } from '@/composables'
import { LineContext } from '@/composables/useLine'
import { useLines } from '@/composables/useLines'
import { ExitScaleOut } from '@/constants/animation'
import { cn } from '@/utils/cn'

const { width } = Dimensions.get('window')

export const LineCards = ({ className }: { className?: string, buttonsHeight?: SharedValue<number> }) => {
  const { cardWidth, snapInterval } = useLineCardWidth()
  const lines = useLines()

  return (
    <UCarousel
      snapInterval={snapInterval}
      style={{ width }}
      contentClassName={cn(
        'gap-2',
        lines.length > 1 ? 'p-2 pt-0' : 'p-0',
      )}
      className={className}
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
              className={cn(
                'grow',
                lines.length < 2 && 'rounded-b-none',
              )}
            />
          </LineContext>
        </Animated.View>
      ))}
    </UCarousel>
  )
}
