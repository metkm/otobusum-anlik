import { View } from 'react-native'

import { useGroupItem } from '@/composables'
import { useStop } from '@/composables/query'

import { UBadge, UQueryState, UText } from '../u'
import { StopCardArrivals } from './StopCardArrivals'

export const StopCard = () => {
  const { code } = useGroupItem()
  const { query } = useStop(code)

  return (
    <View className="border-hairline border-muted bg-default overflow-hidden rounded-md">
      <UQueryState query={query}>
        <View className="border-hairline border-muted flex-row items-center gap-2 border-b p-2">
          <UBadge
            label={query.data?.stop.code.toString()}
            variant="soft"
            size="lg"
            className="rounded-sm"
            icon="map-pin"
          />

          <View>
            <UText className="font-inter-medium leading-tight">{query.data?.stop.name}</UText>
            <UText className="font-inter-medium text-muted text-sm leading-tight">
              {query.data?.stop.province}
            </UText>
          </View>
        </View>
      </UQueryState>

      <StopCardArrivals />
    </View>
  )
}
