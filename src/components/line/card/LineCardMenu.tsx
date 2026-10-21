import { LegendList, type LegendListRef } from '@legendapp/list/react-native'
import type { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { USheetHeader } from '@/components/u/UHeader'
import { USheet } from '@/components/u/USheet'
import { UText } from '@/components/u/UText'
import { useLine, useLineNews, useMap } from '@/composables'
import { useLineRoutes } from '@/composables/useLineRoutes'
import { useFilterStore, useLineStore, useSettingsStore, useThemeStore } from '@/stores'
import { getLatLngBounds } from '@/utils/bounds'

import { LineModalsColorPicker } from '../modals/ColorPicker'

export const LineCardMenu = () => {
  const { code } = useLine()
  const { news } = useLineNews()
  const { t } = useTranslation()
  const { fitBounds } = useMap()
  const { route } = useLineRoutes()

  const toggleLineHidden = useFilterStore(useShallow((state) => state.toggleLineHidden))
  const isLineHidden = useFilterStore(useShallow((state) => state.hiddenLines.includes(code)))
  const deleteLine = useLineStore(useShallow((state) => state.deleteLine))
  const createTheme = useThemeStore(useShallow((state) => state.createTheme))
  const lineCardExpanded = useSettingsStore(useShallow((state) => state.lineCardExpanded))

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

    fitBounds(getLatLngBounds(route.path))
  }

  return (
    <>
      <UButton
        icon="zoom-in"
        variant="ghost"
        color="neutral"
        onPress={zoomToLine}
      />

      <UButton
        icon={isLineHidden ? 'eye-closed' : 'eye'}
        onPress={() => toggleLineHidden(code)}
        variant="ghost"
        color="neutral"
      />

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
          style={{ flex: 1 }}
          detents={['auto', 1]}
          header={
            <USheetHeader
              title="News"
              icon="newspaper"
            />
          }
        >
          <LegendList
            ref={scrollableRef}
            data={news}
            renderItem={({ item }) => (
              <View className="gap-1 p-2">
                <UText className="text-muted font-inter-medium text-xs">{item.HATKODU}</UText>
                <UText>{item.MESAJ}</UText>
                <UText className="text-muted font-inter-medium text-xs">
                  {item.GUNCELLEME_SAATI}
                </UText>
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
              addToGroup: code,
            },
            pathname: '(sheet)/groups/index',
          }}
        />

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

          <LineModalsColorPicker />
        </View>

        <UButton
          label={t(lineCardExpanded ? 'shrink' : 'expand')}
          icon={lineCardExpanded ? 'shrink' : 'expand'}
          size="lg"
          block
          variant="soft"
          onPress={() => {
            useSettingsStore.setState((state) => {
              state.lineCardExpanded = !state.lineCardExpanded
            })
          }}
        />

        <UButton
          label={t('deleteLine')}
          icon="trash-2"
          onPress={() => deleteLine(code)}
          size="lg"
          block
          variant="soft"
        />
      </USheet>
    </>
  )
}
