import { Camera, GeoJSONSource } from '@maplibre/maplibre-react-native'
import { useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { LineMarkerStopLayer } from '@/components/line/marker/LineMarkerStops'
import { Map } from '@/components/Map'
import { MapProvider } from '@/components/MapProvider'
import { UActivityIndicator } from '@/components/u/UActivityIndicator'
import { UButton } from '@/components/u/UButton'
import { UText } from '@/components/u/UText'

import { useStop } from '@/composables'

export const StopScreen = () => {
  const { t } = useTranslation()
  const searchParams = useLocalSearchParams()
  const stopCode = parseInt(searchParams.stopCode! as string)

  const { query: { data, isFetching } } = useStop(stopCode)

  if (isFetching)
    return <UActivityIndicator className="mt-5 mb-2" />

  if (!data)
    return <UText className="mt-5 mb-2 text-center">Stop not found</UText>

  const openDirectionsToStop = async () => {
    if (!data)
      return

    const scheme = `geo:0,0?q=${data.stop.lat},${data.stop.lng}&label=${data.stop.name}`
    try {
      await Linking.openURL(scheme)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View className="pb-2">
      {data && (
        <View className="h-48 rounded-md overflow-hidden">
          <MapProvider>
            <Map
              dragPan={false}
              touchZoom={false}
              doubleTapZoom={false}
            >
              <Camera center={[data.stop.lng, data.stop.lat]} zoom={15} />

              <GeoJSONSource data={{
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: [data.stop.lng, data.stop.lat],
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

      <View className="p-2 gap-2">
        <GestureHandlerRootView style={{ flexShrink: 0 }}>
          <UButton
            label={t('directionToStop')}
            onPress={openDirectionsToStop}
            icon="droplet"
            block
          />
        </GestureHandlerRootView>

        <View>
          <UText className="text-muted text-xs">{data?.stop.code}</UText>
          <UText className="text-lg font-inter-medium">{data?.stop.name}</UText>
          {data.stop.province && (
            <UText className="text-muted text-xs">{data?.stop.province}</UText>
          )}
        </View>

        {data.buses.length > 0 && (
          <GestureHandlerRootView style={{ flexShrink: 0 }}>
            <UText className="text-muted text-xs">{t('linesThatUseStop')}</UText>

            <View className="flex-row flex-wrap gap-2 mt-1">
              {data.buses.map(bus => (
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
    </View>
  )
}

export default StopScreen
