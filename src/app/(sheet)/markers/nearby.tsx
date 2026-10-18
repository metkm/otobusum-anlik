import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import type { LngLatBounds } from '@maplibre/maplibre-react-native'
import { hexFromArgb } from '@material/material-color-utilities'
import type { Feature } from 'geojson'
import { t } from 'i18next'
import { useEffect, useRef } from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { useShallow } from 'zustand/react/shallow'

import { UBadge } from '@/components/u/UBadge'
import { UButton } from '@/components/u/UButton'
import { UHeader } from '@/components/u/UHeader'
import { UQueryState } from '@/components/u/UQueryState'
import { UText } from '@/components/u/UText'

import { useMap } from '@/composables'
import { useTransitNearby } from '@/composables/useTransitNearby'
import { useTemporaryMarkerStore } from '@/stores/temporaryMarker'
import { getLatLngBounds } from '@/utils/bounds'
import { createRandomTheme } from '@/utils/color'

export const NearbyScreen = () => {
  const { query } = useTransitNearby()
  const navigation = useTrueSheetNavigation()
  const scrollableRef = useRef<ScrollView>(null)
  const { map, fitBounds, camera } = useMap()
  const mapBounds = useRef<LngLatBounds>(null)

  const addMarkers = useTemporaryMarkerStore(useShallow(state => state.addCollection))
  const removeMarkers = useTemporaryMarkerStore(useShallow(state => state.removeCollection))

  const colors = query.data?.routes.map(() => createRandomTheme())

  useEffect(() => {
    map.current?.getBounds().then((bounds) => {
      mapBounds.current = bounds
    })

    if (!query.data) {
      return
    }

    const stopFeatures: Feature[] = query.data.stops.map(stop => ({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [stop.lng, stop.lat],
      },
    }))

    const routeFeatures: Feature[] = query.data.routes.map((route, index) => ({
      type: 'Feature',
      properties: {
        color: colors?.[index] ? hexFromArgb(colors[index].schemes.dark.primary) : undefined,
        line_code: route.line_code,
      },
      geometry: {
        type: 'LineString',
        coordinates: route.path?.map(p => [p.lng, p.lat]) ?? [],
      },
    }))

    addMarkers('stops', 'stops', {
      type: 'FeatureCollection',
      features: stopFeatures,
    })

    addMarkers('routes', 'routes', {
      type: 'FeatureCollection',
      features: routeFeatures,
    })

    map.current?.getCenter().then((center) => {
      const km = query.data.stops_radius / 1000
      const points = 64

      let ret: number[][] = []
      let distanceX = km / (111.320 * Math.cos(center[1] * Math.PI / 180))
      let distanceY = km / 110.574

      let theta, x, y
      for (let i = 0; i < points; i++) {
        theta = (i / points) * (2 * Math.PI)
        x = distanceX * Math.cos(theta)
        y = distanceY * Math.sin(theta)

        ret.push([center[0] + x, center[1] + y])
      }

      ret.push(ret[0]!)

      addMarkers('query-radius', 'polygon', {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [ret],
          },
        }],
      })

      fitBounds(getLatLngBounds(ret.map(r => ({ lng: r[0]!, lat: r[1]! }))))
    })

    return () => {
      removeMarkers('stops')
      removeMarkers('routes')
      removeMarkers('query-radius')

      if (mapBounds.current) {
        fitBounds(mapBounds.current)
      }
    }
  }, [addMarkers, camera, colors, fitBounds, map, query.data, removeMarkers])

  useEffect(() => {
    navigation.setOptions({
      scrollableRef,
    })
  })

  return (
    <ScrollView ref={scrollableRef}>
      <GestureHandlerRootView style={{ gap: 8 }}>
        <UQueryState query={query}>
          <View className="gap-2 pt-9">
            <UHeader
              icon="bus-front"
              title={t('stops')}
              description={t('nearbyStops')}
            />

            {query.data?.stops.map(stop => (
              <UButton
                key={stop.id}
                label={stop.name}
                to={`/(sheet)/stop/${stop.code}`}
                variant="ghost"
                color="neutral"
                trailingIcon="arrow-right"
              >
                <UBadge icon="bus-front" />
              </UButton>
            ))}
          </View>

          <View className="gap-2">
            <UHeader
              icon="route"
              title={t('stops')}
              description={t('routesPassingThisPoint')}
            />

            {query.data?.routes.map((route, index) => (
              <UButton
                key={route.id}
                to={{
                  pathname: '/groups',
                  params: { addToGroup: route.line_code },
                }}
                variant="ghost"
                color="neutral"
                trailingIcon="arrow-right"
              >
                <View className="flex-row items-center gap-2 shrink">
                  <UBadge
                    label={route.line_code}
                    theme={colors?.[index]}
                  />

                  <UText
                    className="shrink text-xs font-inter-medium"
                    numberOfLines={1}
                  >
                    {route.name}
                  </UText>
                </View>
              </UButton>
            ))}
          </View>
        </UQueryState>
      </GestureHandlerRootView>
    </ScrollView>
  )
}

export default NearbyScreen
