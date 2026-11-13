import type { City } from './city'

export interface GroupsSliceV4 {
  lines: Record<City, { id: string; name: string; codes: string[] }[]>
  groupId: Record<City, string>
}
