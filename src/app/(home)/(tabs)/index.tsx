import { UserLocation } from '@maplibre/maplibre-react-native'
import { useIsFocused } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { GroupCardItems } from '@/components/group/GroupCardItems'
import { GroupsMarkers } from '@/components/group/GroupsMarkers'
import { MapTemporaryMarkers } from '@/components/MapTemporaryMarkers'
import { Overlay } from '@/components/overlay/Overlay'
import { OverlayMapButtons } from '@/components/overlay/OverlayMapButtons'
import { UMap } from '@/components/u/Map'
import { useMapStyle } from '@/composables/useMapStyle'
import { useSettingsStore } from '@/stores'

export const HomeScreen = () => {
  const showMyLocation = useSettingsStore(useShallow((state) => state.showMyLocation))
  const hideMap = useSettingsStore(useShallow((state) => state.hideMap))

  const { scheme: mapScheme } = useMapStyle()
  const isFocused = useIsFocused()

  return (
    <View className="flex-1">
      {isFocused && <StatusBar style={mapScheme === 'dark' ? 'light' : 'dark'} />}

      {!hideMap && (
        <UMap>
          <MapTemporaryMarkers />
          <GroupsMarkers />

          {showMyLocation && <UserLocation heading />}
        </UMap>
      )}

      <Overlay>
        <OverlayMapButtons />
        <GroupCardItems />
      </Overlay>
    </View>
  )
}

export default HomeScreen
