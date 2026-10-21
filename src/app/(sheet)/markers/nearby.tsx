import { TrueSheetPeek } from '@lodev09/react-native-true-sheet'
import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import type { LngLatBounds } from '@maplibre/maplibre-react-native'
import { hexFromArgb } from '@material/material-color-utilities'
import { useLocalSearchParams, useRouter } from 'expo-router'
import type { FeatureCollection } from 'geojson'
import { t } from 'i18next'
import { useEffect, useMemo, useRef } from 'react'
import { ScrollViewInstance, View } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { ScopedVariables, useCSSVariable } from 'uniwind'

import { UActivityIndicator } from '@/components/u/UActivityIndicator'
import { UBadge } from '@/components/u/UBadge'
import { UButton } from '@/components/u/UButton'
import { UHeader } from '@/components/u/UHeader'
import { UQueryState } from '@/components/u/UQueryState'
import { UText } from '@/components/u/UText'
import { useMap } from '@/composables'
import { useMapCollection } from '@/composables/useMapCollection'
import { useTransitNearby } from '@/composables/useTransitNearby'
import { getLatLngBounds } from '@/utils/bounds'
import { createRandomTheme } from '@/utils/color'
import { getPolygonCoordinatesFromPoint } from '@/utils/getPolygonFromCenter'

export const NearbyScreen = () => {
  const primaryColor = useCSSVariable('--color-primary')?.toString()
  const params = useLocalSearchParams()
  const router = useRouter()

  const lat = params.lat ? Number(params.lat) : undefined
  const lng = params.lng ? Number(params.lng) : undefined

  const { query } = useTransitNearby(lat, lng)
  const { map, camera, fitBounds } = useMap()
  const navigation = useTrueSheetNavigation()

  const scrollableRef = useRef<ScrollViewInstance>(null)
  const bounds = useRef<LngLatBounds>(null)

  const colors = useMemo(() => query.data?.routes.map(() => createRandomTheme()), [query.data])

  const routeCollection = useMemo<FeatureCollection>(
    () => ({
      type: 'FeatureCollection',
      features:
        query.data?.routes.map((route, index) => ({
          type: 'Feature',
          properties: {
            color: colors?.[index] ? hexFromArgb(colors[index].schemes.dark.primary) : undefined,
            line_code: route.line_code,
          },
          geometry: {
            type: 'LineString',
            coordinates: route.path?.map((point) => [point.lng, point.lat]) ?? [],
          },
        })) || [],
    }),
    [colors, query.data?.routes],
  )

  const stopCollection = useMemo<FeatureCollection>(
    () => ({
      type: 'FeatureCollection',
      features:
        query.data?.stops.map((stop) => ({
          type: 'Feature',
          properties: {
            color: primaryColor,
          },
          geometry: {
            type: 'Point',
            coordinates: [stop.lng, stop.lat],
          },
        })) || [],
    }),
    [primaryColor, query.data?.stops],
  )

  const polygonCollection = useMemo<FeatureCollection | undefined>(() => {
    if (!query.data) {
      return
    }

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [getPolygonCoordinatesFromPoint([lng!, lat!], query.data.stops_radius)],
          },
        },
      ],
    }
  }, [lat, lng, query.data])

  useMapCollection({
    id: 'route-collection',
    renderer: 'route',
    data: routeCollection,
  })

  useMapCollection({
    id: 'stop-collection',
    renderer: 'stops',
    data: stopCollection,
  })

  useMapCollection({
    id: 'area-polygon',
    renderer: 'layer',
    data: polygonCollection,
    layerProps: {
      type: 'fill',
      paint: {
        'fill-color': 'white',
        'fill-opacity': 0.2,
      },
    },
  })

  useEffect(() => {
    const geo = polygonCollection?.features[0]?.geometry

    if (geo?.type !== 'Polygon') {
      return
    }

    const fit = async () => {
      bounds.current = (await map.current?.getBounds()) || null

      const result = geo.coordinates[0]?.map((coord) => ({ lng: coord[0]!, lat: coord[1]! }))
      if (!result) {
        return
      }

      fitBounds(getLatLngBounds(result))
    }

    void fit()

    const cam = camera.current
    return () => {
      if (bounds.current && cam) {
        cam.fitBounds(bounds.current, { duration: 750 })
      }
    }
  }, [camera, fitBounds, map, polygonCollection?.features])

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
  }, [navigation, router])

  if (query.data && query.data.routes.length < 1 && query.data.stops.length < 1) {
    return (
      <TrueSheetPeek>
        <View className="flex-1 items-center justify-center">
          <UText className="font-inter-medium">{t('noResults')}</UText>
        </View>
      </TrueSheetPeek>
    )
  }

  return (
    <ScrollView
      ref={scrollableRef}
      className="flex-1"
      contentContainerClassName="p-2 pt-0"
    >
      <UQueryState
        query={query}
        loading={() => (
          <TrueSheetPeek style={{ padding: 12 }}>
            <UActivityIndicator />
          </TrueSheetPeek>
        )}
      >
        <GestureHandlerRootView style={{ gap: 8, flexGrow: 1 }}>
          {query.data && query.data.stops.length > 0 && (
            <View className="gap-2">
              <TrueSheetPeek>
                <UHeader
                  icon="bus-front"
                  title={t('stops')}
                  description={t('nearbyStops')}
                >
                  <UText>{query.data.stops.length}</UText>
                </UHeader>
              </TrueSheetPeek>

              {query.data.stops.map((stop) => (
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
          )}

          {query.data && query.data.routes.length > 0 && (
            <View className="gap-2">
              {query.data.stops.length === 0 ? (
                <TrueSheetPeek>
                  <UHeader
                    icon="route"
                    title={t('routes')}
                    description={t('routesPassingThisPoint')}
                  >
                    <UText>{query.data.routes.length}</UText>
                  </UHeader>
                </TrueSheetPeek>
              ) : (
                <UHeader
                  icon="route"
                  title={t('routes')}
                  description={t('routesPassingThisPoint')}
                >
                  <UText>{query.data.routes.length}</UText>
                </UHeader>
              )}

              {query.data.routes.map((route, index) => (
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
                  <View className="shrink flex-row items-center gap-2">
                    <ScopedVariables
                      variables={{
                        '--color-primary': colors
                          ? hexFromArgb(colors[index]!.schemes.dark.primary)
                          : '',
                      }}
                    >
                      <UBadge label={route.line_code} />
                    </ScopedVariables>

                    <UText
                      className="font-inter-medium shrink text-xs"
                      numberOfLines={1}
                    >
                      {route.name}
                    </UText>
                  </View>
                </UButton>
              ))}
            </View>
          )}
        </GestureHandlerRootView>
      </UQueryState>
    </ScrollView>
  )
}

export default NearbyScreen
