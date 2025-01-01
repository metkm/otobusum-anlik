import { useQuery } from '@tanstack/react-query'
import { useWindowDimensions } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { extraPadding } from '../usePaddings'

import { getLineBusLocations } from '@/api/getLineBusLocations'
import { getLines, useLinesStore } from '@/stores/lines'

export function useLine(lineCode: string) {
  const { width } = useWindowDimensions()

  const lineCount = useLinesStore(useShallow(() => getLines().length))
  const lineWidth = width - (extraPadding * 2) - (lineCount > 1 ? 8 : 0)

  const query = useQuery({
    queryKey: ['line', lineCode],
    queryFn: () => getLineBusLocations(lineCode),
    staleTime: 60_000 * 30,
  })

  return {
    query,
    lineWidth,
  }
}
