import { CameraRef } from '@rnmapbox/maps/lib/typescript/src/components/Camera'
import { RefObject, createContext, useContext } from 'react'

interface IMapContext {
  camera: RefObject<CameraRef>
}

function getSWCoordinates(coordinatesCollection: [number, number][]): [number, number] {
  const lowestLng = Math.min(
    ...coordinatesCollection.map(coordinates => coordinates[0]),
  )
  const lowestLat = Math.min(
    ...coordinatesCollection.map(coordinates => coordinates[1]),
  )

  return [lowestLng, lowestLat]
}

function getNECoordinates(coordinatesCollection: [number, number][]): [number, number] {
  const highestLng = Math.max(
    ...coordinatesCollection.map(coordinates => coordinates[0]),
  )
  const highestLat = Math.max(
    ...coordinatesCollection.map(coordinates => coordinates[1]),
  )

  return [highestLng, highestLat]
}

export const MapContext = createContext<IMapContext | null>(null)

export const useMap = () => {
  const context = useContext(MapContext)

  const fitInsideBounds = (positions: [number, number][]) => {
    const sw = getSWCoordinates(positions)
    const ne = getNECoordinates(positions)

    context?.camera.current?.fitBounds(ne, sw, [0, 20], 500)
  }

  return {
    ...context,
    fitInsideBounds,
  }
}
