import { ViewProps } from 'react-native'
import Animated from 'react-native-reanimated'

import { UText } from '@/components/u/UText'

import { ExitingAnimation, EnteringAnimation, DEFAULT_TIMING_FUNCTION } from '@/constants/transitions'
import { cn } from '@/utils/cn'

export const LineCard = ({ lineCode, className, ...props }: { lineCode: string } & ViewProps) => {
  // const deleteLine = useLinesStore(useShallow(state => state.deleteLine))

  return (
    <Animated.View
      className={cn('bg-default p-2 rounded-md', className)}
      exiting={ExitingAnimation}
      entering={EnteringAnimation}
      layout={DEFAULT_TIMING_FUNCTION}
      {...props}
    >
      <UText className="font-semibold">{lineCode}</UText>
      {/* <Button title="Delete" onPress={() => deleteLine(lineCode)} /> */}
    </Animated.View>
  )
}
