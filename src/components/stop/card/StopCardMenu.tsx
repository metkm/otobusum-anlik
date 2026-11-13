import type { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { queryClient } from '@/api/client'
import { UButton, USheet } from '@/components/u'
import { useGroupItem, useMap } from '@/composables'
import { stopQueryOptions } from '@/composables/query/useStop'
import { useFilterStore, useTransitStore } from '@/stores'

export const StopCardMenu = () => {
  const { t } = useTranslation()
  const { code } = useGroupItem()
  const { easeTo } = useMap()
  const menuSheet = useRef<TrueSheet>(null)

  const zoom = async () => {
    const { city } = useFilterStore.getState()
    const data = await queryClient.query(stopQueryOptions(code, city))

    easeTo({ lat: data.stop.lat, lng: data.stop.lng })
  }

  return (
    <View className="flex-row items-center">
      <UButton
        icon="zoom-in"
        onPress={zoom}
        variant="ghost"
        color="neutral"
      />

      <UButton
        icon="menu"
        onPress={() => menuSheet.current?.present()}
        variant="ghost"
        color="neutral"
      />

      <USheet
        ref={menuSheet}
        detents={['auto']}
        contentContainerClassName="px-2 gap-2"
      >
        <UButton
          label={t('addToGroup')}
          icon="circle-plus"
          size="lg"
          block
          variant="soft"
          to={{
            params: {
              code,
              type: 'stop',
            },
            pathname: '(sheet)/groups/index',
          }}
        />

        <UButton
          label={t('stopDetails')}
          icon="arrow-up-right"
          variant="soft"
          block
          size="lg"
          to={{
            params: {
              stopCode: code,
            },
            pathname: '(sheet)/stop/[stopCode]',
          }}
        />

        <UButton
          label={t('deleteLine')}
          icon="trash-2"
          onPress={() => useTransitStore.getState().removeItemFromGroup(code)}
          size="lg"
          block
          variant="soft"
        />
      </USheet>
    </View>
  )
}
