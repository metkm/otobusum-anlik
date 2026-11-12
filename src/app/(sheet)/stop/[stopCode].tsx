import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import { Camera, GeoJSONSource } from '@maplibre/maplibre-react-native'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, View, type ScrollViewInstance } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { useCSSVariable } from 'uniwind'

import { LineMarkerStopLayer } from '@/components/line/marker/LineMarkerStops'
import { MapProvider } from '@/components/MapProvider'
import { StopCardArrivals } from '@/components/stop/StopCardArrivals'
import { UButton, UQueryState, UText } from '@/components/u'
import { UMap } from '@/components/u/Map'
import { SkeletonStop } from '@/components/u/skeleton/SkeletonStop'
import { useCountdown, useMap } from '@/composables'
import { useStopArrivals, useStop } from '@/composables/query'
import { GroupItemContext } from '@/composables/useGroupItem'

export const StopScreen = () => {
  const { t } = useTranslation()
  const { easeTo } = useMap()
  const scrollableRef = useRef<ScrollViewInstance>(null)
  const navigation = useTrueSheetNavigation()
  const colorPrimary = useCSSVariable('--color-primary')?.toString()

  const searchParams = useLocalSearchParams()
  const stopCode = parseInt(searchParams.stopCode! as string)

  const { query: stopQuery } = useStop(stopCode)
  const { query: arrivalQuery } = useStopArrivals(stopCode)
  const { remaining } = useCountdown(arrivalQuery.dataUpdatedAt, 60_000)

  useEffect(() => {
    navigation.setOptions({
      scrollableRef,
    })
  }, [navigation])

  const openDirectionsToStop = async () => {
    if (!stopQuery.data) {
      return
    }

    const scheme = `geo:0,0?q=${stopQuery.data.stop.lat},${stopQuery.data.stop.lng}&label=${stopQuery.data.stop.name}`
    void Linking.openURL(scheme)
  }

  const zoomStopOnMap = () => {
    if (stopQuery.data) {
      easeTo({ lat: stopQuery.data.stop.lat, lng: stopQuery.data.stop.lng })
    }
  }

  return (
    <ScrollView
      ref={scrollableRef}
      className="flex-1"
      contentContainerClassName="p-2 gap-2"
    >
      <UQueryState
        query={stopQuery}
        fetching={SkeletonStop}
      >
        {stopQuery.data && (
          <View className="gap-2">
            <View className="h-48 overflow-hidden rounded-md">
              <MapProvider>
                <UMap
                  dragPan={false}
                  touchZoom={false}
                  doubleTapZoom={false}
                >
                  <Camera
                    center={[stopQuery.data.stop.lng, stopQuery.data.stop.lat]}
                    zoom={15}
                  />

                  <GeoJSONSource
                    data={{
                      geometry: {
                        coordinates: [stopQuery.data.stop.lng, stopQuery.data.stop.lat],
                        type: 'Point',
                      },
                      properties: {
                        color: colorPrimary,
                      },
                      type: 'Feature',
                    }}
                  >
                    <LineMarkerStopLayer
                      isHidden={false}
                      afterId={undefined}
                    />
                  </GeoJSONSource>
                </UMap>
              </MapProvider>
            </View>

            <GestureHandlerRootView style={{ flexGrow: 1, flexShrink: 0 }}>
              <View className="grow flex-row flex-wrap gap-2">
                <UButton
                  label={t('directionToStop')}
                  onPress={openDirectionsToStop}
                  icon="droplet"
                  block
                  className="flex-1"
                />
                <UButton
                  label={t('zoomStopOnMap')}
                  onPress={zoomStopOnMap}
                  icon="locate-fixed"
                  block
                  className="flex-1"
                />
              </View>
            </GestureHandlerRootView>

            <View>
              <UText className="text-muted text-sm">{stopQuery.data?.stop.code}</UText>
              <UText className="font-inter-medium text-lg">{stopQuery.data?.stop.name}</UText>
              {stopQuery.data?.stop.province && (
                <UText className="text-muted text-sm">{stopQuery.data.stop.province}</UText>
              )}
            </View>

            {stopQuery.data.buses.length > 0 && (
              <GestureHandlerRootView style={{ flexShrink: 0 }}>
                <UText className="text-muted text-sm">{t('linesThatUseStop')}</UText>

                <View className="mt-1 flex-row flex-wrap gap-2">
                  {stopQuery.data.buses.map((bus) => (
                    <UButton
                      key={bus}
                      label={bus}
                      variant="soft"
                      to={{
                        params: {
                          code: bus,
                          type: 'line',
                        },
                        pathname: '(sheet)/groups/index',
                      }}
                    />
                  ))}
                </View>
              </GestureHandlerRootView>
            )}
          </View>
        )}
      </UQueryState>

      <UText className="text-muted font-inter-medium mr-2 ml-auto text-sm">
        {t('updateCount', { count: remaining })}
      </UText>

      <GroupItemContext value={stopCode.toString()}>
        <StopCardArrivals />
      </GroupItemContext>
    </ScrollView>
  )
}

export default StopScreen
