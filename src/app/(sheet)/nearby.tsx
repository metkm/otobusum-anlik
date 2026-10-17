import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import type { Feature } from 'geojson'
import { useEffect, useRef } from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { UQueryState } from '@/components/u/UQueryState'
import { UText } from '@/components/u/UText'

import { useTransitNearby } from '@/composables/useTransitNearby'
import { useTemporaryMarkerStore } from '@/stores/temporaryMarker'
import { createRandomHslColor, hexFromHsl } from '@/utils/color'

export const NearbyScreen = () => {
  const { query } = useTransitNearby()
  const navigation = useTrueSheetNavigation()
  const scrollableRef = useRef<ScrollView>(null)

  const addMarkers = useTemporaryMarkerStore(useShallow(state => state.addCollection))
  const removeMarkers = useTemporaryMarkerStore(useShallow(state => state.removeCollection))

  const colors = query.data?.routes.map(() => hexFromHsl(...createRandomHslColor()))

  useEffect(() => {
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
        color: colors?.[index],
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

    return () => {
      removeMarkers('stops')
      removeMarkers('routes')
    }
  }, [addMarkers, colors, query.data, removeMarkers])

  useEffect(() => {
    navigation.setOptions({
      scrollableRef,
    })
  })

  return (
    <ScrollView
      ref={scrollableRef}
      contentContainerClassName="pt-8 p-2"
    >
      <GestureHandlerRootView style={{ gap: 4 }}>
        <UQueryState query={query}>
          <View className="gap-2">
            <UText className="font-inter-medium text-lg text-center">Stops</UText>

            {query.data?.stops.map(stop => (
              <UButton
                key={stop.id}
                label={stop.name}
                icon="bus-front"
                to={`/(sheet)/stop/${stop.code}`}
                variant="ghost"
                color="neutral"
              />
            ))}
          </View>

          <View className="gap-2">
            <UText className="font-inter-medium text-lg text-center">Routes</UText>

            {query.data?.routes.map((route, index) => (
              <UButton
                key={route.id}
                to={{
                  pathname: '/groups',
                  params: { addToGroup: route.code },
                }}
                variant="ghost"
                color="neutral"
              >
                <View className="flex-row items-center gap-2 shrink">
                  <UText
                    className="bg-muted rounded-md px-2.5 py-1 font-inter-medium text-xs"
                    style={{ backgroundColor: colors?.[index] }}
                  >
                    {route.code}
                  </UText>

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
