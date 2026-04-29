import { useLocalSearchParams } from 'expo-router'
import { useRef } from 'react'
import { View } from 'react-native'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { UIcon } from '@/components/u/UIcon'
import { UText } from '@/components/u/UText'

import { EnterScaleIn, ExitScaleOut } from '@/constants/animation'
import { useFilterStore, useLineStore } from '@/stores'
import { i18n } from '@/translations/i18n'
import { LineGroup } from '@/types/line'

const GroupItem = ({ group, selected, canDelete }: { group: LineGroup, selected?: boolean, canDelete?: boolean }) => {
  const params = useLocalSearchParams()
  const addToGroup = params.addToGroup

  const handlePress = () => {
    if (addToGroup) {
      useLineStore.getState().addLine(addToGroup as string, group.id)
      return
    }

    useLineStore.getState().selectGroup(group.id)
  }

  return (
    <GestureHandlerRootView style={{ flexDirection: 'row', gap: 8 }}>
      {selected && (
        <Animated.View
          exiting={ExitScaleOut}
          entering={EnterScaleIn}
          className="rounded-md bg-primary w-8 items-center justify-center"
        >
          <UIcon name="check" />
        </Animated.View>
      )}

      <Animated.View
        className="flex-row flex-1 bg-muted rounded-md pr-2 gap-1 h-16"
        layout={LinearTransition}
      >
        <UButton
          key={group.id}
          onPress={handlePress}
          variant="ghost"
          className="flex-1"
        >
          <View className="justify-center gap-1 grow">
            <UText
              className="shrink truncate font-inter-medium"
              numberOfLines={1}
            >
              {group.name}
            </UText>

            <View className="flex-row flex-wrap gap-1">
              {group.codes.length < 1
                ? (
                    <UText className="font-inter-medium text-xs text-muted">{i18n.t('emptyGroup')}</UText>
                  )
                : (
                    group.codes.map(code => (
                      <UText
                        key={code}
                        className="font-inter-medium text-xs rounded-md bg-default h-6 w-12 text-center align-middle"
                      >
                        {code}
                      </UText>
                    ))
                  )}
            </View>
          </View>
        </UButton>

        <Animated.View layout={LinearTransition} className="gap-1 flex-row items-center">
          <Animated.View
            exiting={ExitScaleOut}
            entering={EnterScaleIn}
          >
            {canDelete && (
              <UButton
                icon="trash-2"
                onPress={() => useLineStore.getState().deleteGroup(group.id)}
                variant="ghost"
                color="neutral"
              />
            )}
          </Animated.View>

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
        </Animated.View>
      </Animated.View>
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
          <Animated.View
            exiting={ExitScaleOut}
            entering={EnterScaleIn}
          >
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
