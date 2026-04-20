import { createContext, use } from 'react'

export const LineContext = createContext<string>('')

export const useLine = () => {
  const context = use(LineContext)

  return {
    code: context,
  }
}
