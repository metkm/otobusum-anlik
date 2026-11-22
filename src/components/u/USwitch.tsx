import Animated from 'react-native-reanimated'
import { useCSSVariable } from 'uniwind'

import { LayoutAnimationTransition } from '@/constants/animation'

export const USwitch = ({ value }: { value: boolean }) => {
  const [primary, background] = useCSSVariable([
    '--color-primary',
    '--background-color-accented',
  ]) as [string, string]

  return (
    <Animated.View
      className="flex w-9 shrink-0 rounded-full p-0.5"
      style={{
        backgroundColor: value ? primary : background,
        transitionDuration: 150,
        transitionProperty: 'backgroundColor',
      }}
    >
      <Animated.View
        data-state={value}
        layout={LayoutAnimationTransition}
        className="bg-muted size-4 rounded-full data-state:self-end"
      />
    </Animated.View>
  )
}
