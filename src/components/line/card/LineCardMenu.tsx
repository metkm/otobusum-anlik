import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { USheet } from '@/components/u/USheet'
import { UText } from '@/components/u/UText'

import { useLine, useLineNews, useLineTheme } from '@/composables'
import { useFilterStore, useLineStore, useThemeStore } from '@/stores'

export const LineCardMenu = () => {
  const { code } = useLine()
  const { news } = useLineNews()
  const { t } = useTranslation()
  const theme = useLineTheme()

  const toggleLineHidden = useFilterStore(useShallow(state => state.toggleLineHidden))
  const isLineHidden = useFilterStore(useShallow(state => state.hiddenLines.includes(code)))
  const deleteLine = useLineStore(useShallow(state => state.deleteLine))
  const createTheme = useThemeStore(useShallow(state => state.createTheme))

  const menuSheet = useRef<TrueSheet>(null)
  const announcementsSheet = useRef<TrueSheet>(null)

  const presentMenu = () => {
    menuSheet.current?.present()
  }

  const presentAnnouncements = () => {
    announcementsSheet.current?.present()
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
        <USheet ref={announcementsSheet} scrollable>
          <FlatList
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
            ItemSeparatorComponent={() => <View className="h-hairline w-full bg-muted" />}
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

        <UButton
          label={t('refreshColors')}
          onPress={() => createTheme(code)}
          size="lg"
          block
          variant="soft"
        >
          <View
            style={theme?.background({ variant: 'solid' })}
            className="size-4 rounded-md"
          />
        </UButton>

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
