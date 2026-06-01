type Point = { lat: number, lng: number }

export const getClosestPoint = <T extends Point, Y extends Point>(point: T, points: Y[]) => {
  if (points.length < 2)
    return points[0]

  let closest = points[0]!
  let minDist = (closest.lat - point.lat) ** 2 + (closest.lng - point.lng) ** 2

  for (let index = 1; index < points.length; index++) {
    const p = points[index]
    if (!p)
      continue

    const dist = (p.lat - point.lat) ** 2 + (p.lng - point.lng) ** 2

    if (dist < minDist) {
      minDist = dist
      closest = p
    }
  }

  return closest
}
