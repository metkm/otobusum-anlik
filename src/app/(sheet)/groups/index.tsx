import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { type ScrollViewInstance, View } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

import { ThemeProvider } from '@/components/provider/ThemeProvider'
import { UBadge, UButton, UText } from '@/components/u'
import { useLineGroup } from '@/composables'
import { EnterScaleIn, ExitScaleOut, LayoutAnimationTransition } from '@/constants/animation'
import { useTransitStore } from '@/stores'
import { type GroupItem, type Group } from '@/stores/groups'

const GroupItem = ({ group, selected }: { group: Group; selected?: boolean }) => {
  const { t } = useTranslation()
  const { code, type } = useLocalSearchParams<{
    code: GroupItem['code']
    type: GroupItem['type']
  }>()
  const router = useRouter()

  const handlePress = () => {
    router.navigate('/(home)/(tabs)')

    requestIdleCallback(() => {
      if (code) {
        useTransitStore.getState().addItemToGroup({ code, type }, group.id)
      } else {
        useTransitStore.getState().selectGroup(group.id)
      }
    })
  }

  const variant = selected ? 'soft' : 'ghost'
  const color = selected ? 'primary' : 'neutral'

  return (
    <View className="flex-row gap-2">
      <UButton
        variant={variant}
        className="flex-1 items-center gap-2"
        onPress={handlePress}
        color={color}
      >
        <View className="flex-1 shrink gap-1">
          <UButton.Text
            numberOfLines={1}
            className="shrink"
          >
            {group.name}
          </UButton.Text>

          <View className="flex-row flex-wrap gap-1">
            {group.items.length < 1 ? (
              <UText className="font-inter-medium text-muted text-sm">{t('emptyGroup')}</UText>
            ) : (
              group.items.map((item) => (
                <ThemeProvider
                  value={selected ? item.code : undefined}
                  key={item.code}
                >
                  <UBadge
                    label={item.code}
                    variant="soft"
                    // oxlint-disable-next-line no-nested-ternary
                    color={code ? 'primary' : selected ? 'primary' : 'neutral'}
                    icon={item.type === 'line' ? 'bus-front' : 'map-pin'}
                  />
                </ThemeProvider>
              ))
            )}
          </View>
        </View>
      </UButton>

      <UButton
        icon="chevron-right"
        variant={variant}
        to={{ params: { groupId: group.id }, pathname: '/(sheet)/groups/[groupId]' }}
      />
    </View>
  )
}

export const GroupsScreen = () => {
  const { t } = useTranslation()
  const { code, type } = useLocalSearchParams<{
    type: GroupItem['type']
    code: GroupItem['code']
  }>()
  const { groups, groupId } = useLineGroup()

  const scrollableRef = useRef<ScrollViewInstance>(null)
  const navigation = useTrueSheetNavigation()

  useEffect(() => {
    navigation.setOptions({
      footer: (
        <ThemeProvider value={code}>
          <GestureHandlerRootView style={{ alignSelf: 'flex-end' }}>
            <UButton
              icon="plus-circle"
              size="xl"
              variant="soft"
              onPress={() => {
                useTransitStore.getState().createGroup()
              }}
              className="mr-2 mb-2"
            />
          </GestureHandlerRootView>
        </ThemeProvider>
      ),
      footerOptions: {
        position: 'absolute',
      },
      scrollableRef,
    })
  }, [navigation, code])

  return (
    <ThemeProvider value={code}>
      <GestureHandlerRootView>
        <ScrollView
          ref={scrollableRef}
          className="flex-1"
          contentContainerClassName="pt-9 pb-2 px-2"
          showsVerticalScrollIndicator={false}
        >
          {code && (
            <View className="mb-2 flex-row items-center justify-center gap-2">
              <UBadge
                label={code}
                icon={type === 'line' ? 'bus-front' : 'map-pin'}
              />
              <UText className="font-inter-medium text-muted text-sm">
                {t('addToGroup', { code })}
              </UText>
            </View>
          )}

          <UBadge
            label={t('groups')}
            icon="component"
            color="neutral"
            className="mb-2"
          />

          <Animated.View layout={LayoutAnimationTransition}>
            {groups.map((group) => (
              <Animated.View
                key={group.id}
                exiting={ExitScaleOut}
                entering={EnterScaleIn}
                layout={LayoutAnimationTransition}
              >
                <GroupItem
                  group={group}
                  selected={group.id === groupId}
                />
              </Animated.View>
            ))}
          </Animated.View>
        </ScrollView>
      </GestureHandlerRootView>
    </ThemeProvider>
  )
}

export default GroupsScreen
