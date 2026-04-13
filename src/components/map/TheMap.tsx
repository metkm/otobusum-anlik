import { Camera, Layer, Map, RasterSource, type MapRef } from '@maplibre/maplibre-react-native'
import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import React, { RefObject, useRef, useState } from 'react'
import { ActivityIndicator, useColorScheme } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useSettingsStore } from '../../stores/settings'

import { getMapStyle } from '@/constants/mapStyles'

export interface TheMapProps {
  children?: React.ReactNode
  onMapReady?: () => void
  ref?: RefObject<MapRef | null>
}

export const TheMap = ({ children }: { children: React.ReactNode }) => {
  const map = useRef<MapRef>(null)
  const [visible, setVisible] = useState(false)

  const colorScheme = useColorScheme()
  const showTraffic = useSettingsStore(useShallow(state => state.showTraffic))
  const initialMapBounds = useSettingsStore(useShallow(state => state.initialMapBounds))

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
    staleTime: 60_000_000,
  })

  if (!data) {
    return <ActivityIndicator />
  }

  const tiles = [`https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}?session=${data.session}&key=${process.env.EXPO_PUBLIC_MAP_API}`]

  return (
    <Map
      ref={map}
      mapStyle="https://demotiles.maplibre.org/style.json"
      logo={false}
      attribution={false}
      compass={false}
      androidView="texture"
      onDidFinishLoadingMap={() => {
        setVisible(true)
      }}
      onRegionDidChange={async () => {
        const bounds = await map.current?.getBounds()

        useSettingsStore.setState(() => ({
          initialMapBounds: bounds,
        }))
      }}
      style={{
        opacity: visible ? 1 : 0,
        flex: 1,
      }}
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

      {initialMapBounds && <Camera initialViewState={{ bounds: initialMapBounds }} />}

      {children}
    </Map>
  )
}
