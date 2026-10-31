import { createContext, use, type SetStateAction, type Dispatch } from "react"

export const BottomTabHeightContext = createContext<{ height: number, setHeight: Dispatch<SetStateAction<number>> } | undefined>(undefined)

export const useBottomTabHeight = () => {
  const context = use(BottomTabHeightContext)
  return context
}
