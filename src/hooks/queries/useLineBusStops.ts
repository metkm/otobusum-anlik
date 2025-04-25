import { useQuery } from '@tanstack/react-query'
import * as Location from 'expo-location'
import { useCallback, useEffect, useState } from 'react'

import { getLineBusStops } from '@/api/getLineBusStops'
import { useSettingsStore } from '@/stores/settings'
import { BusStop } from '@/types/bus'
import { getDistanceFromLatLon } from '@/utils/getDistanceFromLatLon'

export function useLineBusStops(
  routeCode: string,
  listenToUserLocation?: boolean,
) {
  const [closestStop, setClosestStop] = useState<BusStop>()

  const query = useQuery({
    queryKey: [`stop-locations`, routeCode],
    queryFn: () => getLineBusStops(routeCode),
    staleTime: 60_000 * 30,
    meta: { persist: true },
  })

  const handlePositionListener: Location.LocationCallback = useCallback(
    (location) => {
      let currentMinimumDistance
      let currentClosestStop

      for (let index = 0; index < (query.data?.length || 0); index++) {
        const stop = query.data?.at(index)
        if (!stop) continue

        const distance = getDistanceFromLatLon(
          { ...location.coords },
          {
            latitude: stop.y_coord,
            longitude: stop.x_coord,
          },
        )

        if (!currentMinimumDistance || currentMinimumDistance > distance) {
          currentMinimumDistance = distance
          currentClosestStop = stop
        }
      }

      if (currentClosestStop && currentClosestStop.stop_code !== closestStop?.stop_code) {
        setClosestStop(currentClosestStop)
      }
    },
    [query.data, closestStop],
  )

  const setupListener = useCallback(async () => {
    const listener = await Location.watchPositionAsync(
      { timeInterval: 5000, distanceInterval: 30 },
      handlePositionListener,
    )

    return listener
  }, [handlePositionListener])

  useEffect(() => {
    let locationListener: Location.LocationSubscription | undefined
    const unlisten = useSettingsStore.subscribe(state => state.showMyLocation, async (showLocation) => {
      if (listenToUserLocation && showLocation && !locationListener) {
        locationListener = await setupListener()
      } else if (!showLocation && closestStop) {
        setClosestStop(undefined)
        locationListener?.remove()
      }
    }, {
      fireImmediately: true,
    })

    return () => {
      unlisten()
      locationListener?.remove()
    }
  }, [closestStop, listenToUserLocation, setupListener])

  return {
    query,
    closestStop,
  }
}
