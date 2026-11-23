import { LegendList, type LegendListRef } from '@legendapp/list/react-native'
import type { TrueSheet } from '@lodev09/react-native-true-sheet'
import { Link } from 'expo-router'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UButton, USheet, UText, UBadge } from '@/components/u'
import { useMap, useGroupItem } from '@/composables'
import { useLineRoutes, useLineNews } from '@/composables/query'
import { useFilterStore, useSettingsStore, useThemeStore, useTransitStore } from '@/stores'
import { getLatLngBounds } from '@/utils/bounds'

import { LineColorPicker } from '../LineColorPicker'

export const LineCardMenu = () => {
  const { code } = useGroupItem()
  const { news } = useLineNews()
  const { t } = useTranslation()
  const { fitBounds } = useMap()
  const { route } = useLineRoutes()

  const toggleLineHidden = useFilterStore(useShallow((state) => state.toggleLineHidden))
  const isLineHidden = useFilterStore(useShallow((state) => state.hiddenLines.includes(code)))
  const createTheme = useThemeStore(useShallow((state) => state.createTheme))
  const cardExpanded = useSettingsStore(useShallow((state) => state.cardExpanded))
  const hideMap = useSettingsStore(useShallow((state) => state.hideMap))

  const menuSheet = useRef<TrueSheet>(null)
  const announcementsSheet = useRef<TrueSheet>(null)
  const scrollableRef = useRef<LegendListRef>(null)

  const presentMenu = () => {
    void menuSheet.current?.present()
  }

  const presentAnnouncements = () => {
    void announcementsSheet.current?.present()
  }

  const zoomToLine = () => {
    if (!route?.path) {
      return
    }

    const bounds = getLatLngBounds(route.path)
    if (bounds) {
      fitBounds(bounds)
    }
  }

  return (
    <>
      {!hideMap && (
        <>
          <UButton
            icon="zoom-in"
            variant="ghost"
            color="neutral"
            onPress={zoomToLine}
            disabled={!route?.path || route.path.length < 1}
          />

          <UButton
            icon={isLineHidden ? 'eye-closed' : 'eye'}
            onPress={() => toggleLineHidden(code)}
            variant="ghost"
            color="neutral"
          />
        </>
      )}

      {news.length > 0 && (
        <UButton
          icon="newspaper"
          onPress={presentAnnouncements}
          variant="ghost"
          color="neutral"
        />
      )}

      <UButton
        icon="menu"
        onPress={presentMenu}
        variant="ghost"
        color="neutral"
      />

      {news.length > 0 && (
        <USheet
          ref={announcementsSheet}
          scrollableRef={scrollableRef}
          detents={['auto']}
        >
          <UBadge
            label={t('news')}
            icon="newspaper"
            variant="ghost"
            color="neutral"
            className="mr-auto mb-2 ml-2"
          />

          <LegendList
            ref={scrollableRef}
            data={news}
            renderItem={({ item }) => (
              <View className="flex-col gap-2 p-2">
                <View className="flex-row items-center gap-2">
                  <UBadge
                    label={item.HATKODU}
                    className="self-start"
                    variant="soft"
                  />

                  <UText className="text-muted font-inter-medium text-sm">
                    {item.GUNCELLEME_SAATI}
                  </UText>
                </View>

                <UText>{item.MESAJ}</UText>
              </View>
            )}
            keyExtractor={(item) => `${item.HATKODU}-${item.GUNCELLEME_SAATI}-${item.MESAJ}`}
            className="flex-1"
            recycleItems
          />
        </USheet>
      )}

      <USheet
        ref={menuSheet}
        detents={['auto']}
        contentContainerClassName="gap-2 px-2"
      >
        <Link
          href={{
            params: {
              code,
              type: 'line',
            },
            pathname: '/(sheet)/groups',
          }}
          asChild
        >
          <UButton
            label={t('addToGroup')}
            icon="circle-plus"
            size="lg"
            block
            variant="soft"
          />
        </Link>

        <View className="flex-row gap-2">
          <UButton
            label={t('refreshColors')}
            onPress={() => createTheme(code, true)}
            icon="palette"
            size="lg"
            block
            variant="soft"
            className="grow"
          />

          <LineColorPicker />
        </View>

        <UButton
          label={t(cardExpanded ? 'shrink' : 'expand')}
          icon={cardExpanded ? 'shrink' : 'expand'}
          size="lg"
          block
          variant="soft"
          onPress={() => {
            useSettingsStore.setState((state) => {
              state.cardExpanded = !state.cardExpanded
            })
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
    </>
  )
}
