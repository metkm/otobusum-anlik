import { useEffect } from 'react'
import Animated, { interpolate, interpolateColor, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useCSSVariable } from 'uniwind'

export const USwitch = ({ value }: { value: boolean }) => {
  const progress = useSharedValue(value ? 1 : 0)

  const [primary, background] = useCSSVariable(['--ui-primary', '--ui-bg-accented']) as [string, string]

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 100 })
  }, [value, progress])

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: interpolate(
        progress.value,
        [0, 1],
        [0, 16],
      ),
    }],
  }), [])

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [background, primary],
    ),
  }))

  return (
    <Animated.View
      className="flex bg-accented p-0.5 w-9 shrink-0 rounded-full"
      style={containerStyle}
    >
      <Animated.View
        layout={LinearTransition}
        className="size-4 bg-muted rounded-full"
        style={thumbStyle}
      />
    </Animated.View>
  )
}
