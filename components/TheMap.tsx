import Ionicons from '@react-native-vector-icons/ionicons'
import { MapView, Camera, Images, Image, UserLocation } from '@rnmapbox/maps'
import { CameraRef } from '@rnmapbox/maps/lib/typescript/src/components/Camera'
import { RefObject, ComponentProps } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
// import MapView, { MapViewProps, PROVIDER_GOOGLE } from 'react-native-maps'
import Animated, { clamp, Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

import { useSheetModal } from '@/hooks/contexts/useSheetModal'
import { useTheme } from '@/hooks/useTheme'

import { getMapStyle } from '@/constants/mapStyles'
import { useSettingsStore } from '@/stores/settings'

interface TheMapProps extends ComponentProps<typeof MapView> {
  cameraRef?: RefObject<CameraRef>
}

const screen = Dimensions.get('screen')

export const TheMap = ({ style, cameraRef, ...props }: TheMapProps) => {
  const { mode } = useTheme()
  const sheetContext = useSheetModal()

  const insets = useSafeAreaInsets()
  const showMyLocation = useSettingsStore(useShallow(state => state.showMyLocation))
  const showTraffic = useSettingsStore(useShallow(state => state.showTraffic))

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
        logoEnabled={false}
        scaleBarEnabled={false}
        attributionEnabled={false}
        styleURL="mapbox://styles/mapbox/dark-v11"
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
})
