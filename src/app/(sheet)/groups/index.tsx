import { TrueSheetNavigationOptions, useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation'
import { useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { useCSSVariable } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { UIcon } from '@/components/u/UIcon'
import { UText } from '@/components/u/UText'

import { useLineTheme } from '@/composables'
import { LineContext } from '@/composables/useLine'
import { EnterScaleIn, ExitScaleOut } from '@/constants/animation'
import { useFilterStore, useLineStore } from '@/stores'
import { LineGroup } from '@/types/line'

const GroupItem = ({ group, selected, canDelete }: { group: LineGroup, selected?: boolean, canDelete?: boolean }) => {
  const { t } = useTranslation()
  const theme = useLineTheme()
  const params = useLocalSearchParams()

  const addToGroup = params.addToGroup as string | undefined

  const backgroundWithColor = theme?.backgroundWithColor()

  const handlePress = () => {
    if (addToGroup) {
      useLineStore.getState().addLine(addToGroup as string, group.id)
      return
    }

    useLineStore.getState().setGroupId(group.id)
  }

  return (
    <GestureHandlerRootView style={{ flexDirection: 'row', gap: 8 }}>
      {!addToGroup && (
        <Animated.View
          exiting={ExitScaleOut}
          entering={EnterScaleIn}
          className="justify-center items-center m-auto bg-elevated size-8 rounded-md overflow-hidden"
          style={backgroundWithColor}
        >
          {selected && (
            <UIcon
              name="check"
              color={backgroundWithColor?.color}
              colorClassName="text-inverted"
              sizeClassName="size-4"
              className="bg-primary p-2"
            />
          )}
        </Animated.View>
      )}

      <View className="flex-row items-stretch rounded-md gap-1 h-16 grow">
        <UButton
          key={group.id}
          onPress={handlePress}
          className="flex-1"
          color="neutral"
          variant="soft"
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
                        className="font-inter-medium text-xs rounded-md bg-default/50 h-6 w-12 text-center align-middle border border-muted/50"
                      >
                        {code}
                      </UText>
                    ))
                  )}
            </View>
          </View>
        </UButton>

        <Animated.View
          layout={LinearTransition}
          className="gap-1 flex-row items-stretch"
        >
          <Animated.View
            exiting={ExitScaleOut}
            entering={EnterScaleIn}
            className="flex-row items-stretch"
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
      </View>
    </GestureHandlerRootView>
  )
}

export const GroupsScreen = () => {
  const { t } = useTranslation()
  const params = useLocalSearchParams()
  const theme = useLineTheme()
  const backgroundDefault = useCSSVariable('--background-color-default')

  const navigation = useTrueSheetNavigation()
  const addToGroup = params.addToGroup as string | undefined

  const city = useFilterStore(useShallow(state => state.city))
  const groupId = useLineStore(useShallow(state => state.groupId[city]))
  const groups = useLineStore(useShallow(state => state.lines[city]))

  const text = theme?.text({ variant: 'soft' })
  const background = theme?.background({ variant: 'ghost' })

  useEffect(() => {
    const options: Partial<TrueSheetNavigationOptions> = {
      backgroundColor: background?.backgroundColor ?? backgroundDefault as string | undefined,
      footer: (
        <GestureHandlerRootView style={{ alignItems: 'flex-end' }}>
          <LineContext value={addToGroup}>
            <UButton
              label={t('newGroup')}
              icon="plus-circle"
              size="lg"
              onPress={() => {
                useLineStore.getState().createGroup()
              }}
              className="w-max"
            />
          </LineContext>
        </GestureHandlerRootView>
      ),
      header: (
        <View className="p-2 pt-5 border-b border-b-muted">
          <UText className="text-lg font-inter-semibold leading-tight">{t('groups')}</UText>
          <UText className="text-xs text-muted leading-tight">{addToGroup ? t('addLineToGroup', { code: addToGroup }) : t('chooseActiveGroup')}</UText>
        </View>
      ),
    }

    navigation.getParent()?.setOptions(options)
  }, [addToGroup, background?.backgroundColor, backgroundDefault, navigation, t])

  const defaultGroups = addToGroup ? groups.filter(gr => !gr.codes.includes(addToGroup)) : groups
  const groupsWithCode = addToGroup ? groups.filter(gr => gr.codes.includes(addToGroup)) : []

  return (
    <ScrollView contentContainerClassName="pt-2 gap-2">
      {groupsWithCode.length > 0 && (
        <>
          <Animated.View
            layout={LinearTransition}
            className="gap-2 px-2"
          >
            <UText className="text-muted text-xs">
              <Trans
                i18nKey="lineInGroups"
                values={{ code: addToGroup }}
                components={{
                  code: (
                    <UText
                      className="font-inter-semibold leading-tight"
                      style={text}
                    />
                  ),
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

          {defaultGroups.length > 0 && (
            <Animated.View
              layout={LinearTransition}
              className="h-px bg-(--ui-border-muted)"
            />
          )}
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
  )
}

export default GroupsScreen
