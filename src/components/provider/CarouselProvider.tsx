import { createContext, type ReactNode } from 'react'
import { useSharedValue, type SharedValue } from 'react-native-reanimated'

interface CarouselContext {
  offset: SharedValue<number>
  snapPoints: SharedValue<number[]>
}

export const CarouselContext = createContext<CarouselContext | undefined>(undefined)

export const CarouselProvider = ({ children }: { children: ReactNode }) => {
  const offset = useSharedValue(0)
  const snapPoints = useSharedValue<number[]>([])

  return <CarouselContext value={{ offset, snapPoints }}>{children}</CarouselContext>
}
