import type { LayerProps } from '@maplibre/maplibre-react-native'
import type { GeoJSON, GeoJsonProperties, Geometry } from 'geojson'
import { castDraft } from 'immer'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface MarkerCollectionBaseProps {
  id: string
  data?: string | GeoJSON<Geometry, GeoJsonProperties>
}

export type MarkerCollection = (
  | {
      layerProps: LayerProps
      renderer: 'layer'
    }
  | {
      renderer: 'stops' | 'route'
      layerProps?: LayerProps
    }
) &
  MarkerCollectionBaseProps

interface TemporaryMarkerStore {
  data: MarkerCollection[]
  addCollection: (data: MarkerCollection) => void
  removeCollection: (id: string) => void
}

export const useTemporaryMarkerStore = create(
  subscribeWithSelector(
    immer<TemporaryMarkerStore>((set) => ({
      addCollection: (collection) =>
        set((state) => {
          const index = state.data.findIndex((item) => item.id === collection.id)

          if (index !== -1) {
            state.data[index] = castDraft(collection)
          } else {
            state.data.push(castDraft(collection))
          }
        }),
      data: [],
      removeCollection: (id) =>
        set((state) => {
          state.data = state.data.filter((item) => item.id !== id)
        }),
    })),
  ),
)
