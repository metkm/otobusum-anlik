import { useEffect } from 'react'
import Animated, {
  LinearTransition,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useCSSVariable } from 'uniwind'

export const USwitch = ({ value }: { value: boolean }) => {
  const progress = useSharedValue(value ? 1 : 0)

  const [primary, background] = useCSSVariable(['--ui-primary', '--ui-bg-accented']) as [
    string,
    string,
  ]

  useEffect(() => {
    progress.set(withTiming(value ? 1 : 0, { duration: 100 }))
  }, [value, progress])

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], [0, 16]),
      },
    ],
  }))

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [background, primary]),
  }))

  return (
    <Animated.View
      className="bg-accented flex w-9 shrink-0 rounded-full p-0.5"
      style={containerStyle}
    >
      <Animated.View
        layout={LinearTransition}
        className="bg-muted size-4 rounded-full"
        style={thumbStyle}
      />
    </Animated.View>
  )
}
