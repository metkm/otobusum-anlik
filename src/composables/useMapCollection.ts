import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { MarkerCollection, useTemporaryMarkerStore } from '@/stores/temporaryMarker'

export const useMapCollection = (markerCollection: MarkerCollection) => {
  const addCollection = useTemporaryMarkerStore(useShallow(state => state.addCollection))
  const removeCollection = useTemporaryMarkerStore(useShallow(state => state.removeCollection))

  useEffect(() => {
    if (!markerCollection.data) {
      return
    }

    addCollection(markerCollection)

    return () => {
      removeCollection(markerCollection.id)
    }
  }, [addCollection, markerCollection, removeCollection])
}
