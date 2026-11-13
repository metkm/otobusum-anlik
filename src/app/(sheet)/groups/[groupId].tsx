import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import { router, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, type TextInputInstance } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Sortable from 'react-native-sortables'

import { ThemeProvider } from '@/components/provider/ThemeProvider'
import { UButton, UEmpty, UIcon, UInput, UText } from '@/components/u'
import { useLineGroup } from '@/composables'
import { useTransitStore } from '@/stores'

export const GroupIdScreen = () => {
  const navigation = useTrueSheetNavigation()
  const { groupId } = useLocalSearchParams<{ groupId: string }>()
  const { group, groups } = useLineGroup(groupId)
  const { t } = useTranslation()
  const [isSorting, setIsSorting] = useState(false)

  const name = useRef('')
  const inputRef = useRef<TextInputInstance>(null)

  const handleSave = useCallback(() => {
    if (!group) {
      return
    }

    useTransitStore.getState().updateGroupName(group.id, name.current)
    inputRef.current?.clear()
  }, [group])

  useEffect(() => {
    navigation.setOptions({
      footer: (
        <GestureHandlerRootView style={{ flexShrink: 0 }}>
          <View className="gap-2 px-2">
            <UButton
              label={t('save')}
              size="lg"
              icon="save"
              onPress={handleSave}
              variant="soft"
              block
            />

            {groups.length > 1 && (
              <UButton
                label={t('deleteGroup')}
                icon="trash-2"
                onPress={() => {
                  if (!group) {
                    return
                  }

                  useTransitStore.getState().deleteGroup(group.id)
                  router.back()
                }}
                size="lg"
                variant="soft"
                block
              />
            )}
          </View>
        </GestureHandlerRootView>
      ),
    })
  }, [group, groups.length, handleSave, navigation, t])

  useEffect(() => {
    navigation.setOptions({
      dismissible: !isSorting,
      draggable: !isSorting,
    })
  }, [isSorting, navigation])

  return (
    <View className="gap-8 px-2 pt-8 pb-8">
      <View className="gap-2">
        <UText className="font-inter-medium ml-1">{t('groupName', { name: group?.name })}</UText>
        <UInput
          ref={inputRef}
          placeholder={t('newGroupTitlePlaceholder')}
          onChangeText={(text) => {
            name.current = text
          }}
        />
      </View>

      <View>
        <View className="mb-1 ml-1">
          <UText className="font-inter-medium">{t('groupItemList')}</UText>
          <UText className="font-inter-medium text-muted text-sm">
            {t('groupItemListDescription')}
          </UText>
        </View>
        {group && group.items.length > 0 ? (
          <GestureHandlerRootView style={{ flexShrink: 0 }}>
            <Sortable.Grid
              data={group.items}
              onDragStart={() => setIsSorting(true)}
              onDragEnd={({ data }) => {
                setIsSorting(false)
                useTransitStore.getState().setGroupItems(data, groupId)
              }}
              renderItem={({ item }) => (
                <ThemeProvider value={item.code}>
                  <View className="flex-row items-center justify-between gap-2 p-2">
                    <View className="flex-row items-center gap-2">
                      <UIcon
                        name="menu"
                        sizeClassName="size-4"
                        colorClassName="accent-muted"
                      />

                      <View className="flex-row items-center gap-2">
                        <UIcon name={item.type === 'line' ? 'bus-front' : 'map-pin'} />
                        <UText className="font-inter-medium text-sm">{item.code}</UText>
                      </View>
                    </View>

                    <UButton
                      icon="trash-2"
                      variant="soft"
                      onPress={() => {
                        useTransitStore.getState().removeItemFromGroup(item.code, group.id)
                      }}
                    />
                  </View>
                </ThemeProvider>
              )}
              keyExtractor={(item) => item.code}
              strategy="swap"
              columnGap={8}
              rowGap={8}
            />
          </GestureHandlerRootView>
        ) : (
          <UEmpty
            title={t('emptyGroup')}
            icon="bus-front"
          >
            <GestureHandlerRootView style={{ flexShrink: 0 }}>
              <UButton
                label={t('goToSearch')}
                icon="search"
                variant="soft"
                color="neutral"
                to={{ pathname: '/search' }}
              />
            </GestureHandlerRootView>
          </UEmpty>
        )}
      </View>
    </View>
  )
}

export default GroupIdScreen
