import { useLocalSearchParams } from 'expo-router'
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
  const params = useLocalSearchParams()
  const addToGroup = params.addToGroup

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

  const handlePress = () => {
    if (addToGroup) {
      useLineStore.getState().addLine(addToGroup as string, group.id)
      return
    }

    useLineStore.getState().selectGroup(group.id)
  }

  return (
    <GestureHandlerRootView style={{ flexDirection: 'row', alignItems: 'stretch', gap: 8 }}>
      {selected && (
        <View className="rounded-md bg-primary w-8 items-center justify-center">
          <UIcon name="check" />
        </View>
      )}

      <UButton
        key={group.id}
        className="grow justify-between shrink gap-0"
        variant="soft"
        color="neutral"
        onPress={handlePress}
      >
        <View className="flex-col shrink gap-1 grow">
          <UText
            className="shrink truncate pl-1 font-medium"
            numberOfLines={1}
          >
            {group.name}
          </UText>

          <View className="flex-row gap-1 flex-wrap">
            {group.codes.length < 1
              ? (
                  <UText className="font-medium text-xs text-muted pl-1">{i18n.t('emptyGroup')}</UText>
                )
              : (
                  group.codes.map(code => (
                    <UText
                      key={code}
                      className="bg-default px-2 py-1 rounded-md font-medium text-sm"
                    >
                      {code}
                    </UText>
                  ))
                )}
          </View>
        </View>

        {canDelete && (
          <UButton
            icon="trash-2"
            onPress={handleDelete}
            variant="ghost"
            color="neutral"
          />
        )}

        <UButton
          icon="edit-3"
          variant="ghost"
          color="neutral"
          to={{
            pathname: '/groups/[groupId]',
            params: {
              groupId: group.id,
            },
          }}
        />
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
    <View className="grow shrink">
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
        className="shrink grow p-2 pt-5"
        contentContainerClassName="gap-2 grow pb-7"
      />

      <GestureHandlerRootView style={{ flexGrow: 1, flexShrink: 0 }}>
        <UButton
          label={i18n.t('createNewGroup')}
          className="mb-2 mx-2 mt-auto"
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
