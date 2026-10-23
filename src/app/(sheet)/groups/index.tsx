import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { type ScrollViewInstance, View } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import Animated, { LinearTransition } from 'react-native-reanimated'

import { ThemeProvider } from '@/components/ThemeProvider'
import { UBadge } from '@/components/u/UBadge'
import { UButton } from '@/components/u/UButton'
import { USheetHeader } from '@/components/u/UHeader'
import { UIcon } from '@/components/u/UIcon'
import { UText } from '@/components/u/UText'
import { useLineGroup } from '@/composables'
import { LineContext } from '@/composables/useLine'
import { EnterScaleIn, ExitScaleOut } from '@/constants/animation'
import { useLineStore } from '@/stores'
import type { LineGroup } from '@/types/line'

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
  const params = useLocalSearchParams()

  const addToGroup = params.addToGroup as string | undefined

  const handlePress = () => {
    if (addToGroup) {
      useLineStore.getState().addLine(addToGroup as string, group.id)
      void TrueSheet.dismissAll()
      return
    }

    useLineStore.getState().setGroupId(group.id)
    void TrueSheet.dismissAll()
  }

  return (
    <GestureHandlerRootView style={{ flexDirection: 'row' }}>
      <UButton
        variant="ghost"
        className="flex-1 items-center gap-2"
        onPress={handlePress}
      >
        <View
          className={`${selected ? 'bg-primary' : 'bg-muted'} size-8 items-center justify-center rounded-md`}
        >
          {selected && (
            <UIcon
              name="check"
              sizeClassName="size-5"
              colorClassName="text-inverted"
            />
          )}
        </View>

        <View className="flex-1 shrink gap-1">
          <UText
            className="font-inter-medium shrink truncate"
            numberOfLines={1}
          >
            {group.name}
          </UText>

          <View className="flex-row flex-wrap gap-2">
            {group.codes.length < 1 ? (
              <UText className="font-inter-medium text-muted h-6 text-sm">{t('emptyGroup')}</UText>
            ) : (
              group.codes.map((code) => (
                <UBadge
                  key={code}
                  label={code}
                  variant="soft"
                  color={code === addToGroup ? 'primary' : 'neutral'}
                />
              ))
            )}
          </View>
        </View>
      </UButton>

      <Animated.View
        layout={LinearTransition}
        className="flex-row items-center p-2"
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
            params: {
              groupId: group.id,
            },
            pathname: '/groups/[groupId]',
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
  const scrollableRef = useRef<ScrollViewInstance>(null)

  const navigation = useTrueSheetNavigation()
  const addToGroup = params.addToGroup as string | undefined

  useEffect(() => {
    const options = {
      header: (
        <USheetHeader
          icon="component"
          title={t('groups')}
          description={
            addToGroup ? t('addLineToGroup', { code: addToGroup }) : t('chooseActiveGroup')
          }
        >
          <LineContext value={addToGroup}>
            <ThemeProvider>
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
            </ThemeProvider>
          </LineContext>
        </USheetHeader>
      ),
      scrollableRef,
    }

    navigation.setOptions({
      ...options,
      // ...(backgroundColor ? { backgroundColor } : {}),
    })
  }, [addToGroup, navigation, t])

  return (
    <LineContext value={addToGroup}>
      <ThemeProvider>
        <ScrollView
          ref={scrollableRef}
          className="flex-1"
          contentContainerClassName="p-2"
        >
          <Animated.View
            layout={LinearTransition}
            className="gap-2"
          >
            {groups.map((group) => (
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
      </ThemeProvider>
    </LineContext>
  )
}

export default GroupsScreen
