import { View } from 'react-native'

import { UActivityIndicator } from '@/components/u/UActivityIndicator'
import { UQueryState } from '@/components/u/UQueryState'
import { UText } from '@/components/u/UText'

import { useCountdown, useLine, useLineBuses, useLineTheme } from '@/composables'
import { LINE_UPDATE_INTERVAL } from '@/constants/app'

export const LineCardName = () => {
  const { code } = useLine()
  const { query: lineBusesQuery } = useLineBuses()
  const { remaining } = useCountdown(lineBusesQuery.dataUpdatedAt, LINE_UPDATE_INTERVAL)

  const theme = useLineTheme(code)

  return (
    <View className="flex-row items-center gap-2 shrink grow">
      <UText className="font-medium text-lg">{code}</UText>

      <UQueryState
        query={lineBusesQuery}
        loading={() => <UActivityIndicator color={theme?.['ui-primary']} />}
      >
        <UText className="text-xs text-muted">{`${remaining} sec to update`}</UText>
      </UQueryState>
    </View>
  )
}
