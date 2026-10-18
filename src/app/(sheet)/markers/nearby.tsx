import { TrueSheetPeek } from '@lodev09/react-native-true-sheet'
import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import type { LngLatBounds } from '@maplibre/maplibre-react-native'
import { hexFromArgb } from '@material/material-color-utilities'
import { useRouter } from 'expo-router'
import type { Feature } from 'geojson'
import { t } from 'i18next'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { useShallow } from 'zustand/react/shallow'

import { UActivityIndicator } from '@/components/u/UActivityIndicator'
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
import { getPolygonCoordinatesFromPoint } from '@/utils/getPolygonFromCenter'

export const NearbyScreen = () => {
  const { query } = useTransitNearby()
  const navigation = useTrueSheetNavigation()
  const router = useRouter()
  const { map, fitBounds, camera } = useMap()

  const scrollableRef = useRef<ScrollView>(null)
  const mapBounds = useRef<LngLatBounds>(null)

  const addMarkers = useTemporaryMarkerStore(useShallow(state => state.addCollection))
  const removeMarkers = useTemporaryMarkerStore(useShallow(state => state.removeCollection))

  const colors = useMemo(() => query.data?.routes.map(() => createRandomTheme()), [query.data])

  const renderMarkers = useCallback(async () => {
    if (!query.data)
      return

    console.log(1)
    mapBounds.current = await map.current?.getBounds() ?? null

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

    const center = await map.current?.getCenter()

    if (center) {
      const coordinates = getPolygonCoordinatesFromPoint(center, query.data.stops_radius)

      addMarkers('query-radius', 'polygon', {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates],
          },
        }],
      })

      fitBounds(getLatLngBounds(coordinates.map(r => ({ lng: r[0]!, lat: r[1]! }))))
    }

    addMarkers('stops', 'stops', {
      type: 'FeatureCollection',
      features: stopFeatures,
    })

    addMarkers('routes', 'routes', {
      type: 'FeatureCollection',
      features: routeFeatures,
    })
  }, [addMarkers, colors, fitBounds, map, query.data])

  useEffect(() => {
    renderMarkers()
    const cam = camera.current

    return () => {
      removeMarkers('stops')
      removeMarkers('routes')
      removeMarkers('query-radius')

      if (mapBounds.current && cam) {
        cam?.fitBounds(mapBounds.current, { duration: 750 })
      }
    }
  }, [camera, fitBounds, removeMarkers, renderMarkers])

  useEffect(() => {
    navigation.setOptions({
      scrollableRef,
      header: (
        <GestureHandlerRootView style={{ flexShrink: 0 }}>
          <UButton
            icon="x"
            variant="soft"
            color="neutral"
            className="m-2 ml-auto"
            onPress={() => router.back()}
          />
        </GestureHandlerRootView>
      ),
    })
  })

  if (query.data && (query.data.routes.length < 1) && (query.data.stops.length < 1)) {
    return (
      <TrueSheetPeek>
        <View className="flex-1 items-center justify-center">
          <UText className="font-inter-medium">{t('noResults')}</UText>
        </View>
      </TrueSheetPeek>
    )
  }

  return (
    <UQueryState
      query={query}
      loading={() => (
        <TrueSheetPeek>
          <UActivityIndicator />
        </TrueSheetPeek>
      )}
    >
      <ScrollView ref={scrollableRef}>
        <GestureHandlerRootView style={{ gap: 8, flexGrow: 1 }}>
          {
            query.data && query.data.stops.length > 0 && (
              <View className="gap-2">
                <TrueSheetPeek>
                  <UHeader
                    icon="bus-front"
                    title={t('stops')}
                    description={t('nearbyStops')}
                  >
                    <UText>{query.data?.stops.length}</UText>
                  </UHeader>
                </TrueSheetPeek>

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
            )
          }

          {
            query.data && query.data.routes.length > 0 && (
              <View className="gap-2">
                <UHeader
                  icon="route"
                  title={t('stops')}
                  description={t('routesPassingThisPoint')}
                >
                  <UText>{query.data?.routes.length}</UText>
                </UHeader>

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
            )
          }
        </GestureHandlerRootView>
      </ScrollView>
    </UQueryState>
  )
}

export default NearbyScreen
