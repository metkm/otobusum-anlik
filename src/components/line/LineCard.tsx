import { Button, ViewProps } from 'react-native'
import Animated from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { UiText } from '../ui/UiText'

import { ExitingAnimation, EnteringAnimation, DEFAULT_TIMING_FUNCTION } from '@/constants/transitions'
import { useLinesStore } from '@/stores/lines'
import { cn } from '@/utils/cn'

export const LineCard = ({ lineCode, className, ...props }: { lineCode: string } & ViewProps) => {
  const _deleteLine = useLinesStore(useShallow(state => state.deleteLine))

  const deleteLine = (code: string) => {
    _deleteLine(code)
  }

  return (
    <Animated.View
      className={cn('bg-default p-2 rounded', className)}
      exiting={ExitingAnimation}
      entering={EnteringAnimation}
      layout={DEFAULT_TIMING_FUNCTION}
      {...props}
    >
      <UiText className="font-semibold">{lineCode}</UiText>
      <Button title="Delete" onPress={() => deleteLine(lineCode)} />
    </Animated.View>
  )
}
