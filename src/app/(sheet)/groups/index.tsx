import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { type ScrollViewInstance, View } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

import { ThemeProvider } from '@/components/provider/ThemeProvider'
import { UBadge, UButton, USheetHeader, UIcon, UText } from '@/components/u'
import { useLineGroup } from '@/composables'
import { GroupItemContext } from '@/composables/useGroupItem'
import { EnterScaleIn, ExitScaleOut, LayoutAnimationTransition } from '@/constants/animation'
import { useTransitStore } from '@/stores'
import { type GroupItem, type Group } from '@/stores/groups'
import { cn } from '@/utils/cn'

const GroupItem = ({
  group,
  selected,
  canDelete,
}: {
  group: Group
  selected?: boolean
  canDelete?: boolean
}) => {
  const { t } = useTranslation()
  const { code, type } = useLocalSearchParams<{
    code: GroupItem['code']
    type: GroupItem['type']
  }>()
  const navigation = useTrueSheetNavigation()

  const handlePress = () => {
    navigation.navigate('(home)')

    if (code) {
      useTransitStore.getState().addItemToGroup({ code, type }, group.id)
    } else {
      useTransitStore.getState().selectGroup(group.id)
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
          className={cn(
            'size-8 items-center justify-center rounded-md',
            selected ? 'bg-primary' : 'bg-muted',
          )}
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
            {group.items.length < 1 ? (
              <UText className="font-inter-medium text-muted h-6 text-sm">{t('emptyGroup')}</UText>
            ) : (
              group.items.map((item) => (
                <UBadge
                  key={item.code}
                  label={item.code}
                  variant="soft"
                  color={code === item.code ? 'primary' : 'neutral'}
                  icon={item.type === 'line' ? 'bus-front' : 'map-pin'}
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
              onPress={() => useTransitStore.getState().deleteGroup(group.id)}
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
            pathname: '/(sheet)/groups/[groupId]',
          }}
        />
      </Animated.View>
    </View>
  )
}

export const GroupsScreen = () => {
  const { t } = useTranslation()
  const { code } = useLocalSearchParams<{ type: GroupItem['type']; code: GroupItem['code'] }>()
  const { groups, groupId } = useLineGroup()

  const scrollableRef = useRef<ScrollViewInstance>(null)
  const navigation = useTrueSheetNavigation()

  useEffect(() => {
    const options = {
      header: (
        <USheetHeader
          icon="component"
          title={t('groups')}
          description={code ? t('addLineToGroup', { code }) : t('chooseActiveGroup')}
        >
          <GroupItemContext value={code}>
            <ThemeProvider>
              <GestureHandlerRootView style={{ flexShrink: 0 }}>
                <UButton
                  label={t('newGroup')}
                  icon="plus-circle"
                  variant="soft"
                  onPress={() => {
                    useTransitStore.getState().createGroup()
                  }}
                />
              </GestureHandlerRootView>
            </ThemeProvider>
          </GroupItemContext>
        </USheetHeader>
      ),
      scrollableRef,
    }

    navigation.setOptions({
      ...options,
    })
  }, [navigation, t, code])

  return (
    <GroupItemContext value={code}>
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
    </GroupItemContext>
  )
}

export default GroupsScreen
