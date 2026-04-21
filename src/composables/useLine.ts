import { createContext, use } from 'react'

export const LineContext = createContext<string | undefined>(undefined)

export const useLine = () => {
  const context = use(LineContext)

  if (!context)
    throw Error('useLine hook should be used inside LineContext provider')

  return {
    code: context,
  }
}
