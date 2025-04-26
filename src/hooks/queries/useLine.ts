import { useQuery } from '@tanstack/react-query'
import { useWindowDimensions } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { DEFAULT_PAGE_PADDING } from '../usePaddings'

import { getLineBusLocations } from '@/api/getLineBusLocations'
import { getLines, useLinesStore } from '@/stores/lines'
import { i18n } from '@/translations/i18n'

export function useLine(lineCode: string) {
  const { width } = useWindowDimensions()

  const lineCount = useLinesStore(useShallow(() => getLines().length))
  const lineWidth = width - (DEFAULT_PAGE_PADDING * 2) - (lineCount > 1 ? 8 : 0)

  const query = useQuery({
    queryKey: ['line', lineCode],
    queryFn: () => getLineBusLocations(lineCode),
    staleTime: 60_000 * 30,
    meta: {
      errorMessage: i18n.t('errorGettingBusLocations'),
    },
  })

  return {
    query,
    lineWidth,
  }
}
