import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { type ScrollViewInstance, View } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

import { ThemeProvider } from '@/components/ThemeProvider'
import { UBadge, UButton, USheetHeader, UIcon, UText } from '@/components/u'
import { useLineGroup } from '@/composables'
import { LineContext } from '@/composables/useLine'
import { EnterScaleIn, ExitScaleOut, LayoutAnimationTransition } from '@/constants/animation'
import { useLineStore } from '@/stores'
import type { LineGroup } from '@/types/line'

const GroupItem = ({
  group,
  selected,
  canDelete,
  code,
}: {
  group: LineGroup
  selected?: boolean
  canDelete?: boolean
  code?: string
}) => {
  const { t } = useTranslation()
  const navigation = useTrueSheetNavigation()

  const handlePress = () => {
    navigation.navigate('(home)')

    if (code) {
      useLineStore.getState().addLine(code as string, group.id)
    } else {
      useLineStore.getState().setGroupId(group.id)
    }
  }

  return (
    <View className="flex-row">
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
              colorClassName="accent-inverted"
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

          <View className="flex-row flex-wrap gap-1">
            {group.codes.length < 1 ? (
              <UText className="font-inter-medium text-muted h-6 text-sm">{t('emptyGroup')}</UText>
            ) : (
              group.codes.map((_code) => (
                <UBadge
                  key={_code}
                  label={_code}
                  variant="soft"
                  color={code === _code ? 'primary' : 'neutral'}
                />
              ))
            )}
          </View>
        </View>
      </UButton>

      <Animated.View
        layout={LayoutAnimationTransition}
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
            pathname: '(sheet)/groups/[groupId]',
          }}
        />
      </Animated.View>
    </View>
  )
}

export const GroupsScreen = () => {
  const { t } = useTranslation()
  const { addToGroup } = useLocalSearchParams<{ addToGroup?: string }>()
  const { groups, groupId } = useLineGroup()
  const scrollableRef = useRef<ScrollViewInstance>(null)
  const navigation = useTrueSheetNavigation()

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
    })
  }, [addToGroup, navigation, t])

  return (
    <LineContext value={addToGroup}>
      <ThemeProvider>
        <GestureHandlerRootView>
          <ScrollView
            ref={scrollableRef}
            className="flex-1"
            contentContainerClassName="p-2"
          >
            <Animated.View
              layout={LayoutAnimationTransition}
              className="gap-2"
            >
              {groups.map((group) => (
                <Animated.View
                  key={group.id}
                  exiting={ExitScaleOut}
                  entering={EnterScaleIn}
                  layout={LayoutAnimationTransition}
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
        </GestureHandlerRootView>
      </ThemeProvider>
    </LineContext>
  )
}

export default GroupsScreen
