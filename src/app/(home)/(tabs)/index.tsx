import { UserLocation } from '@maplibre/maplibre-react-native'
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

  return (
    <View className="flex-col flex-1">
      {
        !hideMap && (
          <Map>
            <LineMarkers />
            {showMyLocation && <UserLocation heading />}
          </Map>
        )
      }

      <MapOverlay>
        <MapButtons />
        <LineCards />
      </MapOverlay>
    </View>
  )
}

export default HomeScreen
