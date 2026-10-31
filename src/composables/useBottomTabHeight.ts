import { createContext, use } from 'react'

export const BottomTabHeightContext = createContext<number>(0)

export const useBottomTabHeight = () => {
  const context = use(BottomTabHeightContext)
  return context
}
