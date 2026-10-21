import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import {
  Map as _Map,
  type LngLatBounds,
  type CameraProps,
  type MapProps,
  type ViewStateChangeEvent,
  Camera,
} from '@maplibre/maplibre-react-native'
import { NativeSyntheticEvent } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { useMap } from '@/composables/useMap'
import { useMapStyle } from '@/composables/useMapStyle'

import { useSettingsStore } from '../stores/settings'

// so compiler is not upset
const getInitialMapBounds = () => {
  return useSettingsStore.getState().initialMapBounds
}

export const Map = ({
  children,
  onDidFinishLoadingMap,
  ...props
}: { initialMapBounds?: LngLatBounds; cameraProps?: CameraProps } & Omit<MapProps, 'mapStyle'>) => {
  const { camera, map } = useMap()
  const { style: mapStyle } = useMapStyle()
  const navigation = useTrueSheetNavigation()
  const opacity = useSharedValue(0)

  const onMapRegionChange = (event: NativeSyntheticEvent<ViewStateChangeEvent>) => {
    useSettingsStore.setState(() => ({
      initialMapBounds: event.nativeEvent.bounds,
      bearing: event.nativeEvent.bearing,
      pitch: event.nativeEvent.pitch,
    }))
  }

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    flex: 1,
  }))

  return (
    <Animated.View style={containerStyle}>
      <_Map
        ref={map}
        logo={false}
        attribution={false}
        compass={false}
        onRegionDidChange={onMapRegionChange}
        onDidFinishLoadingMap={(event) => {
          opacity.set(withTiming(1, { duration: 250 }))
          onDidFinishLoadingMap?.(event)
        }}
        onLongPress={({ nativeEvent }) => {
          navigation.navigate('(sheet)/markers/nearby', {
            lng: nativeEvent.lngLat[0],
            lat: nativeEvent.lngLat[1],
          })
        }}
        style={{ flex: 1 }}
        preferredFramesPerSecond={60}
        {...props}
        mapStyle={mapStyle}
      >
        <Camera ref={camera} initialViewState={{ bounds: getInitialMapBounds() }} />

        {children}
      </_Map>
    </Animated.View>
  )
}
