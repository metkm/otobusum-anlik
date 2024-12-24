import { api } from './api'

import { BusLine, BusStop } from '@/types/bus'

export interface SearchResponse {
  stops: BusStop[]
  lines: BusLine[]
}

export async function getSearchResults(query: string): Promise<SearchResponse> {
  return await api(`/search`, {
    searchParams: {
      q: query,
    },
  })
}
