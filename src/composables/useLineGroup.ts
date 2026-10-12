import { useShallow } from 'zustand/react/shallow'

import { useFilterStore, useLineStore } from '@/stores'

export const useLineGroup = () => {
  const city = useFilterStore(useShallow(state => state.city))
  const groupId = useLineStore(useShallow(state => state.groupId[city]))
  const group = useLineStore(useShallow(state => state.lines[city].find(gr => gr.id === groupId)))

  return {
    group,
    codes: group?.codes || [],
  }
}
