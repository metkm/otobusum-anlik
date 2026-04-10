import {
  Camera,
  RasterSource,
  Map,
  UserLocation,
  Layer,
  type InitialViewState,
  type MapRef,
} from '@maplibre/maplibre-react-native'
import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { RefObject, useRef, useState } from 'react'
import { Dimensions } from 'react-native'
// import MapView, { LatLng, PROVIDER_GOOGLE, Region } from 'react-native-maps'
// import Animated, { clamp, Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated'
// import { useShallow } from 'zustand/react/shallow'
// import { useSheetModal } from '@/hooks/contexts/useSheetModal'
// import { useTheme } from '@/hooks/useTheme'
// import { getMapStyle } from '@/constants/mapStyles'
import { useShallow } from 'zustand/react/shallow'

import { useTheme } from '@/hooks/useTheme'

import { UiActivityIndicator } from '../ui/UiActivityIndicator'

import { getMapStyle } from '@/constants/mapStyles'
import { useSettingsStore } from '@/stores/settings'

export interface TheMapProps {
  children?: React.ReactNode
  onMapReady?: () => void
  // onMapRegionUpdate?: (region: Region) => void
  initialViewState?: InitialViewState
  ref?: RefObject<TheMapRef | null>
}

export interface TheMapRef {
  // animateCamera: (region: Region) => void
  // moveTo: (latlng: LatLng) => void
  // fitInsideCoordinates: (coordinates: LatLng[]) => void
}

const screen = Dimensions.get('screen')

export const TheMap = ({ ref, onMapReady, initialViewState, ...props }: TheMapProps) => {
  const map = useRef<MapRef>(null)

  const [loading, setLoading] = useState(false)
  const { colorScheme } = useTheme()

  const showTraffic = useSettingsStore(useShallow(state => state.showTraffic))
  const showMyLocation = useSettingsStore(useShallow(state => state.showMyLocation))

  const { data } = useQuery({
    queryKey: [`map-session-creation-${showTraffic}-${colorScheme}`],
    queryFn: () =>
      ky
        .post<{ session: string }>(`https://tile.googleapis.com/v1/createSession`, {
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
    return <UiActivityIndicator />
  }

  // const { colorScheme } = useTheme()
  // const insets = useSafeAreaInsets()
  // const sheetContext = useSheetModal()

  // useImperativeHandle(ref, () => {
  //   return {
  //     animateCamera: (region) => {
  //       let re = { ...region }

  //       map.current?.animateToRegion(re)
  //     },
  //     moveTo: (latlng) => {
  //       map.current?.animateCamera({
  //         center: latlng,
  //       })
  //     },
  //     fitInsideCoordinates: (coordinates) => {
  //       map.current?.fitToCoordinates(coordinates, {
  //         edgePadding: {
  //           bottom: 250,
  //           top: 0,
  //           left: 0,
  //           right: 0,
  //         },
  //       })
  //     },
  //   }
  // })

  // const animatedStyle = useAnimatedStyle(() => {
  //   let heightFrombottom = screen.height - ((sheetContext?.height.value || 0) + 49) - 49
  //   heightFrombottom = clamp(heightFrombottom / 2, 0, screen.height)

  //   if (!sheetContext) {
  //     return {
  //       flex: 1,
  //     }
  //   }

  //   return {
  //     flex: 1,
  //     transform: [
  //       {
  //         translateY: interpolate(
  //           sheetContext?.index.value!,
  //           [-1, 0],
  //           [0, -heightFrombottom],
  //           Extrapolation.CLAMP,
  //         ),
  //       },
  //     ],
  //   }
  // }, [])

  return (
    <Map
      ref={map}
      style={{ flex: 1, opacity: loading ? 1 : 0 }}
      mapStyle="https://demotiles.maplibre.org/style.json"
      onDidFinishRenderingFrameFully={() => setLoading(true)}
      onRegionDidChange={async () => {
        const bounds = await map.current?.getBounds()

        useSettingsStore.setState(() => ({
          initialMapBounds: bounds,
        }))
      }}
      logo={false}
      attribution={false}
      compass={false}
    >
      <RasterSource
        key={data?.session || 'raster-source'}
        id="google-raster-source"
        tiles={[
          `https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}?session=${data.session}&key=${process.env.EXPO_PUBLIC_MAP_API}`,
        ]}
        tileSize={256}
      >
        <Layer type="raster" id="google-raster-layer" layerIndex={8} />
      </RasterSource>

      <Camera initialViewState={initialViewState} />

      {showMyLocation && <UserLocation />}
      {props.children}
    </Map>

  // <Animated.View style={animatedStyle}>
  //   <MapView
  //     ref={map}
  //     provider={PROVIDER_GOOGLE}
  //     onMapReady={onMapReady}
  //     onRegionChangeComplete={onMapRegionUpdate}
  //     toolbarEnabled={false}
  //     showsIndoors={false}
  //     mapPadding={{ top: insets.top, bottom: 10, left: 10, right: 10 }}
  //     initialRegion={initialRegion}
  //     customMapStyle={getMapStyle(colorScheme)}
  //     showsUserLocation={showMyLocation}
  //     showsTraffic={showTraffic}
  //     style={{ flex: 1 }}
  //     moveOnMarkerPress={false}
  //     showsBuildings={false}
  //   >
  //     {props.children}
  //   </MapView>
  // </Animated.View>
  )
}
