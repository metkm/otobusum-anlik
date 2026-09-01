import { Map as _Map, type MapRef, type LngLatBounds, type CameraProps, type MapProps, type ViewStateChangeEvent, Camera } from '@maplibre/maplibre-react-native'
import React, { RefObject } from 'react'
import { NativeSyntheticEvent } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { useSettingsStore } from '../stores/settings'

import { useMap } from '@/composables/useMap'
import { useMapStyle } from '@/composables/useMapStyle'

export interface TheMapProps {
  children?: React.ReactNode
  onMapReady?: () => void
  ref?: RefObject<MapRef | null>
}

export const Map = ({ children, cameraProps, style, onDidFinishLoadingMap, ...props }: { initialMapBounds?: LngLatBounds, cameraProps?: CameraProps } & Omit<MapProps, 'mapStyle'>) => {
  const { camera, map } = useMap()
  const { style: mapStyle } = useMapStyle()
  const opacity = useSharedValue(0)
  const scale = useSharedValue(1.2)

  const initialMapBounds = useSettingsStore.getState().initialMapBounds

  const onMapRegionChange = (event: NativeSyntheticEvent<ViewStateChangeEvent>) => {
    useSettingsStore.setState(() => ({
      initialMapBounds: event.nativeEvent.bounds,
      bearing: event.nativeEvent.bearing,
      pitch: event.nativeEvent.pitch,
    }))
  }

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
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
          scale.set(withTiming(1, { duration: 250 }))

          onDidFinishLoadingMap?.(event)
        }}
        style={{ flex: 1 }}
        {...props}
        mapStyle={mapStyle}
      >
        <Camera
          ref={camera}
          initialViewState={{ bounds: initialMapBounds }}
        />

        {children}
      </_Map>
    </Animated.View>
  )
}
