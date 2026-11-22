import type { Point } from '@/types/point'

// oxlint-disable-next-line max-params
export const latLngToSvgPath = (coords: Point[], width: number, height: number, padding = 0) => {
  if (!coords || coords.length === 0) {
    return ''
  }

  // 1. Find the bounding box
  let minLat = Infinity,
    maxLat = -Infinity
  let minLng = Infinity,
    maxLng = -Infinity

  coords.forEach(({ lat, lng }) => {
    if (lat < minLat) {
      minLat = lat
    }
    if (lat > maxLat) {
      maxLat = lat
    }
    if (lng < minLng) {
      minLng = lng
    }
    if (lng > maxLng) {
      maxLng = lng
    }
  })

  // 2. Calculate scale while preserving aspect ratio
  const latSpan = maxLat - minLat || 1
  const lngSpan = maxLng - minLng || 1
  const drawWidth = width - padding * 2
  const drawHeight = height - padding * 2

  // Adjust longitude scale for latitude distortion (cos of mid-latitude)
  const midLatRad = ((minLat + maxLat) / 2) * (Math.PI / 180)
  const adjustedLngSpan = lngSpan * Math.cos(midLatRad)

  const scale = Math.min(drawWidth / adjustedLngSpan, drawHeight / latSpan)

  // Center the path inside the SVG box
  const offsetX = padding + (drawWidth - adjustedLngSpan * scale) / 2
  const offsetY = padding + (drawHeight - latSpan * scale) / 2

  // 3. Map coordinates to SVG commands (M for start, L for lines)
  return coords
    .map(({ lat, lng }, index) => {
      const x = offsetX + (lng - minLng) * Math.cos(midLatRad) * scale
      // Flip Y because SVG Y=0 is at the top, whereas maxLat is North
      const y = offsetY + (maxLat - lat) * scale
      const command = index === 0 ? 'M' : 'L'
      return `${command}${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}
