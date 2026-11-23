import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import { Camera, GeoJSONSource } from '@maplibre/maplibre-react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, View, type ScrollViewInstance } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useCSSVariable } from 'uniwind'

import { MarkerStopLayer } from '@/components/marker/MarkerStopLayer'
import { MapProvider } from '@/components/provider/MapProvider'
import { StopCardArrivals } from '@/components/stop/card/StopCardArrivals'
import { UButton, UQueryState, UText, UMap } from '@/components/u'
import { UNativeGestureHandlerRootView } from '@/components/u/native/UNativeGestureHandlerRootView'
import { SkeletonStop } from '@/components/u/skeleton/SkeletonStop'
import { useCountdown, useMap } from '@/composables'
import { useStopArrivals, useStop } from '@/composables/query'
import { GroupItemContext } from '@/composables/useGroupItem'
import { MS_60_SECONDS } from '@/constants/time'

export const StopScreen = () => {
  const { t } = useTranslation()
  const { easeTo } = useMap()
  const scrollableRef = useRef<ScrollViewInstance>(null)
  const navigation = useTrueSheetNavigation()
  const colorPrimary = useCSSVariable('--color-primary')?.toString()

  const { stopCode } = useLocalSearchParams<{ stopCode: string }>()

  const { query: stopQuery } = useStop(stopCode)
  const { query: arrivalQuery } = useStopArrivals(stopCode)
  const { remaining } = useCountdown(arrivalQuery.dataUpdatedAt, MS_60_SECONDS)

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
          <>
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
                        backgroundColor: colorPrimary,
                      },
                      type: 'Feature',
                    }}
                  >
                    <MarkerStopLayer isHidden={false} />
                  </GeoJSONSource>
                </UMap>
              </MapProvider>
            </View>

            <UNativeGestureHandlerRootView className="flex-row flex-wrap gap-2">
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
              <Link
                href={{
                  params: { code: stopCode, type: 'stop' },
                  pathname: '/(sheet)/groups',
                }}
                asChild
              >
                <UButton
                  label={t('addToGroup')}
                  icon="circle-plus"
                />
              </Link>
            </UNativeGestureHandlerRootView>

            <View>
              <UText className="text-muted text-sm">{stopQuery.data?.stop.code}</UText>
              <UText className="font-inter-medium text-lg">{stopQuery.data?.stop.name}</UText>
              {stopQuery.data?.stop.province && (
                <UText className="text-muted text-sm">{stopQuery.data.stop.province}</UText>
              )}
            </View>

            {stopQuery.data.buses.length > 0 && (
              <UNativeGestureHandlerRootView>
                <UText className="text-muted text-sm">{t('linesThatUseStop')}</UText>

                <View className="mt-1 flex-row flex-wrap gap-2">
                  {stopQuery.data.buses.map((bus) => (
                    <Link
                      key={bus}
                      href={{
                        params: {
                          code: bus,
                          type: 'line',
                        },
                        pathname: '/(sheet)/groups',
                      }}
                      asChild
                    >
                      <UButton
                        label={bus}
                        variant="soft"
                      />
                    </Link>
                  ))}
                </View>
              </UNativeGestureHandlerRootView>
            )}
          </>
        )}
      </UQueryState>

      <UQueryState query={arrivalQuery}>
        <UText className="text-muted font-inter-medium mr-2 ml-auto text-sm">
          {t('updateCount', { count: remaining })}
        </UText>
      </UQueryState>

      <GroupItemContext value={stopCode.toString()}>
        <StopCardArrivals />
      </GroupItemContext>
    </ScrollView>
  )
}

export default StopScreen
