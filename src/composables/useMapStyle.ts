import { useShallow } from 'zustand/react/shallow'

import { useColorScheme } from '@/composables/useColorScheme'
import { mapStyles } from '@/constants/mapStyles'
import { useSettingsStore, type ColorScheme } from '@/stores'

export const useMapStyle = () => {
  const prefferedMapStyle = useSettingsStore(useShallow((state) => state.mapStyle))
  const colorScheme = useColorScheme()

  const scheme = prefferedMapStyle ?? (colorScheme === 'dark' ? 'dark' : 'liberty')
  const mapColorScheme = scheme === 'dark' ? 'dark' : ('light' as ColorScheme)

  // We do this because scheme that comes from prefferedmapstyle might be a old value that is not supported anymore
  const style = mapStyles[scheme]

  return { mapColorScheme, scheme, style }
}
