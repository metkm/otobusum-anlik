import { useLocalSearchParams } from 'expo-router'
import { t } from 'i18next'
import { View } from 'react-native'

import { SkeletonBusInfo } from '@/components/u/skeleton/SkeletonBusInfo'
import { type IconName, UIcon } from '@/components/u/UIcon'
import { UQueryState } from '@/components/u/UQueryState'
import { UText } from '@/components/u/UText'
import { useLineBusInfo } from '@/composables/useLineBusInfo'

const BusInfoItem = ({
  label,
  value,
  icon,
}: {
  label: string
  value?: string | number
  icon: IconName
}) => (
  <View className="bg-muted h-14 flex-1 gap-1 rounded-md p-2">
    <View className="flex-row gap-1.5">
      <UIcon name={icon} />
      <UText className="font-inter-medium text-muted">{label}</UText>
    </View>

    <UText className="font-inter-medium">{value}</UText>
  </View>
)

const BusInfo = () => {
  const searchParams = useLocalSearchParams()
  const doorNo = searchParams.doorNo as string

  const { query } = useLineBusInfo(doorNo)

  return (
    <View className="flex-row flex-wrap items-center gap-2 px-2 pt-5 pb-2">
      <BusInfoItem
        label={t('doorNo')}
        value={doorNo}
        icon="door-closed"
      />

      <UQueryState
        query={query}
        fetching={() => [1, 2].map((i) => <SkeletonBusInfo key={i} />)}
      >
        {/* <BusInfoItem
          label={t('operator')}
          value={query.data?.operator}
          icon="circle-user"
        /> */}

        <BusInfoItem
          label={t('plate')}
          value={query.data?.plate}
          icon="bandage"
        />

        <BusInfoItem
          label={t('speed')}
          value={`${query.data?.speed} km/h`}
          icon="gauge"
        />

        {/* {query.data?.garage && (
          <BusInfoItem
            label={t('garage')}
            value={query.data.garage}
            icon="van"
          />
        )} */}
      </UQueryState>
    </View>
  )
}

export default BusInfo
