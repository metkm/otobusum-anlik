import { Map as _Map, type MapRef, type LngLatBounds, type CameraProps, type MapProps, type ViewStateChangeEvent, Camera } from '@maplibre/maplibre-react-native'
import React, { RefObject } from 'react'
import { NativeSyntheticEvent } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useSettingsStore } from '../stores/settings'

import { useMap } from '@/composables/useMap'

export interface TheMapProps {
  children?: React.ReactNode
  onMapReady?: () => void
  ref?: RefObject<MapRef | null>
}

export const Map = ({ children, cameraProps, style, ...props }: { initialMapBounds?: LngLatBounds, cameraProps?: CameraProps } & Omit<MapProps, 'mapStyle'>) => {
  const { camera, map } = useMap()

  const initialMapBounds = useSettingsStore.getState().initialMapBounds

  const { style: mapStyle } = useSettingsStore(useShallow(state => state.getMapStyle()))

  const onMapRegionChange = (event: NativeSyntheticEvent<ViewStateChangeEvent>) => {
    useSettingsStore.setState(() => ({
      initialMapBounds: event.nativeEvent.bounds,
      bearing: event.nativeEvent.bearing,
      pitch: event.nativeEvent.pitch,
    }))
  }

  return (
    <_Map
      ref={map}
      logo={false}
      attribution={false}
      compass={false}
      onRegionDidChange={onMapRegionChange}
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
  )
}
