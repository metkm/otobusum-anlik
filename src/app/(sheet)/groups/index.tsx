import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { UIcon } from '@/components/u/UIcon'
import { UText } from '@/components/u/UText'

import { useLineTheme } from '@/composables'
import { LineContext, useLine } from '@/composables/useLine'
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

const Header = () => {
  const { code } = useLine()

  const groupId = useLineStore(useShallow(state => state.getGroupId()))
  const groups = useLineStore(useShallow(state => state.getGroups()))

  const filteredGroups = groups.filter(gr => gr.codes.includes(code))

  return (
    <Animated.FlatList
      data={filteredGroups}
      itemLayoutAnimation={LinearTransition}
      layout={LinearTransition}
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
      className="px-2 pb-2 border-b border-muted"
      contentContainerClassName="gap-2"
    />
  )
}

export const GroupsScreen = () => {
  const navigation = useTrueSheetNavigation()
  const params = useLocalSearchParams()
  const addToGroup = params.addToGroup as string | undefined

  const groupId = useLineStore(useShallow(state => state.getGroupId()))
  const groups = useLineStore(useShallow(state => state.getGroups()))

  const flatlistRef = useRef<FlatList>(null)

  useEffect(() => {
    const parent = navigation.getParent()
    if (!parent || !addToGroup)
      return

    parent.setOptions({
      header: (
        <LineContext value={addToGroup}>
          <UText className="leading-tight text-muted p-2 pt-5">
            <Trans
              i18nKey="lineInGroups"
              values={{ code: addToGroup }}
              components={{
                code: <UText className="text-lg font-bold leading-tight text-muted" />,
              }}
            />
          </UText>

          <Header />
        </LineContext>
      ),
    })
  }, [navigation, addToGroup])

  if (!addToGroup)
    return

  const groupsFiltered = groups.filter(gr => !gr.codes.includes(addToGroup))

  return (
    <LineContext value={addToGroup}>
      <Animated.FlatList
        ref={flatlistRef}
        data={groupsFiltered}
        itemLayoutAnimation={LinearTransition}
        layout={LinearTransition}
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
        contentContainerClassName={`px-2 pb-15.5 gap-2 ${addToGroup ? 'pt-2' : 'pt-5'}`}
      />
    </LineContext>
  )
}

export default GroupsScreen
