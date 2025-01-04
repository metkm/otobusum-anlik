import { MapView, Camera } from '@rnmapbox/maps'
import { RefObject, ComponentProps } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
// import MapView, { MapViewProps, PROVIDER_GOOGLE } from 'react-native-maps'
import Animated, { clamp, Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

import { useSheetModal } from '@/hooks/contexts/useSheetModal'
import { useTheme } from '@/hooks/useTheme'

import { getMapStyle } from '@/constants/mapStyles'
import { useSettingsStore } from '@/stores/settings'

interface TheMapProps extends ComponentProps<typeof MapView> {
  cRef?: RefObject<MapView>
}

const screen = Dimensions.get('screen')

export const TheMap = ({ style, cRef, ...props }: TheMapProps) => {
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

  const initial = useSettingsStore.getState().initialMapLocation || {
    latitude: 39.66770141070046,
    latitudeDelta: 4.746350767346861,
    longitude: 28.17840663716197,
    longitudeDelta: 2.978521026670929,
  }

  return (
    <Animated.View style={animatedStyle}>
      <MapView
        style={styles.map}
        logoEnabled={false}
        scaleBarEnabled={false}
        attributionEnabled={false}
        styleURL="mapbox://styles/mapbox/dark-v11"
      >
        <Camera
          centerCoordinate={[initial.longitude, initial.latitude]}
        />

        {props.children}
      </MapView>
    </Animated.View>
  )
}
{ /* <MapView
        ref={cRef}
        style={[styles.map, style]}
        provider={PROVIDER_GOOGLE}
        customMapStyle={getMapStyle(mode)}
        mapPadding={{ top: insets.top, bottom: 10, left: 10, right: 10 }}
        showsIndoors={false}
        toolbarEnabled={false}
        showsTraffic={showTraffic}
        showsUserLocation={showMyLocation}
        {...props}
      >
        {props.children}
      </MapView> */ }

const styles = StyleSheet.create({
  map: {
    flexGrow: 1,
    flexShrink: 0,
  },
})
