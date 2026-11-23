import { TrueSheetPeek } from '@lodev09/react-native-true-sheet'
import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import type { LngLatBounds } from '@maplibre/maplibre-react-native'
import { hexFromArgb } from '@material/material-color-utilities'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import type { FeatureCollection } from 'geojson'
import { t } from 'i18next'
import { useEffect, useMemo, useRef } from 'react'
import { Dimensions, View, type ScrollViewInstance } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScopedVariables, useCSSVariable } from 'uniwind'

import { UBadge, UButton, UActivityIndicator, UEmpty, UQueryState } from '@/components/u'
import { UNativeGestureHandlerRootView } from '@/components/u/native/UNativeGestureHandlerRootView'
import { useMapCollection, useMap } from '@/composables'
import { useTransitNearby } from '@/composables/query'
import { getLatLngBounds } from '@/utils/bounds'
import { createRandomTheme } from '@/utils/color'
import { getPolygonCoordinatesFromPoint } from '@/utils/getPolygonFromCenter'

export const DEFAULT_STOPS_QUERY_RADIUS = 500

const screenDimensions = Dimensions.get('screen')

export const NearbyScreen = () => {
  const primaryColor = useCSSVariable('--color-primary')?.toString()
  const params = useLocalSearchParams()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const lat = params.lat ? Number(params.lat) : undefined
  const lng = params.lng ? Number(params.lng) : undefined

  const { query } = useTransitNearby(lat, lng)
  const { fitBounds, map, camera } = useMap()
  const navigation = useTrueSheetNavigation()

  const initialBounds = useRef<LngLatBounds>(undefined)
  const scrollableRef = useRef<ScrollViewInstance>(null)

  const colors = useMemo(() => query.data?.routes.map(() => createRandomTheme()), [query.data])

  const routeCollection = useMemo<FeatureCollection>(
    () => ({
      features:
        query.data?.routes.map((route, index) => ({
          geometry: {
            coordinates: route.path?.map((point) => [point.lng, point.lat]) ?? [],
            type: 'LineString',
          },
          properties: {
            backgroundColor: colors?.[index]
              ? hexFromArgb(colors[index].schemes.dark.primary)
              : undefined,
            line_code: route.line_code,
          },
          type: 'Feature',
        })) || [],
      type: 'FeatureCollection',
    }),
    [colors, query.data?.routes],
  )

  const stopCollection = useMemo<FeatureCollection>(
    () => ({
      features:
        query.data?.stops.map((stop) => ({
          geometry: {
            coordinates: [stop.lng, stop.lat],
            type: 'Point',
          },
          properties: {
            backgroundColor: primaryColor,
          },
          type: 'Feature',
        })) || [],
      type: 'FeatureCollection',
    }),
    [primaryColor, query.data?.stops],
  )

  const polygonCollection = useMemo<FeatureCollection | undefined>(() => {
    const radius = query.data?.stops_radius ?? DEFAULT_STOPS_QUERY_RADIUS

    return {
      features: [
        {
          geometry: {
            coordinates: [getPolygonCoordinatesFromPoint([lng!, lat!], radius)],
            type: 'Polygon',
          },
          properties: {
            backgroundColor: primaryColor,
          },
          type: 'Feature',
        },
      ],
      type: 'FeatureCollection',
    }
  }, [lat, lng, query.data, primaryColor])

  useMapCollection({
    data: routeCollection,
    id: 'route-collection',
    renderer: 'route',
  })

  useMapCollection({
    data: stopCollection,
    id: 'stop-collection',
    renderer: 'stops',
  })

  useMapCollection({
    data: polygonCollection,
    id: 'area-polygon-border',
    layerProps: {
      paint: {
        'line-color': ['get', 'backgroundColor'],
        'line-dasharray': [8, 2],
        'line-width': 2,
      },
      type: 'line',
    },
    renderer: 'layer',
  })

  useMapCollection({
    data: polygonCollection,
    id: 'area-polygon',
    layerProps: {
      paint: {
        'fill-color': 'black',
        'fill-opacity': 0.2,
      },
      type: 'fill',
    },
    renderer: 'layer',
  })

  useEffect(() => {
    const geometry = polygonCollection?.features[0]?.geometry
    if (!geometry || geometry.type !== 'Polygon') {
      return
    }

    const zoom = async () => {
      initialBounds.current = await map.current?.getBounds()

      const bounds = getLatLngBounds(
        geometry.coordinates[0]?.map((coord) => ({ lat: coord[1]!, lng: coord[0]! })) ?? [],
      )

      if (bounds) {
        fitBounds(bounds, {
          padding: {
            bottom: screenDimensions.height * 0.5 + 25 + insets.bottom,
          },
        })
      }
    }

    void zoom()
    const cam = camera.current

    return () => {
      if (initialBounds.current) {
        cam?.fitBounds(initialBounds.current, { duration: 750 })
      }
    }
  }, [polygonCollection?.features, map, fitBounds, camera, insets.bottom])

  useEffect(() => {
    navigation.setOptions({
      header: (
        <UNativeGestureHandlerRootView className="shrink-0">
          <UButton
            icon="x"
            variant="soft"
            color="neutral"
            className="m-2 ml-auto"
            onPress={() => router.back()}
          />
        </UNativeGestureHandlerRootView>
      ),
      scrollableRef,
    })
  }, [navigation, router])

  if (query.data && query.data.routes.length < 1 && query.data.stops.length < 1) {
    return (
      <TrueSheetPeek>
        <UEmpty
          icon="land-plot"
          title={t('noResultsAreaQuerySearch')}
          className="m-2"
        />
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
        fetching={() => (
          <TrueSheetPeek style={{ padding: 12 }}>
            <UActivityIndicator />
          </TrueSheetPeek>
        )}
      >
        <UNativeGestureHandlerRootView className="grow gap-2">
          {query.data && query.data.stops.length > 0 && (
            <View className="gap-2">
              <TrueSheetPeek>
                <UBadge
                  label={t('stops')}
                  icon="map-pin"
                  variant="ghost"
                  color="neutral"
                />
              </TrueSheetPeek>

              {query.data.stops.map((stop) => (
                <Link
                  key={stop.id}
                  href={{ params: { stopCode: stop.code }, pathname: `/(sheet)/stop/[stopCode]` }}
                  asChild
                >
                  <UButton
                    label={stop.name}
                    variant="ghost"
                    color="neutral"
                    trailingIcon="chevron-right"
                  >
                    <UBadge icon="map-pin" />
                    <UButton.Text>{stop.name}</UButton.Text>
                  </UButton>
                </Link>
              ))}
            </View>
          )}

          {query.data && query.data.routes.length > 0 && (
            <View className="gap-2">
              {query.data.stops.length === 0 ? (
                <TrueSheetPeek>
                  <UBadge
                    label={t('routes')}
                    icon="route"
                    variant="ghost"
                    color="neutral"
                  />
                </TrueSheetPeek>
              ) : (
                <UBadge
                  label={t('routes')}
                  icon="route"
                  variant="ghost"
                  color="neutral"
                />
              )}

              {query.data.routes.map((route, index) => (
                <Link
                  key={route.id}
                  href={{
                    params: { code: route.line_code, type: 'line' },
                    pathname: '/(sheet)/groups',
                  }}
                  asChild
                >
                  <UButton
                    variant="ghost"
                    color="neutral"
                    trailingIcon="chevron-right"
                  >
                    <View className="shrink flex-row items-center gap-2">
                      <ScopedVariables
                        variables={{
                          '--color-primary': colors?.at(index)?.schemes.dark.primary ?? '',
                        }}
                      >
                        <UBadge label={route.line_code} />
                      </ScopedVariables>

                      <UButton.Text
                        className="font-inter-medium shrink text-sm"
                        numberOfLines={1}
                      >
                        {route.name}
                      </UButton.Text>
                    </View>
                  </UButton>
                </Link>
              ))}
            </View>
          )}
        </UNativeGestureHandlerRootView>
      </UQueryState>
    </ScrollView>
  )
}

export default NearbyScreen
