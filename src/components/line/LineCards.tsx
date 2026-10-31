import { Dimensions } from 'react-native'
import Animated, { type SharedValue } from 'react-native-reanimated'

import { useLineCardWidth, useLineGroup } from '@/composables'
import { LineContext } from '@/composables/useLine'
import { useMapPadding } from '@/composables/useMapPadding'
import { ExitScaleOut, ItemLayoutAnimation } from '@/constants/animation'

import { ThemeProvider } from '../ThemeProvider'
import { UCarousel } from '../u/UCarousel'
import { LineCard } from './card/LineCard'

const { width } = Dimensions.get('window')

export const LineCards = ({
  className,
}: {
  className?: string
  buttonsHeight?: SharedValue<number>
}) => {
  const { cardWidth, snapInterval } = useLineCardWidth()
  const { codes } = useLineGroup()
  const { onLayout } = useMapPadding('bottom')

  if (codes.length < 1) {
    return
  }

  return (
    <UCarousel
      snapInterval={snapInterval}
      style={{ width }}
      contentClassName="gap-2 p-2 pt-0"
      className={className}
      onLayout={onLayout}
    >
      {codes.map((code) => (
        <Animated.View
          key={code}
          exiting={ExitScaleOut}
          layout={ItemLayoutAnimation}
        >
          <LineContext value={code}>
            <ThemeProvider>
              <LineCard
                style={{ width: cardWidth }}
                className="grow"
              />
            </ThemeProvider>
          </LineContext>
        </Animated.View>
      ))}
    </UCarousel>
  )
}
