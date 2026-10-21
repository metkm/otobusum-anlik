import { TrueSheetPeek } from '@lodev09/react-native-true-sheet'
import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import type { LngLatBounds } from '@maplibre/maplibre-react-native'
import { hexFromArgb } from '@material/material-color-utilities'
import { useLocalSearchParams, useRouter } from 'expo-router'
import type { FeatureCollection } from 'geojson'
import { t } from 'i18next'
import { useEffect, useMemo, useRef } from 'react'
import { View, type ScrollViewInstance } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { ScopedVariables, useCSSVariable } from 'uniwind'

import { UActivityIndicator } from '@/components/u/UActivityIndicator'
import { UBadge } from '@/components/u/UBadge'
import { UButton } from '@/components/u/UButton'
import { UEmpty } from '@/components/u/UEmpty'
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
  const bounds = useRef<LngLatBounds>(undefined)

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
            color: colors?.[index] ? hexFromArgb(colors[index].schemes.dark.primary) : undefined,
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
            color: primaryColor,
          },
          type: 'Feature',
        })) || [],
      type: 'FeatureCollection',
    }),
    [primaryColor, query.data?.stops],
  )

  const polygonCollection = useMemo<FeatureCollection | undefined>(() => {
    if (!query.data) {
      return
    }

    return {
      features: [
        {
          geometry: {
            coordinates: [getPolygonCoordinatesFromPoint([lng!, lat!], query.data.stops_radius)],
            type: 'Polygon',
          },
          properties: {},
          type: 'Feature',
        },
      ],
      type: 'FeatureCollection',
    }
  }, [lat, lng, query.data])

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
    id: 'area-polygon',
    layerProps: {
      paint: {
        'fill-color': 'white',
        'fill-opacity': 0.2,
      },
      type: 'fill',
    },
    renderer: 'layer',
  })

  useEffect(() => {
    const geo = polygonCollection?.features[0]?.geometry

    if (geo?.type !== 'Polygon') {
      return
    }

    const fit = async () => {
      bounds.current = (await map.current?.getBounds()) || undefined

      const result = geo.coordinates[0]?.map((coord) => ({ lat: coord[1]!, lng: coord[0]! }))
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
        loading={() => (
          <TrueSheetPeek style={{ padding: 12 }}>
            <UActivityIndicator />
          </TrueSheetPeek>
        )}
      >
        <GestureHandlerRootView style={{ flexGrow: 1, gap: 8 }}>
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
                  to={{ params: { stopCode: stop.code }, pathname: `(sheet)/stop/[stopCode]` }}
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
                    params: { addToGroup: route.line_code },
                    pathname: '(sheet)/groups/index',
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
