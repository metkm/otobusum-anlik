import { router } from 'expo-router'
import { useLocalSearchParams } from 'expo-router/build/hooks'
import { useRef } from 'react'
import { View } from 'react-native'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { UInput } from '@/components/u/UInput'
import { UText } from '@/components/u/UText'

import { useFilterStore, useLineStore } from '@/stores'
import { i18n } from '@/translations/i18n'

export const GroupIdScreen = () => {
  const params = useLocalSearchParams()
  const name = useRef('')

  const city = useFilterStore(useShallow(state => state.city))
  const groups = useLineStore(useShallow(state => state.lines[city]))

  const group = groups.find(gr => gr.id === params.groupId)

  return (
    <View className="px-2 pt-5 gap-2 pb-2 grow">
      <View className="gap-1">
        <UText className="ml-2">{group?.name}</UText>
        <UInput
          placeholder={i18n.t('newGroupTitlePlaceholder')}
          onChangeText={(text) => {
            name.current = text
          }}
        />
      </View>

      <GestureHandlerRootView style={{ flexGrow: 1, gap: 8 }}>
        <FlatList
          data={group?.codes}
          renderItem={({ item }) => (
            <View className="flex-row items-center gap-1">
              <UButton
                icon="trash-2"
                onPress={() => {
                  if (!group)
                    return
                  useLineStore.getState().deleteLine(item, group.id)
                }}
                variant="ghost"
                color="neutral"
              />
              <UText className="px-2 py-1 font-medium">{item}</UText>
            </View>
          )}
          contentContainerClassName="gap-2"
        />

        <UButton
          label={i18n.t('save')}
          size="lg"
          block
          icon="save"
          variant="soft"
          onPress={() => {
            if (!group)
              return

            useLineStore.getState().updateGroupName(group.id, name.current)
          }}
        />

        {groups.length > 1 && (
          <UButton
            label={i18n.t('deleteGroup')}
            icon="trash-2"
            onPress={() => {
              if (!group)
                return

              useLineStore.getState().deleteGroup(group.id)
              router.back()
            }}
            size="lg"
            block
            variant="soft"
          />
        )}
      </GestureHandlerRootView>
    </View>
  )
}

export default GroupIdScreen
