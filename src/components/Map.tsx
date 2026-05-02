import { Layer, Map as _Map, RasterSource, type MapRef, type LngLatBounds, type CameraProps, type MapProps, type ViewStateChangeEvent, Camera } from '@maplibre/maplibre-react-native'
import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import React, { RefObject, useState } from 'react'
import { NativeSyntheticEvent } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useSettingsStore } from '../stores/settings'

import { UActivityIndicator } from './u/UActivityIndicator'

import rawStyleJson from '@/assets/style.json'
import { useColorScheme } from '@/composables/useLineTheme'
import { useMap } from '@/composables/useMap'
import { LONG_CACHE_MS } from '@/constants/app'

export interface TheMapProps {
  children?: React.ReactNode
  onMapReady?: () => void
  ref?: RefObject<MapRef | null>
}

const styleJson = JSON.stringify(rawStyleJson)

export const Map = ({ children, cameraProps, style, ...props }: { initialMapBounds?: LngLatBounds, cameraProps?: CameraProps } & Omit<MapProps, 'mapStyle'>) => {
  const { camera, map } = useMap()

  const [visible, setVisible] = useState(false)
  const themeScheme = useColorScheme()

  const initialMapBounds = useSettingsStore.getState().initialMapBounds
  const showTraffic = useSettingsStore(useShallow(state => state.showTraffic))
  const { scheme: mapScheme, style: mapStyle } = useSettingsStore(useShallow(state => state.getMapStyle()))

  const { data } = useQuery({
    queryKey: ['map-session', showTraffic, mapScheme],
    queryFn: () =>
      ky.post<{ session: string }>(`https://tile.googleapis.com/v1/createSession`, {
        searchParams: { key: process.env.EXPO_PUBLIC_MAP_API },
        body: JSON.stringify({
          mapType: 'roadmap',
          language: 'en-US',
          region: 'TR',
          layerTypes: showTraffic ? ['layerTraffic'] : [],
          styles: mapStyle,
          scale: 'scaleFactor2x',
          highDpi: 'true',
        }),
      })
        .json(),
    staleTime: LONG_CACHE_MS,
  })

  if (!data) {
    return <UActivityIndicator />
  }

  const tiles = [`https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}?session=${data.session}&key=${process.env.EXPO_PUBLIC_MAP_API}`]

  const onFinishLoadingMap = () => setVisible(true)

  const onMapRegionChange = (event: NativeSyntheticEvent<ViewStateChangeEvent>) => {
    useSettingsStore.setState(() => ({
      initialMapBounds: event.nativeEvent.bounds,
      bearing: event.nativeEvent.bearing,
    }))
  }

  return (
    <_Map
      ref={map}
      logo={false}
      attribution={false}
      compass={false}
      androidView="texture"
      onDidFinishLoadingMap={onFinishLoadingMap}
      onRegionDidChange={onMapRegionChange}
      style={{ opacity: visible ? 1 : 0, flex: 1, ...style }}
      {...props}
      mapStyle={styleJson}
    >
      <RasterSource
        key={themeScheme}
        id="google-raster-source"
        tiles={tiles}
        tileSize={256}
      >
        <Layer
          type="raster"
          id="google-raster-layer"
          layerIndex={8}
        />
      </RasterSource>

      <Camera
        ref={camera}
        initialViewState={{ bounds: initialMapBounds }}
      />

      {children}
    </_Map>
  )
}
