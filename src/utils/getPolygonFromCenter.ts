import type { LngLat } from '@maplibre/maplibre-react-native'

export const getPolygonCoordinatesFromPoint = (point: LngLat, radiusMeters: number) => {
  const km = radiusMeters / 1000
  const points = 64

  const ret: number[][] = []
  const distanceX = km / (111.32 * Math.cos((point[1] * Math.PI) / 180))
  const distanceY = km / 110.574

  let theta = 0,
    x = 0,
    y = 0

  for (let i = 0; i < points; i++) {
    theta = (i / points) * (2 * Math.PI)
    x = distanceX * Math.cos(theta)
    y = distanceY * Math.sin(theta)

    ret.push([point[0] + x, point[1] + y])
  }

  ret.push(ret[0]!)
  return ret
}
