import { useShallow } from 'zustand/react/shallow'

import { LineCodeSlice, useFilterStore, useLineStore } from '@/stores'
import { City } from '@/types/city'

export const selectLines = (
  state: LineCodeSlice,
  city: City,
) => {
  const groupId = state.groupId[city]

  return (
    state.lines[city]
      ?.find(gr => gr.id === groupId)
      ?.codes || []
  )
}

export const useLines = () => {
  const city = useFilterStore(useShallow(state => state.city))
  return useLineStore(useShallow(state => selectLines(state, city)))
}
