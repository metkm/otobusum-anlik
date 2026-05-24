import { Camera } from '@maplibre/maplibre-react-native'
import { useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { Map } from '@/components/Map'
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
    <View className="gap-2 pt-5 pb-2 px-2">
      {data && (
        <View className="h-40 rounded-md overflow-hidden">
          <Map
            dragPan={false}
            touchZoom={false}
            doubleTapZoom={false}
          >
            <Camera center={[data.stop.lng, data.stop.lat]} zoom={15} />
          </Map>
        </View>
      )}

      <GestureHandlerRootView style={{ flexShrink: 0 }}>
        <UButton
          label={t('directionToStop')}
          onPress={openDirectionsToStop}
          icon="droplet"
          block
        />
      </GestureHandlerRootView>

      <View>
        <UText className="text-muted">{data?.stop.code}</UText>
        <UText className="text-lg font-inter-medium">{data?.stop.name}</UText>
        <UText className="text-muted">{data?.stop.province}</UText>
      </View>

      {data.buses.length > 0 && (
        <GestureHandlerRootView style={{ flexShrink: 0 }}>
          <UText>{t('linesThatUseStop')}</UText>

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
  )
}

export default StopScreen
