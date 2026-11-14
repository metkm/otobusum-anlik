import { createContext, type ReactNode } from 'react'
import { useSharedValue, type SharedValue } from 'react-native-reanimated'

import { CARD_COLLAPSED_HEIGHT } from '@/constants/card'

export const CarouselCardHeightContext = createContext<SharedValue<number> | undefined>(undefined)

export const CarouselCardHeightProvider = ({ children }: { children: ReactNode }) => {
  const cardHeight = useSharedValue(CARD_COLLAPSED_HEIGHT)

  return <CarouselCardHeightContext value={cardHeight}>{children}</CarouselCardHeightContext>
}
