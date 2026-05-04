import { useLocalSearchParams } from 'expo-router'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { UIcon } from '@/components/u/UIcon'
import { UText } from '@/components/u/UText'

import { useLineTheme } from '@/composables'
import { LineContext } from '@/composables/useLine'
import { EnterScaleIn, ExitScaleOut } from '@/constants/animation'
import { useLineStore } from '@/stores'
import { LineGroup } from '@/types/line'

const GroupItem = ({ group, selected, canDelete }: { group: LineGroup, selected?: boolean, canDelete?: boolean }) => {
  const { t } = useTranslation()
  const theme = useLineTheme()

  const params = useLocalSearchParams()
  const addToGroup = params.addToGroup as string | undefined

  const backgroundWithColor = theme?.backgroundWithColor()

  const handlePress = () => {
    if (addToGroup) {
      useLineStore.getState().addLineToGroup(addToGroup as string, group.id)
      return
    }

    useLineStore.getState().setGroupId(group.id)
  }

  return (
    <GestureHandlerRootView style={{ flexDirection: 'row', gap: 8 }}>
      {selected && (
        <Animated.View
          exiting={ExitScaleOut}
          entering={EnterScaleIn}
          className="rounded-md bg-primary w-8 items-center justify-center"
          style={backgroundWithColor}
        >
          <UIcon
            name="check"
            color={backgroundWithColor?.color}
          />
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
                    <UText className="font-inter-medium text-xs text-muted">{t('emptyGroup')}</UText>
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
  const params = useLocalSearchParams()
  const addToGroup = params.addToGroup as string | undefined

  const groupId = useLineStore(useShallow(state => state.getGroupId()))
  const groups = useLineStore(useShallow(state => state.getGroups()))

  const defaultGroups = addToGroup ? groups.filter(gr => !gr.codes.includes(addToGroup)) : groups
  const groupsWithCode = addToGroup ? groups.filter(gr => gr.codes.includes(addToGroup)) : []

  return (
    <LineContext value={addToGroup}>
      <ScrollView contentContainerClassName="pt-5 gap-2">
        {groupsWithCode.length > 0 && (
          <>
            <Animated.View
              layout={LinearTransition}
              className="gap-2 px-2"
            >
              <UText className="leading-tight text-muted pl-1">
                <Trans
                  i18nKey="lineInGroups"
                  values={{ code: addToGroup }}
                  components={{
                    code: <UText className="text-lg font-bold leading-tight text-muted" />,
                  }}
                />
              </UText>

              {groupsWithCode.map(group => (
                <Animated.View
                  key={group.id}
                  exiting={ExitScaleOut}
                  entering={EnterScaleIn}
                  layout={LinearTransition}
                >
                  <GroupItem
                    group={group}
                    canDelete={groups.length > 1}
                    selected={group.id === groupId}
                  />
                </Animated.View>
              ))}
            </Animated.View>

            <Animated.View
              layout={LinearTransition}
              className="h-0.5 bg-muted"
            />
          </>
        )}

        <Animated.View
          layout={LinearTransition}
          className="gap-2 px-2 pb-15"
        >
          {defaultGroups.map(group => (
            <Animated.View
              key={group.id}
              exiting={ExitScaleOut}
              entering={EnterScaleIn}
              layout={LinearTransition}
            >
              <GroupItem
                group={group}
                canDelete={groups.length > 1}
                selected={group.id === groupId}
              />
            </Animated.View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* <Animated.FlatList
        data={groupsWithoutCode}
        layout={LinearTransition}
        itemLayoutAnimation={LinearTransition}
        renderItem={({ item }) => (
          <Animated.View
            exiting={ExitScaleOut}
            entering={EnterScaleIn}
          >
            <GroupItem
              group={item}
              canDelete={true}
            />
          </Animated.View>
        )}
        contentContainerClassName="p-2 gap-2"
      /> */}
    </LineContext>
  )

  // return (
  //   <LineContext value={addToGroup}>
  //     <Animated.FlatList
  //       ref={flatlistRef}
  //       data={groupsFiltered}
  //       itemLayoutAnimation={LinearTransition}
  //       layout={LinearTransition}
  //       renderItem={({ item }) => (
  //         <Animated.View
  //           exiting={ExitScaleOut}
  //           entering={EnterScaleIn}
  //         >
  //           <GroupItem
  //             group={item}
  //             selected={groupId === item.id}
  //             canDelete={groups.length > 1}
  //           />
  //         </Animated.View>
  //       )}
  //       contentContainerClassName={`px-2 pb-15.5 gap-2 ${addToGroup ? 'pt-2' : 'pt-5'}`}
  //     />
  //   </LineContext>
  // )
}

export default GroupsScreen
