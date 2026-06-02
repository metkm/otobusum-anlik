import type { LngLatBounds } from '@maplibre/maplibre-react-native'

export const getLatLngBounds = (path: { lat: number, lng: number }[]) => {
  if (path.length < 1) {
    throw new Error('Get line bounds is called with no elements!')
  }

  if (path.length < 2) {
    const p = path[0]!

    return [p.lat, p.lat, p.lng, p.lng] satisfies LngLatBounds
  }

  let north = 0
  let south = Infinity
  let east = 0
  let west = Infinity

  for (const point of path) {
    north = Math.max(north, point.lat)
    south = Math.min(south, point.lat)

    east = Math.max(east, point.lng)
    west = Math.min(west, point.lng)
  }

  return [west, south, east, north] satisfies LngLatBounds
}
