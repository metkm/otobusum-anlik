import { APIProvider, Map, type MapCameraChangedEvent, type MapEvent } from '@vis.gl/react-google-maps'
import { ForwardedRef, useImperativeHandle, useRef } from 'react'
import { Dimensions } from 'react-native'
import { useThrottledCallback } from 'use-debounce'

import type { TheMapProps, TheMapRef } from './Map'

const dimensions = Dimensions.get('window')

const getBoundsZoomLevel = (
  bounds: { north: number, west: number, east: number, south: number },
  mapDim: { width: number, height: number },
) => {
  var WORLD_DIM = { height: 256, width: 256 }
  var ZOOM_MAX = 21

  function latRad(lat: number) {
    var sin = Math.sin((lat * Math.PI) / 180)
    var radX2 = Math.log((1 + sin) / (1 - sin)) / 2
    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2
  }

  function zoom(mapPx: number, worldPx: number, fraction: number) {
    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2)
  }

  var latFraction = (latRad(bounds.north) - latRad(bounds.south)) / Math.PI

  var lngDiff = bounds.east - bounds.west
  var lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360

  var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction)
  var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction)

  return Math.min(latZoom, lngZoom, ZOOM_MAX)
}

export const TheMap = (
  { onMapReady, onMapRegionUpdate, initialRegion, ...props }: TheMapProps,
  ref: ForwardedRef<TheMapRef>,
) => {
  const map = useRef<google.maps.Map | null>(null)

  useImperativeHandle(ref, () => {
    return {
      animateCamera: (region) => {
        map.current?.fitBounds({
          north: region.latitude - region.latitudeDelta / 2,
          west: region.longitude - region.longitudeDelta / 2,
          east: region.longitude + region.longitudeDelta / 2,
          south: region.latitude + region.latitudeDelta / 2,
        }, {
          bottom: 250,
        })
      },
      moveTo: (latlng) => {
        map.current?.moveCamera({
          center: {
            lat: latlng.latitude,
            lng: latlng.longitude,
          },
        })
      },
      fitInsideCoordinates: (coordinates) => {
        const def = coordinates.at(0)!

        let highestLat = def.latitude
        let highestLng = def.longitude
        let minLat = def.latitude
        let minLng = def.longitude

        for (let index = 1; index < coordinates.length; index++) {
          const coordinate = coordinates[index]
          if (!coordinate) continue

          if (coordinate.latitude > highestLat) {
            highestLat = coordinate.latitude
          }
          if (coordinate.latitude < minLat) {
            minLat = coordinate.latitude
          }

          if (coordinate.longitude > highestLng) {
            highestLng = coordinate.longitude
          }
          if (coordinate.longitude < minLng) {
            minLng = coordinate.longitude
          }
        }

        map.current?.fitBounds({
          north: highestLat,
          west: minLng,
          east: highestLng,
          south: minLat,
        }, {
          bottom: 250,
        })
      },
    }
  })

  const handleCenterChanged = useThrottledCallback((event: MapCameraChangedEvent) => {
    const region = event.map.getBounds()?.toJSON()
    if (!region) return

    const nsDiff = region.north - region.south
    const ewDiff = region.east - region.west

    onMapRegionUpdate?.({
      latitude: region.north - nsDiff / 2,
      longitude: region.west + ewDiff / 2,
      latitudeDelta: nsDiff,
      longitudeDelta: ewDiff,
    })
  }, 16)

  const zoom = initialRegion
    ? getBoundsZoomLevel(
        {
          north: initialRegion.latitude + initialRegion.latitudeDelta / 2,
          west: initialRegion.longitude - initialRegion.longitudeDelta / 2,
          east: initialRegion.longitude + initialRegion.longitudeDelta / 2,
          south: initialRegion.latitude + initialRegion.latitudeDelta / 2,
        },
        {
          width: dimensions.width,
          height: dimensions.height,
        },
      )
    : undefined

  const handleLoaded = (event: MapEvent) => {
    map.current = event.map
    onMapReady?.()
  }

  return (
    <APIProvider apiKey={process.env.EXPO_PUBLIC_MAP_API || ''}>
      <Map
        mapId="2829e1226e1562f1"
        onTilesLoaded={handleLoaded}
        onCenterChanged={handleCenterChanged}
        fullscreenControl={false}
        zoomControl={false}
        mapTypeControl={false}
        streetViewControl={false}
        defaultCenter={
          initialRegion
            ? {
                lat: initialRegion.latitude,
                lng: initialRegion.longitude,
              }
            : undefined
        }
        defaultZoom={zoom}
      >
        {props.children}
      </Map>
    </APIProvider>
  )
}

// export const TheMap = forwardRef<TheMapRef, TheMapProps>(TheMap)
