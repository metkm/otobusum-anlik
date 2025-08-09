import type { ScriptGoogleMaps } from '#components'

/// <reference types="google.maps" />

export type MapRef = InstanceType<typeof ScriptGoogleMaps>

export const useMap = () => {
  const mapRef = useState<MapRef | undefined>('mapRef', () => shallowRef(undefined))

  return {
    mapRef,
  }
}
