import { LegendList } from '@legendapp/list/react-native'
import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import { router, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { TextInputInstance, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { UButton } from '@/components/u/UButton'
import { UInput } from '@/components/u/UInput'
import { UText } from '@/components/u/UText'
import { useLineGroup } from '@/composables'
import { GROUP_LINE_LIMIT } from '@/constants/app'
import { useLineStore } from '@/stores'

export const GroupIdScreen = () => {
  const navigation = useTrueSheetNavigation()
  const params = useLocalSearchParams()
  const { group, groups } = useLineGroup(params.groupId?.toString())
  const { t } = useTranslation()

  const name = useRef('')
  const inputRef = useRef<TextInputInstance>(null)

  const handleSave = useCallback(() => {
    if (!group) return

    useLineStore.getState().updateGroupName(group.id, name.current)
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
                  if (!group) return

                  useLineStore.getState().deleteGroup(group.id)
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

  return (
    <View className="gap-2 px-2 pt-8">
      <View className="gap-2">
        <UText className="font-inter-medium ml-1">{group?.name}</UText>
        <UInput
          ref={inputRef}
          placeholder={t('newGroupTitlePlaceholder')}
          onChangeText={(text) => {
            name.current = text
          }}
        />
      </View>

      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          <UText className="font-inter-medium ml-1">{t('addedLines')}</UText>
          <UText className="font-inter-medium text-xs">{`(${group?.codes.length} / ${GROUP_LINE_LIMIT})`}</UText>
        </View>

        {group && group.codes.length > 0 && (
          <LegendList
            data={group?.codes}
            renderItem={({ item }) => (
              <GestureHandlerRootView style={{ flexShrink: 0 }}>
                <View className="flex-row items-stretch gap-1">
                  <UButton
                    icon="trash-2"
                    onPress={() => {
                      if (!group) return
                      useLineStore.getState().deleteLine(item, group.id)
                    }}
                    color="neutral"
                    variant="soft"
                  />

                  <UText className="font-inter-medium bg-muted rounded-md px-2 py-1 align-middle">
                    {item}
                  </UText>
                </View>
              </GestureHandlerRootView>
            )}
            contentContainerStyle={{ gap: 8 }}
            keyExtractor={(item) => item}
            recycleItems
          />
        )}
      </View>
    </View>
  )
}

export default GroupIdScreen
