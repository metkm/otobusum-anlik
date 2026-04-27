import { Camera, type ViewStateChangeEvent } from '@maplibre/maplibre-react-native'
import { NativeSyntheticEvent, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { LineCards } from '@/components/line/LineCards'
import { LineMarkers } from '@/components/line/LineMarkers'
import { Map } from '@/components/Map'
import { MapButtons } from '@/components/MapButtons'

import { useSettingsStore } from '@/stores'

export const HomeScreen = () => {
  const initialMapBounds = useSettingsStore(useShallow(state => state.initialMapBounds))

  const onMapRegionChange = (event: NativeSyntheticEvent<ViewStateChangeEvent>) => {
    useSettingsStore.setState(() => ({
      initialMapBounds: event.nativeEvent.bounds,
    }))
  }

  return (
    <>
      <Map onRegionDidChange={onMapRegionChange}>
        <Camera initialViewState={{ bounds: initialMapBounds }} />
        <LineMarkers />
      </Map>

      <MapButtons />

      <View className="absolute bottom-0">
        <LineCards />
      </View>
    </>
  )
}

export default HomeScreen
