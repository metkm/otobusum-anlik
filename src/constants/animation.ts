import { Easing, Keyframe, LinearTransition } from 'react-native-reanimated'

export const ExitScaleOut = new Keyframe({
  0: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  100: {
    opacity: 0,
    transform: [{ scale: 0.8 }],
  },
}).duration(150)

export const EnterScaleIn = new Keyframe({
  0: {
    opacity: 0,
    transform: [{ scale: 0.8 }],
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
}).duration(150)

export const ItemLayoutAnimation = LinearTransition.easing(Easing.bezier(0.4, 0, 0.2, 1)).duration(
  150,
)
