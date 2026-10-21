import { useShallow } from 'zustand/react/shallow'

import { useFilterStore, useLineStore } from '@/stores'

export const useLineGroup = (_groupId?: string) => {
  const city = useFilterStore(useShallow((state) => state.city))
  const groupId = useLineStore(useShallow((state) => state.groupId[city]))
  const groups = useLineStore(useShallow((state) => state.lines[city]))

  const group = groups.find((gr) => gr.id === (_groupId ?? groupId))

  return {
    group,
    groups,
    groupId,
    codes: group?.codes || [],
  }
}
