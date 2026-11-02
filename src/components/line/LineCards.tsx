import { useLineGroup } from '@/composables'
import { LineContext } from '@/composables/useLine'
import { useMapPadding } from '@/composables/useMapPadding'
import { cn } from '@/utils/cn'

import { ThemeProvider } from '../ThemeProvider'
import { UCarousel, UCarouselProps } from '../u/UCarousel'
import { LineCard } from './card/LineCard'

interface LineCardsProps<T> extends Omit<
  UCarouselProps<T>,
  'data' | 'renderItem' | 'keyExtractor'
> {}

export const LineCards = <T,>({ ui, ...props }: LineCardsProps<T>) => {
  const { codes } = useLineGroup()
  const { onLayout } = useMapPadding('lineCards', 'bottom')

  if (codes.length < 1) {
    return
  }

  return (
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
      ui={{ container: cn('gap-2 px-2 pb-2', ui?.container), viewport: ui?.viewport }}
      keyExtractor={(item) => item}
      {...props}
    />
  )
}
