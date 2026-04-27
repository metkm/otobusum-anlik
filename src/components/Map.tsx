import { Layer, Map as _Map, RasterSource, type MapRef, type LngLatBounds, type CameraProps, type MapProps } from '@maplibre/maplibre-react-native'
import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import React, { RefObject, useRef, useState } from 'react'
import { ActivityIndicator, useColorScheme } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useSettingsStore } from '../stores/settings'

import rawStyleJson from '@/assets/style.json'
import { getMapStyle } from '@/constants/mapStyles'

export interface TheMapProps {
  children?: React.ReactNode
  onMapReady?: () => void
  ref?: RefObject<MapRef | null>
}

// const StyledMap = withUniwind(Map)
const styleJson = JSON.stringify(rawStyleJson)

export const Map = ({ children, cameraProps, style, ...props }: { initialMapBounds?: LngLatBounds, cameraProps?: CameraProps } & Omit<MapProps, 'mapStyle'>) => {
  const map = useRef<MapRef>(null)
  const [visible, setVisible] = useState(false)

  const colorScheme = useColorScheme()
  const showTraffic = useSettingsStore(useShallow(state => state.showTraffic))

  const { data } = useQuery({
    queryKey: [`map-session-creation-${showTraffic}-${'dark'}`],
    queryFn: () =>
      ky.post<{ session: string }>(`https://tile.googleapis.com/v1/createSession`, {
        searchParams: { key: process.env.EXPO_PUBLIC_MAP_API },
        body: JSON.stringify({
          mapType: 'roadmap',
          language: 'en-US',
          region: 'TR',
          layerTypes: showTraffic ? ['layerTraffic'] : [],
          styles: getMapStyle(colorScheme),
        }),
      })
        .json(),
    staleTime: 86_400_000,
  })

  if (!data) {
    return <ActivityIndicator />
  }

  const tiles = [`https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}?session=${data.session}&key=${process.env.EXPO_PUBLIC_MAP_API}`]

  const onFinishLoadingMap = () => setVisible(true)

  return (
    <_Map
      ref={map}
      logo={false}
      attribution={false}
      compass={false}
      androidView="texture"
      onDidFinishLoadingMap={onFinishLoadingMap}
      style={{ opacity: visible ? 1 : 0, flex: 1, ...style }}
      {...props}
      mapStyle={styleJson}
    >
      <RasterSource
        key="raster-source"
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

      {children}
    </_Map>
  )
}
