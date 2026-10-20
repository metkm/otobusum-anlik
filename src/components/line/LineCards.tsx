import { Dimensions } from 'react-native'
import Animated, { LinearTransition, SharedValue } from 'react-native-reanimated'

import { ThemeProvider } from '../ThemeProvider'
import { UCarousel } from '../u/UCarousel'

import { LineCard } from './card/LineCard'

import { useLineCardWidth, useLineGroup } from '@/composables'
import { LineContext } from '@/composables/useLine'
import { ExitScaleOut } from '@/constants/animation'
import { cn } from '@/utils/cn'

const { width } = Dimensions.get('window')

export const LineCards = ({ className }: { className?: string, buttonsHeight?: SharedValue<number> }) => {
  const { cardWidth, snapInterval } = useLineCardWidth()
  const { codes } = useLineGroup()

  if (codes.length < 1) {
    return
  }

  return (
    <UCarousel
      snapInterval={snapInterval}
      style={{ width }}
      contentClassName={cn(
        'gap-2',
        codes.length > 1 ? 'p-2 pt-0' : 'p-0',
      )}
      className={className}
    >
      {codes.map(code => (
        <Animated.View
          key={code}
          exiting={ExitScaleOut}
          layout={LinearTransition}
        >
          {/* <LineContext value={code}>
            <LineCard
              style={{ width: cardWidth }}
              className={cn(
                'grow',
                codes.length < 2 && 'rounded-b-none',
              )}
            />
          </LineContext> */}
          <LineContext value={code}>
            <ThemeProvider>
              <LineCard
                style={{ width: cardWidth }}
                className={cn(
                  'grow',
                  codes.length < 2 && 'rounded-b-none',
                )}
              />
            </ThemeProvider>
          </LineContext>
        </Animated.View>
      ))}
    </UCarousel>
  )
}
