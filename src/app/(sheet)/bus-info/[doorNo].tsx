import { useLocalSearchParams } from 'expo-router'
import { t } from 'i18next'
import { View } from 'react-native'

import { UActivityIndicator } from '@/components/u/UActivityIndicator'
import { UQueryState } from '@/components/u/UQueryState'
import { UText } from '@/components/u/UText'

import { useLineBusInfo } from '@/composables/useLineBusInfo'

const BusInfo = () => {
  const searchParams = useLocalSearchParams()
  const doorNo = searchParams.doorNo as string

  const { query } = useLineBusInfo(doorNo)

  return (
    <View className="pt-5 px-2 pb-2 gap-2">
      <View>
        <UText className="text-xs font-inter-medium text-muted">{t('doorNo')}</UText>
        <UText>{doorNo}</UText>
      </View>

      <UQueryState query={query} loading={() => <UActivityIndicator />}>
        <View>
          <UText className="text-xs font-inter-medium text-muted">{t('operator')}</UText>
          <UText>{query.data?.operator}</UText>
        </View>

        <View>
          <UText className="text-xs font-inter-medium text-muted">{t('plate')}</UText>
          <UText>{query.data?.plate}</UText>
        </View>

        <View>
          <UText className="text-xs font-inter-medium text-muted">{t('speed')}</UText>
          <UText>{`${query.data?.speed} km/h`}</UText>
        </View>

        {query.data?.garage && (
          <View>
            <UText className="text-xs font-inter-medium text-muted">{t('garage')}</UText>
            <UText>{query.data?.garage}</UText>
          </View>
        )}
      </UQueryState>
    </View>
  )
}

export default BusInfo
