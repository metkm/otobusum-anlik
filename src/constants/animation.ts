import { Keyframe } from 'react-native-reanimated'

export const ExitScaleOut = new Keyframe({
  0: {
    transform: [{ scale: 1 }],
    opacity: 1,
  },
  100: {
    transform: [{ scale: 0.8 }],
    opacity: 0,
  },
}).duration(150)
