import { useShallow } from 'zustand/react/shallow'

import { useFilterStore, useTransitStore } from '@/stores'

export const useLineGroup = (_groupId?: string) => {
  const city = useFilterStore(useShallow((state) => state.city))

  const groups = useTransitStore(useShallow((state) => state.groups[city]))
  const groupId = useTransitStore(useShallow((state) => state.selectedGroup[city]))

  const group = groups.find((gr) => gr.id === (_groupId ?? groupId))
  const items = group?.items ?? []

  return {
    group,
    groupId,
    groups,
    items,
  }
}
