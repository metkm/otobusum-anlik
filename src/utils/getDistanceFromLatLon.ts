import { LatLng } from 'react-native-maps'

const R = 6371 // Radius of the earth

// In km
export const getDistanceFromLatLon = (coord1: LatLng, coord2: LatLng) => {
  const dLat = deg2rad(coord2.latitude - coord1.latitude) // deg2rad below
  const dLon = deg2rad(coord2.longitude - coord1.longitude)
  const a
    = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(deg2rad(coord1.latitude)) * Math.cos(deg2rad(coord2.latitude))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

export const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180)
}
