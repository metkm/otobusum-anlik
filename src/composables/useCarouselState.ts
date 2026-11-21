import { use } from 'react'

import { CarouselStateContext } from '@/components/provider/CarouselStateProvider'

export const useCarouselState = () => {
  const context = use(CarouselStateContext)

  if (!context) {
    throw new Error('CarouselStateContext should be used inside CarouselStateProvider')
  }

  return context
}
