import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import {
  Camera,
  type CameraProps,
  type LngLatBounds,
  type MapProps as _MapProps,
  type ViewStateChangeEvent,
  Map as MapLibre,
} from '@maplibre/maplibre-react-native'
import type { NativeSyntheticEvent } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { useMap } from '@/composables/useMap'
import { useMapStyle } from '@/composables/useMapStyle'

import { useSettingsStore } from '../stores/settings'

// So compiler is not upset
const getInitialMapBounds = () => useSettingsStore.getState().initialMapBounds

interface MapProps extends Omit<_MapProps, 'mapStyle'> {
  initialMapBounds?: LngLatBounds
  cameraProps?: CameraProps
}

export const Map = ({ children, onDidFinishLoadingMap, ...props }: MapProps) => {
  const { camera, map } = useMap()
  const { style: mapStyle } = useMapStyle()
  const navigation = useTrueSheetNavigation()
  const opacity = useSharedValue(0)

  const onMapRegionChange = (event: NativeSyntheticEvent<ViewStateChangeEvent>) => {
    useSettingsStore.setState(() => ({
      bearing: event.nativeEvent.bearing,
      initialMapBounds: event.nativeEvent.bounds,
      pitch: event.nativeEvent.pitch,
    }))
  }

  const containerStyle = useAnimatedStyle(() => ({
    flex: 1,
    opacity: opacity.value,
  }))

  return (
    <Animated.View style={containerStyle}>
      <MapLibre
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
            lat: nativeEvent.lngLat[1],
            lng: nativeEvent.lngLat[0],
          })
        }}
        style={{ flex: 1 }}
        preferredFramesPerSecond={60}
        {...props}
        mapStyle={mapStyle}
      >
        <Camera
          ref={camera}
          initialViewState={{ bounds: getInitialMapBounds() }}
        />

        {children}
      </MapLibre>
    </Animated.View>
  )
}
