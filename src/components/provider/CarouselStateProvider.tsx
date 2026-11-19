import { createContext, type ReactNode } from 'react'
import { useSharedValue, type SharedValue } from 'react-native-reanimated'

export interface ItemDimension {
  width: number
  height: number
  x: number
  y: number
}

export type ItemDimensions = Record<number, ItemDimension>

interface CarouselStateContext {
  itemDimensions: SharedValue<ItemDimensions>
}

export const CarouselStateContext = createContext<CarouselStateContext | undefined>(undefined)

export const CarouselStateProvider = ({ children }: { children: ReactNode }) => {
  const itemDimensions = useSharedValue<ItemDimensions>({})

  return <CarouselStateContext value={{ itemDimensions }}>{children}</CarouselStateContext>
}
