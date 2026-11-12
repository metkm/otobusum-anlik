import { createContext, use } from 'react'

import type { GroupItem } from '@/stores/groups'

export const GroupItemContext = createContext<GroupItem['code'] | undefined>(undefined)

export const useGroupItem = () => {
  const context = use(GroupItemContext)

  if (!context) {
    throw new Error('useGroupItem hook should be used inside GroupItemContext provider')
  }

  return {
    code: context,
  }
}
