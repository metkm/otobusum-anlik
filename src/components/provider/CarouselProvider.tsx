import { createContext, type ReactNode } from 'react'
import { useSharedValue, type SharedValue } from 'react-native-reanimated'

export interface ItemDimension {
  width: number
  height: number
}

export type ItemDimensions = Record<string, ItemDimension>

interface CarouselContext {
  offset: SharedValue<number>
}

export const CarouselContext = createContext<CarouselContext | undefined>(undefined)

export const CarouselProvider = ({ children }: { children: ReactNode }) => {
  const offset = useSharedValue(0)
  // const itemDimensions = useSharedValue<ItemDimensions>({})

  return <CarouselContext value={{ offset }}>{children}</CarouselContext>
}
