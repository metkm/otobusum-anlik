import { UserLocation } from '@maplibre/maplibre-react-native'
import { useIsFocused } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { LineCards } from '@/components/line/LineCards'
import { LineMarkers } from '@/components/line/LineMarkers'
import { Map } from '@/components/Map'
import { MapButtons } from '@/components/MapButtons'
import { MapOverlay } from '@/components/MapOverlay'

import { useSettingsStore } from '@/stores'

export const HomeScreen = () => {
  const showMyLocation = useSettingsStore(useShallow(state => state.showMyLocation))
  const hideMap = useSettingsStore(useShallow(state => state.hideMap))
  const { scheme: mapScheme } = useSettingsStore(useShallow(state => state.getMapStyle()))

  const isFocused = useIsFocused()

  return (
    <View className="flex-1">
      {isFocused && (
        <StatusBar style={mapScheme === 'dark' ? 'light' : 'dark'} />
      )}

      {
        !hideMap && (
          <Map>
            <LineMarkers />
            {showMyLocation && <UserLocation heading />}
          </Map>
        )
      }

      <MapOverlay className="gap-2">
        <MapButtons />
        <LineCards className="flex-1" />
      </MapOverlay>
    </View>
  )
}

export default HomeScreen
