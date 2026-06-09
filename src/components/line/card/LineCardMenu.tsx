import { LegendList } from '@legendapp/list/react-native'
import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { USheet } from '@/components/u/USheet'
import { USheetHeader } from '@/components/u/USheetHeader'
import { UText } from '@/components/u/UText'

import { LineModalsColorPicker } from '../modals/ColorPicker'

import { useLine, useLineNews, useMap } from '@/composables'
import { useLineRoutes } from '@/composables/useLineRoutes'
import { useFilterStore, useLineStore, useSettingsStore, useThemeStore } from '@/stores'
import { getLatLngBounds } from '@/utils/bounds'

export const LineCardMenu = () => {
  const { code } = useLine()
  const { news } = useLineNews()
  const { t } = useTranslation()
  const { fitBounds } = useMap()
  const { route } = useLineRoutes()

  const toggleLineHidden = useFilterStore(useShallow(state => state.toggleLineHidden))
  const isLineHidden = useFilterStore(useShallow(state => state.hiddenLines.includes(code)))
  const deleteLine = useLineStore(useShallow(state => state.deleteLine))
  const createTheme = useThemeStore(useShallow(state => state.createTheme))
  const lineCardExpanded = useSettingsStore(useShallow(state => state.lineCardExpanded))

  const menuSheet = useRef<TrueSheet>(null)
  const announcementsSheet = useRef<TrueSheet>(null)

  const presentMenu = () => {
    menuSheet.current?.present()
  }

  const presentAnnouncements = () => {
    announcementsSheet.current?.present()
  }

  const zoomToLine = () => {
    if (!route || !route.path)
      return

    fitBounds(getLatLngBounds(route.path))
  }

  return (
    <>
      <UButton
        icon={isLineHidden ? 'eye-closed' : 'eye'}
        onPress={() => toggleLineHidden(code)}
        variant="ghost"
        color="neutral"
      />

      {news.length > 1 && (
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

      {news.length > 1 && (
        <USheet
          ref={announcementsSheet}
          scrollable
          header={<USheetHeader title="News" icon="newspaper" />}
        >
          <LegendList
            data={news}
            renderItem={({ item }) => {
              return (
                <View className="p-2 gap-1">
                  <UText className="text-muted text-xs font-inter-medium">{item.HATKODU}</UText>
                  <UText>{item.MESAJ}</UText>
                  <UText className="text-muted text-xs font-inter-medium">{item.GUNCELLEME_SAATI}</UText>
                </View>
              )
            }}
            keyExtractor={item => `${item.HATKODU}-${item.GUNCELLEME_SAATI}-${item.MESAJ}`}
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
            pathname: '/groups',
            params: {
              addToGroup: code,
            },
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
          label={t('zoom')}
          icon="zoom-in"
          block
          variant="soft"
          size="lg"
          onPress={zoomToLine}
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
