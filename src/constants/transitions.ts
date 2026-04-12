import { Easing, EntryOrExitLayoutType, LinearTransition, withTiming } from 'react-native-reanimated'

export const DEFAULT_EASING = Easing.bezier(0.4, 0, 0.2, 1)

export const DEFAULT_TIMING_FUNCTION = LinearTransition
  .easing(DEFAULT_EASING)
  .duration(250)

export const ExitingAnimation: EntryOrExitLayoutType = () => {
  'worklet'

  return {
    initialValues: {
      opacity: 1,
      transform: [{ scale: 1 }],
    },
    animations: {
      opacity: withTiming(0, { duration: 200, easing: DEFAULT_EASING }),
      transform: [
        {
          scale: withTiming(0.9, { duration: 200 }),
        },
      ],
    },
  }
}

export const EnteringAnimation: EntryOrExitLayoutType = () => {
  'worklet'

  return {
    initialValues: {
      opacity: 0,
      transform: [{ scale: 0.9 }],
    },
    animations: {
      opacity: withTiming(1, { duration: 200, easing: DEFAULT_EASING }),
      transform: [
        {
          scale: withTiming(1, { duration: 200 }),
        },
      ],
    },
  }
}
