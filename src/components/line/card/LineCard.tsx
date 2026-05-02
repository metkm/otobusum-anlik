import { View, ViewProps } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { SkeletonLineStops } from '@/components/u/skeleton/SkeletonLineStops'
import { UIcon } from '@/components/u/UIcon'
import { UQueryState } from '@/components/u/UQueryState'
import { UText } from '@/components/u/UText'

import { LineCardMenu } from './LineCardMenu'
import { LineCardName } from './LineCardName'
import { LineCardRoutes } from './LineCardRoutes'

import { useLineBuses, useLineStops, useLineTheme } from '@/composables'
import { cn } from '@/utils/cn'

const ErrorState = ({ message }: { message?: string }) => {
  return (
    <View className="h-22 items-center justify-center">
      <UText className="text-error font-inter-medium text-xs">
        {message}
      </UText>
    </View>
  )
}

export const LineCard = ({ className, style, ...props }: ViewProps) => {
  const { buses } = useLineBuses()
  const { query: lineStopsQuery } = useLineStops()
  const theme = useLineTheme()

  const background = theme?.backgroundWithColor({ variant: 'ghost' })
  const border = theme?.border({ variant: 'solid' })

  return (
    <View
      className={cn('bg-muted p-2 rounded-md gap-2', className)}
      style={[{ elevation: 2 }, background, style]}
      {...props}
    >
      <View className="flex-row items-center justify-between pl-1">
        <LineCardName />
        <LineCardMenu />
      </View>

      <UQueryState
        query={lineStopsQuery}
        loading={() => <SkeletonLineStops />}
        error={error => <ErrorState message={error.message} />}
      >
        <FlatList
          data={lineStopsQuery.data || []}
          renderItem={({ item, index }) => (
            <View className="flex-row items-center gap-2">
              <UText className="w-6.5 text-center font-inter-medium">{index + 1}</UText>

              <View
                className="items-center justify-center size-9 rounded-full border-2 border-muted"
                style={border}
              >
                {buses.find(b => b.closest_stop_code === item.code) && (
                  <UIcon
                    name="bus-front"
                    color={background?.color}
                    size={16}
                  />
                )}
              </View>

              <UText className="text-xs truncate shrink" numberOfLines={2}>{item.name}</UText>
            </View>
          )}
          className="max-h-22"
          contentContainerClassName="px-2 gap-2"
          initialNumToRender={2}
          maxToRenderPerBatch={3}
          removeClippedSubviews
          fadingEdgeLength={10}
          windowSize={2}
        />
      </UQueryState>

      <LineCardRoutes />
    </View>
  )
}
