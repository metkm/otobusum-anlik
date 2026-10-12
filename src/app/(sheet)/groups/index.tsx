import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import Animated, { LinearTransition } from 'react-native-reanimated'

import { UButton } from '@/components/u/UButton'
import { UIcon } from '@/components/u/UIcon'
import { USheetHeader } from '@/components/u/USheetHeader'
import { UText } from '@/components/u/UText'

import { useLineGroup, useLineTheme } from '@/composables'
import { LineContext } from '@/composables/useLine'
import { EnterScaleIn, ExitScaleOut } from '@/constants/animation'
import { useLineStore } from '@/stores'
import { LineGroup } from '@/types/line'

const GroupItem = ({
  group,
  selected,
  canDelete,
}: {
  group: LineGroup
  selected?: boolean
  canDelete?: boolean
}) => {
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
    <GestureHandlerRootView style={{ flexDirection: 'row' }}>
      <UButton
        variant="ghost"
        className="flex-1 gap-2"
        onPress={handlePress}
      >
        <View className="h-full flex-col">
          <View className={`${selected ? 'bg-primary' : 'bg-muted'} flex-1 aspect-square p-2 rounded-md flex items-center justify-center`}>
            {selected && (
              <UIcon
                name="check"
                sizeClassName="size-5"
                colorClassName="text-inverted"
                color={backgroundWithColor?.color}
              />
            )}
          </View>
        </View>

        <View className="flex-1 shrink gap-1">
          <UText className="shrink truncate font-inter-medium" numberOfLines={1}>
            {group.name}
          </UText>

          <View className="flex-row flex-wrap gap-2">
            {group.codes.length < 1
              ? (
                  <UText className="font-inter-medium text-xs text-muted h-6">{t('emptyGroup')}</UText>
                )
              : (
                  group.codes.map(code => (
                    <UText
                      key={code}
                      className="font-inter-medium text-xs rounded-md bg-default/50 h-6 w-12 text-center align-middle border border-muted/50"
                      style={
                        code === addToGroup
                          ? {
                              backgroundColor: backgroundWithColor?.backgroundColor,
                              color: backgroundWithColor?.color,
                            }
                          : undefined
                      }
                    >
                      {code}
                    </UText>
                  ))
                )}
          </View>
        </View>
      </UButton>

      <Animated.View layout={LinearTransition} className="flex-row items-center p-2">
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
    </GestureHandlerRootView>
  )
}

export const GroupsScreen = () => {
  const { t } = useTranslation()
  const params = useLocalSearchParams()
  const { groupId, groups } = useLineGroup()
  const scrollableRef = useRef<ScrollView>(null)

  const navigation = useTrueSheetNavigation()
  const addToGroup = params.addToGroup as string | undefined

  const theme = useLineTheme({ code: addToGroup })
  const backgroundColor = theme?.background({ variant: 'ghost' })?.backgroundColor

  useEffect(() => {
    const options = {
      scrollableRef,
      header: (
        <USheetHeader
          icon="component"
          title={t('groups')}
          description={
            addToGroup ? t('addLineToGroup', { code: addToGroup }) : t('chooseActiveGroup')
          }
        >
          <LineContext value={addToGroup}>
            <GestureHandlerRootView style={{ flexShrink: 0 }}>
              <UButton
                label={t('newGroup')}
                icon="plus-circle"
                variant="soft"
                onPress={() => {
                  useLineStore.getState().createGroup()
                }}
              />
            </GestureHandlerRootView>
          </LineContext>
        </USheetHeader>
      ),
    }

    navigation.setOptions({
      ...options,
      ...(backgroundColor ? { backgroundColor } : {}),
    })
  }, [addToGroup, backgroundColor, navigation, t])

  return (
    <LineContext value={addToGroup}>
      <ScrollView ref={scrollableRef} contentContainerClassName="gap-2">
        <Animated.View layout={LinearTransition}>
          {groups.map(group => (
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
    </LineContext>
  )
}

export default GroupsScreen
