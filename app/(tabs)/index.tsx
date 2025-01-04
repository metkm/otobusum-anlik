import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import MapView, { Region } from 'react-native-maps'
import { useSharedValue } from 'react-native-reanimated'

import { LinesMomoizedFr } from '@/components/lines/Lines'
import { LineMarkers } from '@/components/markers/LineMarkers'
import { TheMap } from '@/components/TheMap'
import { TheMapButtons } from '@/components/TheMapButtons'
import { TheStopInfo } from '@/components/TheStopInfo'

import { MapContext } from '@/hooks/contexts/useMap'
import { SheetContext, sheetContextValues } from '@/hooks/contexts/useSheetModal'

import { queryClient } from '@/api/client'
import { getLineBusStops } from '@/api/getLineBusStops'
import { getSelectedRouteCode, useFiltersStore } from '@/stores/filters'
import { useLinesStore } from '@/stores/lines'
import { useSettingsStore } from '@/stores/settings'

export const HomeScreen = () => {
  const map = useRef<MapView>(null)

  useEffect(() => {
    const unsub = useLinesStore.subscribe(
      state => state.lines,
      async (state, prevState) => {
        const city = useFiltersStore.getState().selectedCity
        const newStateCity = state[city]
        const oldStateCity = prevState[city]
        if (newStateCity.length < oldStateCity.length) return

        const newCode = newStateCity.at(-1)
        if (!newCode) return

        const routeCode = getSelectedRouteCode(newCode)
        const queryKey = [`stop-locations`, routeCode]

        const busStops = await queryClient.ensureQueryData<
          Awaited<ReturnType<typeof getLineBusStops>>
        >({
          queryKey,
          queryFn: () => getLineBusStops(routeCode),
        })

        map.current?.fitToCoordinates(
          busStops?.map(stop => ({
            longitude: stop.x_coord,
            latitude: stop.y_coord,
          })),
          {
            edgePadding: {
              bottom: 200,
              left: 0,
              right: 0,
              top: 0,
            },
          },
        )
      },
    )

    return unsub
  }, [])

  const sheetContext: sheetContextValues = {
    height: useSharedValue(0),
    index: useSharedValue(-1),
  }

  const handleOnMapReady = () => {
    SplashScreen.hideAsync()
  }

  const handleRegionChangeComplete = (region: Region) => {
    useSettingsStore.setState(() => ({ initialMapLocation: region }))
  }

  return (
    <View style={styles.container}>
      <MapContext.Provider value={map}>
        <SheetContext.Provider value={sheetContext}>
          <TheMap
            // cRef={map}
            // onMapReady={handleOnMapReady}
            // onRegionChangeComplete={handleRegionChangeComplete}
            // initialRegion={
            //   useSettingsStore.getState().initialMapLocation || {
            //     latitude: 39.66770141070046,
            //     latitudeDelta: 4.746350767346861,
            //     longitude: 28.17840663716197,
            //     longitudeDelta: 2.978521026670929,
            //   }
            // }
            // moveOnMarkerPress={false}
          >
            <LineMarkers />

          </TheMap>

          <TheMapButtons />

          <View style={styles.linesContainer}>
            <LinesMomoizedFr />
          </View>

          <TheStopInfo cRef={map} />
        </SheetContext.Provider>
      </MapContext.Provider>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linesContainer: {
    position: 'absolute',
    bottom: 0,
  },
})

export default HomeScreen
