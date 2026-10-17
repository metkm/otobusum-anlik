import type { Geometry, GeoJSON, GeoJsonProperties } from 'geojson'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface TemporaryMarkerStore {
  data: {
    id: string
    type: 'stops' | 'routes' | 'polygon'
    data: string | GeoJSON<Geometry, GeoJsonProperties>
  }[]
  addCollection: (id: string, type: 'stops' | 'routes' | 'polygon', data: string | GeoJSON<Geometry, GeoJsonProperties>) => void
  removeCollection: (id: string) => void
}

export const useTemporaryMarkerStore = create(
  subscribeWithSelector(
    immer<TemporaryMarkerStore>(set => ({
      data: [],
      addCollection: (id, type, data) =>
        set((state) => {
          const index = state.data.findIndex(item => item.id === id)

          if (index !== -1) {
            state.data[index]!.data = data
          } else {
            state.data.push({ id, type, data })
          }
        }),
      removeCollection: id =>
        set((state) => {
          state.data = state.data?.filter(item => item.id !== id)
        }),
    })),
  ),
)
