// import { MapView, Camera, UserLocation } from '@rnmapbox/maps'
import { MapView, Camera, UserLocation, CameraRef } from '@maplibre/maplibre-react-native'
// import { CameraRef } from '@rnmapbox/maps/lib/typescript/src/components/Camera'
import { RefObject, ComponentProps } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import Animated, { clamp, Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { useSheetModal } from '@/hooks/contexts/useSheetModal'
import { useTheme } from '@/hooks/useTheme'

import { useSettingsStore } from '@/stores/settings'

interface TheMapProps extends ComponentProps<typeof MapView> {
  cameraRef?: RefObject<CameraRef>
}

const screen = Dimensions.get('screen')

export const mapStyle = JSON.stringify({
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap Contributors',
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
    },
  ],
})

export const TheMap = ({ style, cameraRef, ...props }: TheMapProps) => {
  const { mode } = useTheme()
  const sheetContext = useSheetModal()

  const showMyLocation = useSettingsStore(useShallow(state => state.showMyLocation))
  // const showTraffic = useSettingsStore(useShallow(state => state.showTraffic))

  const animatedStyle = useAnimatedStyle(() => {
    let heightFrombottom = screen.height - ((sheetContext?.height.value || 0) + 49) - 49
    heightFrombottom = clamp(heightFrombottom / 2, 0, screen.height)

    if (!sheetContext) {
      return {
        flex: 1,
      }
    }

    return {
      flex: 1,
      transform: [
        {
          translateY: interpolate(
            sheetContext?.index.value!,
            [-1, 0],
            [0, -heightFrombottom],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }
  }, [])

  const state = useSettingsStore.getState().mapState
  const initial = state?.properties.center || [
    28.17840663716197,
    39.66770141070046,
  ]

  return (
    <Animated.View style={animatedStyle}>
      <MapView
        style={styles.map}
        // logoEnabled={false}
        // scaleBarEnabled={false}
        // attributionEnabled={false}
        // styleURL={`mapbox://styles/mapbox/${mode}-v11`}

        logoEnabled={false}
        styleJSON={mapStyle}
        // styleURL="https://demotiles.maplibre.org/style.json"
        {...props}
      >
        <Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: initial,
            zoomLevel: state?.properties.zoom,
          }}
        />

        {showMyLocation && <UserLocation visible={true} />}

        {props.children}
      </MapView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  map: {
    flexGrow: 1,
    flexShrink: 0,
  },
  busStop: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
