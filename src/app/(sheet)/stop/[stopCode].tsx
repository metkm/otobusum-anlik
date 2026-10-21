import { AnimatedLegendList } from '@legendapp/list/reanimated'
import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import { Camera, GeoJSONSource } from '@maplibre/maplibre-react-native'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, ScrollViewInstance, View } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { useCSSVariable } from 'uniwind'

import { LineMarkerStopLayer } from '@/components/line/marker/LineMarkerStops'
import { Map } from '@/components/Map'
import { MapProvider } from '@/components/MapProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SkeletonStop } from '@/components/u/skeleton/SkeletonStop'
import { UBadge } from '@/components/u/UBadge'
import { UButton } from '@/components/u/UButton'
import { UIcon } from '@/components/u/UIcon'
import { UQueryState } from '@/components/u/UQueryState'
import { UText } from '@/components/u/UText'
import { useStop } from '@/composables'
import { useStopArrivals } from '@/composables/useStopArrivals'
import { ItemLayoutAnimation } from '@/constants/animation'

export const StopScreen = () => {
  const { t } = useTranslation()
  const scrollableRef = useRef<ScrollViewInstance>(null)
  const navigation = useTrueSheetNavigation()
  const colorPrimary = useCSSVariable('--color-primary')?.toString()

  const searchParams = useLocalSearchParams()
  const stopCode = parseInt(searchParams.stopCode! as string)

  const { query: stopQuery } = useStop(stopCode)
  const { query: arrivalQuery } = useStopArrivals(stopCode)

  useEffect(() => {
    navigation.setOptions({
      scrollableRef,
    })
  }, [navigation])

  const openDirectionsToStop = async () => {
    if (!stopQuery.data) return

    const scheme = `geo:0,0?q=${stopQuery.data.stop.lat},${stopQuery.data.stop.lng}&label=${stopQuery.data.stop.name}`
    try {
      await Linking.openURL(scheme)
    } catch (error) {
      console.log(error)
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
        loading={SkeletonStop}
      >
        {stopQuery.data && (
          <View className="h-48 overflow-hidden rounded-md">
            <MapProvider>
              <Map
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
                    type: 'Feature',
                    properties: {
                      color: colorPrimary,
                    },
                    geometry: {
                      type: 'Point',
                      coordinates: [stopQuery.data.stop.lng, stopQuery.data.stop.lat],
                    },
                  }}
                >
                  <LineMarkerStopLayer
                    isHidden={false}
                    afterId={undefined}
                  />
                </GeoJSONSource>
              </Map>
            </MapProvider>
          </View>
        )}
      </UQueryState>

      <View className="gap-2">
        <GestureHandlerRootView style={{ flexShrink: 0 }}>
          <UButton
            label={t('directionToStop')}
            onPress={openDirectionsToStop}
            icon="droplet"
            block
          />
        </GestureHandlerRootView>

        <View>
          <UText className="text-muted text-xs">{stopQuery.data?.stop.code}</UText>
          <UText className="font-inter-medium text-lg">{stopQuery.data?.stop.name}</UText>
          {stopQuery.data?.stop.province && (
            <UText className="text-muted text-xs">{stopQuery.data?.stop.province}</UText>
          )}
        </View>

        {stopQuery.data && stopQuery.data.buses.length > 0 && (
          <GestureHandlerRootView style={{ flexShrink: 0 }}>
            <UText className="text-muted text-xs">{t('linesThatUseStop')}</UText>

            <View className="mt-1 flex-row flex-wrap gap-2">
              {stopQuery.data?.buses.map((bus) => (
                <UButton
                  key={bus}
                  label={bus}
                  variant="soft"
                  to={{
                    pathname: '/groups',
                    params: {
                      addToGroup: bus,
                    },
                  }}
                />
              ))}
            </View>
          </GestureHandlerRootView>
        )}
      </View>

      <UQueryState query={arrivalQuery}>
        <AnimatedLegendList
          data={arrivalQuery.data}
          itemLayoutAnimation={ItemLayoutAnimation}
          keyExtractor={(item) => item.door_no}
          getFixedItemSize={() => 64.33}
          recycleItems
          renderItem={({ item: arrival }) => (
            <View
              key={arrival.stop_order}
              className="flex-row items-center gap-2 p-2"
            >
              <UIcon
                name="bus-front"
                sizeClassName="size-6"
              />

              <View className="flex-1">
                <ThemeProvider code={arrival.line_code}>
                  <View className="flex-row items-center gap-2">
                    <UBadge label={arrival.line_code} />

                    <UIcon
                      name="accessibility"
                      sizeClassName="size-4"
                      colorClassName={arrival.features.accessible ? 'text-primary' : 'text-muted'}
                    />
                    <UIcon
                      name="usb"
                      sizeClassName="size-4"
                      colorClassName={
                        arrival.features.usb_available ? 'text-primary' : 'text-muted'
                      }
                    />
                    <UIcon
                      name="wifi"
                      sizeClassName="size-4"
                      colorClassName={
                        arrival.features.wifi_available ? 'text-primary' : 'text-muted'
                      }
                    />
                    <UIcon
                      name="air-vent"
                      sizeClassName="size-4"
                      colorClassName={arrival.features.ac_active ? 'text-primary' : 'text-muted'}
                    />
                    <UIcon
                      name="bike"
                      sizeClassName="size-4"
                      colorClassName={arrival.features.bicycle_rack ? 'text-primary' : 'text-muted'}
                    />
                  </View>
                </ThemeProvider>

                <UText
                  className="truncate"
                  numberOfLines={1}
                >
                  {arrival.line_name}
                </UText>
              </View>

              <View className="ml-auto">
                <UText className="font-inter-medium text-right">
                  {t('arrivingMinutes', { min: arrival.minutes_left })}
                </UText>
                <UText className="text-muted font-inter-medium text-xs">{t('arrivingIn')}</UText>
              </View>
            </View>
          )}
        />
      </UQueryState>
    </ScrollView>
  )
}

export default StopScreen
