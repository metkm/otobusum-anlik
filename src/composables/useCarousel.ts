import { use } from 'react'

import { CarouselContext } from '@/components/provider/CarouselProvider'

export const useCarousel = () => {
  const context = use(CarouselContext)

  if (!context) {
    throw new Error('CarouselContext should be used inside CarouselProvider')
  }

  return context
}
