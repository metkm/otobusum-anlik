import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { type ScrollViewInstance, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

import { ThemeProvider } from '@/components/provider/ThemeProvider'
import { UBadge, UButton, UText } from '@/components/u'
import { UNativeGestureHandlerRootView } from '@/components/u/native/UNativeGestureHandlerRootView'
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
    <Animated.View
      exiting={ExitScaleOut}
      entering={EnterScaleIn}
      layout={LayoutAnimationTransition}
      className="flex-row gap-2"
    >
      <UButton
        variant={variant}
        className="flex-1 shrink flex-col items-start"
        onPress={handlePress}
        color={color}
      >
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
      </UButton>

      <Link
        href={{ params: { groupId: group.id }, pathname: '/(sheet)/groups/[groupId]' }}
        asChild
      >
        <UButton
          icon="chevron-right"
          variant={variant}
        />
      </Link>
    </Animated.View>
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
          <UNativeGestureHandlerRootView className="self-end p-2">
            <UButton
              icon="plus-circle"
              size="xl"
              variant="soft"
              onPress={() => {
                useTransitStore.getState().createGroup()
              }}
            />
          </UNativeGestureHandlerRootView>
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
      <UNativeGestureHandlerRootView>
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
              <GroupItem
                key={group.id}
                group={group}
                selected={group.id === groupId}
              />
            ))}
          </Animated.View>
        </ScrollView>
      </UNativeGestureHandlerRootView>
    </ThemeProvider>
  )
}

export default GroupsScreen
