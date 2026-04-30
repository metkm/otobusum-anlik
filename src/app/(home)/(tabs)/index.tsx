import { Camera, UserLocation, type ViewStateChangeEvent } from '@maplibre/maplibre-react-native'
import { NativeSyntheticEvent, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { LineCards } from '@/components/line/LineCards'
import { LineMarkers } from '@/components/line/LineMarkers'
import { Map } from '@/components/Map'
import { MapButtons } from '@/components/MapButtons'

import { useSettingsStore } from '@/stores'

export const HomeScreen = () => {
  // const initialMapBounds = useSettingsStore(useShallow(state => state.initialMapBounds))
  const initialMapBounds = useSettingsStore.getState().initialMapBounds
  const showMyLocation = useSettingsStore(useShallow(state => state.showMyLocation))

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
