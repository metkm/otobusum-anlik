import Lucide from '@react-native-vector-icons/lucide'
import { View, ViewProps, FlatList } from 'react-native'

import { UText } from '@/components/u/UText'

import { LineCardButtons } from './LineCardButtons'
import { LineCardName } from './LineCardName'
import { LineCardRoutes } from './LineCardRoutes'

import { useLine, useLineBuses, useLineStops, useLineTheme } from '@/composables'
import { cn } from '@/utils/cn'

export const LineCard = ({ className, style, ...props }: ViewProps) => {
  const { code } = useLine()

  const { query: lineBusesQuery } = useLineBuses()
  const { query: lineStopsQuery } = useLineStops()

  const theme = useLineTheme(code)

  return (
    <View
      className={cn('bg-default p-2 rounded-md gap-2', className)}
      style={[{ backgroundColor: theme?.['ui-bg'], elevation: 5 }, style]}
      {...props}
    >
      <View className="flex-row items-center justify-between pl-1">
        <LineCardName />
        <LineCardButtons />
      </View>

      <FlatList
        data={lineStopsQuery.data || []}
        renderItem={({ item, index }) => (
          <View className="flex-row items-center gap-2">
            <UText className="w-6.5 text-center text-sm font-medium">{index}</UText>

            <View
              className="items-center justify-center size-10 rounded-full border-2 border-muted"
              style={{ borderColor: theme?.['ui-primary'] }}
            >
              {lineBusesQuery.data?.find(b => b.closest_stop_code === item.code) && (
                <Lucide
                  name="bus-front"
                  color={theme?.['ui-primary']}
                  size={16}
                />
              )}
            </View>

            <UText className="text-xs truncate shrink" numberOfLines={2}>{item.name}</UText>
          </View>
        )}
        className="max-h-22"
        contentContainerClassName="px-2 gap-2"
        fadingEdgeLength={10}
      />

      <LineCardRoutes />
    </View>
  )
}
