import { UserLocation } from '@maplibre/maplibre-react-native'
import { useFocusEffect } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { LayoutAnimationConfig } from 'react-native-reanimated'
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

  useFocusEffect(() => {
    StatusBar.setStyle(mapScheme === 'dark' ? 'light' : 'dark')

    return () => {
      StatusBar.setStyle('auto')
    }
  })

  return (
    <View className="flex-1">
      {!hideMap && (
        <UMap>
          <MapTemporaryMarkers />
          <GroupsMarkers />

          {showMyLocation && <UserLocation heading />}
        </UMap>
      )}

      <LayoutAnimationConfig skipEntering>
        <Overlay>
          <OverlayMapButtons />
          <GroupCardItems shouldGrow={hideMap} />
        </Overlay>
      </LayoutAnimationConfig>
    </View>
  )
}

export default HomeScreen
