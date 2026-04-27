import { useRef } from 'react'
import { Alert, View } from 'react-native'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { UIcon } from '@/components/u/UIcon'
import { UText } from '@/components/u/UText'

import { ExitScaleOut } from '@/constants/animation'
import { useFilterStore, useLineStore } from '@/stores'
import { i18n } from '@/translations/i18n'
import { LineGroup } from '@/types/line'

const GroupItem = ({ group, selected, canDelete }: { group: LineGroup, selected?: boolean, canDelete?: boolean }) => {
  const handleDelete = () => {
    Alert.alert(i18n.t('deleteGroup'), i18n.t('areYouSure'), [
      {
        text: i18n.t('cancel'),
      },
      {
        text: i18n.t('delete'),
        onPress: () => {
          useLineStore.getState().deleteGroup(group.id)
        },
      },
    ])
  }

  return (
    <GestureHandlerRootView style={{ flexDirection: 'row', gap: 8 }}>
      {canDelete && (
        <UButton
          icon="trash-2"
          onPress={handleDelete}
          variant="ghost"
          color="neutral"
        />
      )}

      <UButton
        key={group.id}
        className="grow justify-between shrink"
        variant="soft"
        color="neutral"
        onPress={() => {
          useLineStore.getState().selectGroup(group.id)
        }}
      >
        <View className="flex-col shrink gap-2">
          <UText
            className="shrink truncate pl-1 font-medium"
            numberOfLines={1}
          >
            {group.name}
          </UText>

          <View className="flex-row gap-2 flex-wrap">
            {group.codes.length < 1
              ? (
                  <UText className="font-medium text-xs text-muted pl-1">{i18n.t('emptyGroup')}</UText>
                )
              : (
                  group.codes.map(code => (
                    <UText
                      key={code}
                      className="bg-default px-2 rounded-md font-medium"
                    >
                      {code}
                    </UText>
                  ))
                )}
          </View>
        </View>

        {selected && (
          <View className="rounded-md bg-primary size-8 items-center justify-center">
            <UIcon name="check" size={20} />
          </View>
        )}
      </UButton>
    </GestureHandlerRootView>
  )
}

export const GroupsScreen = () => {
  const city = useFilterStore(useShallow(state => state.city))
  const groups = useLineStore(useShallow(state => state.lines[city]))
  const groupId = useLineStore(useShallow(state => state.groupId))

  const flatlistRef = useRef<FlatList>(null)

  return (
    <View className="shrink">
      <Animated.FlatList
        ref={flatlistRef}
        data={groups}
        itemLayoutAnimation={LinearTransition}
        renderItem={({ item }) => (
          <Animated.View exiting={ExitScaleOut}>
            <GroupItem
              group={item}
              selected={groupId === item.id}
              canDelete={groups.length > 1}
            />
          </Animated.View>
        )}
        className="shrink p-2 pt-5"
        contentContainerClassName="gap-2 pb-7 h-full"
      />

      <GestureHandlerRootView style={{ flexGrow: 1, flexShrink: 0 }}>
        <UButton
          label={i18n.t('createNewGroup')}
          className="mb-2 mx-2"
          block
          icon="plus-circle"
          variant="soft"
          size="lg"
          onPress={() => {
            useLineStore.getState().createGroup()
          }}
        />
      </GestureHandlerRootView>
    </View>
  )
}

export default GroupsScreen
