import { useLineGroup, useMapPadding } from '@/composables'
import { LineContext } from '@/composables/useLine'
import { cn } from '@/utils/cn'

import { ThemeProvider } from '../ThemeProvider'
import { UCarousel, UCarouselProps } from '../u/UCarousel'
import { LineCard } from './card/LineCard'
import Animated, { LinearTransition } from 'react-native-reanimated'

interface LineCardsProps<T> extends Omit<
  UCarouselProps<T>,
  'data' | 'renderItem' | 'keyExtractor'
> { }

export const LineCards = <T,>({ ui, ...props }: LineCardsProps<T>) => {
  const { codes } = useLineGroup()
  const { onLayout } = useMapPadding('lineCards', 'bottom')

  if (codes.length < 1) {
    return
  }

  return (
    <Animated.View layout={LinearTransition}>
      <UCarousel
        onLayout={onLayout}
        data={codes}
        renderItem={({ item }) => (
          <LineContext value={item}>
            <ThemeProvider>
              <LineCard className="grow" />
            </ThemeProvider>
          </LineContext>
        )}
        ui={{
          container: cn('gap-2 px-2 pb-2', ui?.container),
          item: codes.length > 1 ? 'basis-[94%]' : 'basis-full',
          viewport: ui?.viewport,
        }}
        enabled={codes.length > 1}
        keyExtractor={(item) => `${codes.length > 1}-${item}`}
        {...props}
      />
    </Animated.View>
  )
}
