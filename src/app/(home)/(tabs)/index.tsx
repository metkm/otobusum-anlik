import { UserLocation } from '@maplibre/maplibre-react-native'
import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { LineCards } from '@/components/line/LineCards'
import { LineMarkers } from '@/components/line/LineMarkers'
import { Map } from '@/components/Map'
import { MapButtons } from '@/components/MapButtons'

import { useSettingsStore } from '@/stores'

export const HomeScreen = () => {
  const showMyLocation = useSettingsStore(useShallow(state => state.showMyLocation))

  return (
    <>
      <Map>
        <LineMarkers />
        {showMyLocation && <UserLocation heading />}
      </Map>

      <MapButtons />

      <View className="absolute bottom-0">
        <LineCards />
      </View>
    </>
  )
}

export default HomeScreen
