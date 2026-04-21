import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useRef } from 'react'
import { View, ViewProps } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UText } from '@/components/u/UText'

import { UActivityIndicator } from '../u/UActivityIndicator'
import { UButton } from '../u/UButton'
import { USheet } from '../u/USheet'

import { useCountdown } from '@/composables/useCountdown'
import { useLine } from '@/composables/useLine'
import { useLineBuses } from '@/composables/useLineBuses'
import { useLineRoute } from '@/composables/useLineRoutes'
import { useLineTheme } from '@/composables/useLineTheme'
import { LINE_UPDATE_INTERVAL } from '@/constants/app'
import { useFilterStore } from '@/stores/filter'
import { useLineStore } from '@/stores/line'
import { cn } from '@/utils/cn'

export const LineCard = ({ className, style, ...props }: ViewProps) => {
  const deleteLine = useLineStore(useShallow(state => state.deleteLine))
  const toggleLineHidden = useFilterStore(useShallow(state => state.toggleLineHidden))

  const { code } = useLine()
  const { query: { dataUpdatedAt, error, isFetching } } = useLineBuses()
  const { remaining } = useCountdown(dataUpdatedAt, LINE_UPDATE_INTERVAL)
  const { route, routeCode } = useLineRoute()
  const theme = useLineTheme(code)

  const sheet = useRef<TrueSheet>(null)

  const presentMenu = () => {
    sheet.current?.present()
  }

  return (
    <View
      className={cn('bg-default p-2 rounded-md gap-2', className)}
      style={[{ backgroundColor: theme?.['ui-bg'] }, style]}
      {...props}
    >
      <View className="flex-row items-center justify-between pl-2">
        <View className="flex-row items-center gap-2 shrink">
          <UText className="font-semibold text-lg">{code}</UText>

          {
            !isFetching
              ? <UActivityIndicator color={theme?.['ui-primary']} />
              : error
                ? <UText className="text-error truncate shrink" numberOfLines={1}>{error.message}</UText>
                : <UText className="text-xs text-muted">{`${remaining} sec to update`}</UText>
          }
        </View>

        <View className="flex-row gap-2">
          <UButton
            icon="eye"
            onPress={() => toggleLineHidden(code)}
            variant="ghost"
            color="neutral"
            square
          />

          <UButton
            icon="menu"
            onPress={presentMenu}
            variant="ghost"
            color="neutral"
            square
          />
        </View>

        <USheet
          ref={sheet}
          detents={['auto']}
          backgroundColor={theme?.['ui-bg']}
        >
          <UButton
            label="Add to group"
            color="neutral"
            icon="circle-plus"
            square
            style={{ backgroundColor: theme?.['ui-bg-muted'] }}
            size="lg"
            block
          />

          <UButton
            label="Delete line"
            color="neutral"
            icon="trash-2"
            square
            onPress={() => deleteLine(code)}
            style={{ backgroundColor: theme?.['ui-bg-muted'] }}
            size="lg"
            block
          />
        </USheet>
      </View>

      <UButton
        label={route?.name || routeCode}
        variant="soft"
        color="neutral"
      />
    </View>
  )
}
