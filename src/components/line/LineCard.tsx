import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useRef } from 'react'
import { View, ViewProps } from 'react-native'
import Animated from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { UText } from '@/components/u/UText'

import { UButton } from '../u/UButton'
import { USheet } from '../u/USheet'

import { ExitingAnimation, EnteringAnimation, DEFAULT_TIMING_FUNCTION } from '@/constants/transitions'
import { useLineStore } from '@/stores/line'
import { cn } from '@/utils/cn'

export const LineCard = ({ lineCode, className, ...props }: { lineCode: string } & ViewProps) => {
  const deleteLine = useLineStore(useShallow(state => state.deleteLine))
  const sheet = useRef<TrueSheet>(null)

  const presentMenu = () => {
    sheet.current?.present()
  }

  return (
    <Animated.View
      className={cn('bg-default p-2 rounded-md', className)}
      exiting={ExitingAnimation}
      entering={EnteringAnimation}
      layout={DEFAULT_TIMING_FUNCTION}
      {...props}
    >
      <View className="flex-row items-center justify-between pl-2">
        <UText className="font-semibold text-lg">{lineCode}</UText>

        <UButton
          icon="menu"
          onPress={presentMenu}
          variant="ghost"
          color="neutral"
        />

        <USheet
          ref={sheet}
          detents={['auto']}
        >
          <UButton
            label="Add to group"
            color="neutral"
            icon="circle-plus"
            square
          />

          <UButton
            label="Delete line"
            color="neutral"
            icon="trash-2"
            square
            onPress={() => deleteLine(lineCode)}
          />
        </USheet>
      </View>
    </Animated.View>
  )
}
