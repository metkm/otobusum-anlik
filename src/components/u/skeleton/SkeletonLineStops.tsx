import { View } from 'react-native'

import { COLLAPSED_STOPS_HEIGHT } from '@/constants/linecard'

import { SkeletonPulse } from './SkeletonPulse'

export const SkeletonLineStops = () => (
  <View
    className="overflow-hidden px-2 py-1.5"
    style={{ height: COLLAPSED_STOPS_HEIGHT }}
  >
    {[1, 2, 3].map((i) => (
      <View
        key={i}
        className="flex-row items-center gap-2 p-2.5"
      >
        <SkeletonPulse className="h-4 w-6.5" />
        <SkeletonPulse className="size-7 rounded-full border-2 border-black/50 bg-transparent" />
        <SkeletonPulse className="h-4 grow" />
      </View>
    ))}
  </View>
)
