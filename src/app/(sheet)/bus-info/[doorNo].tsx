import { useLocalSearchParams } from 'expo-router'
import { t } from 'i18next'
import { ComponentProps } from 'react'
import { View } from 'react-native'

import { UActivityIndicator } from '@/components/u/UActivityIndicator'
import { UIcon } from '@/components/u/UIcon'
import { UQueryState } from '@/components/u/UQueryState'
import { UText } from '@/components/u/UText'

import { useLineBusInfo } from '@/composables/useLineBusInfo'

const BusInfoItem = ({ label, value, icon }: { label: string, value?: string | number, icon: ComponentProps<typeof UIcon>['name'] }) => {
  return (
    <View className="gap-1">
      <View className="flex-row gap-1">
        <UIcon
          name={icon}
          colorClassName="text-default"
        />

        <UText className="text-xs font-inter-medium text-muted">{label}</UText>
      </View>

      <UText>{value}</UText>
    </View>
  )
}

const BusInfo = () => {
  const searchParams = useLocalSearchParams()
  const doorNo = searchParams.doorNo as string

  const { query } = useLineBusInfo(doorNo)

  return (
    <View className="pt-5 px-2 pb-2 gap-2">
      <BusInfoItem
        label={t('doorNo')}
        value={doorNo}
        icon="door-closed"
      />

      <UQueryState query={query} loading={() => <UActivityIndicator />}>
        <BusInfoItem
          label={t('operator')}
          value={query.data?.operator}
          icon="circle-user"
        />

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

        {query.data?.garage && (
          <BusInfoItem
            label={t('garage')}
            value={query.data?.garage}
            icon="van"
          />
        )}
      </UQueryState>
    </View>
  )
}

export default BusInfo
