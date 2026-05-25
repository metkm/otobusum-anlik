import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation'
import { router } from 'expo-router'
import { useLocalSearchParams } from 'expo-router/build/hooks'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { FlatList, GestureHandlerRootView, TextInput } from 'react-native-gesture-handler'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCSSVariable } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { UInput } from '@/components/u/UInput'
import { UText } from '@/components/u/UText'

import { useLineTheme } from '@/composables'
import { useFilterStore, useLineStore } from '@/stores'

const AnimatedGestureHandlerRootView = Animated.createAnimatedComponent(GestureHandlerRootView)

export const GroupIdScreen = () => {
  const backgroundDefault = useCSSVariable('--background-color-default')
  const navigation = useTrueSheetNavigation()
  const params = useLocalSearchParams()
  const insets = useSafeAreaInsets()
  const theme = useLineTheme()
  const { progress } = useReanimatedKeyboardAnimation()
  const { t } = useTranslation()

  const name = useRef('')
  const inputRef = useRef<TextInput>(null)

  const city = useFilterStore(useShallow(state => state.city))
  const groups = useLineStore(useShallow(state => state.lines[city]))

  const background = theme?.background({ variant: 'ghost' })

  const style = useAnimatedStyle(() => ({
    gap: 8,
    paddingBottom: interpolate(progress.value, [0, 1], [insets.bottom + 8, 8], 'clamp'),
  }))

  const group = groups.find(gr => gr.id === params.groupId)

  useEffect(() => {
    navigation.setOptions({
      backgroundColor: background?.backgroundColor ?? backgroundDefault as string | undefined,
      footer: (
        <AnimatedGestureHandlerRootView style={style}>
          <UButton
            label={t('save')}
            size="lg"
            block
            icon="save"
            onPress={handleSave}
            variant="soft"
          />

          {groups.length > 1 && (
            <UButton
              label={t('deleteGroup')}
              icon="trash-2"
              onPress={() => {
                if (!group)
                  return

                useLineStore.getState().deleteGroup(group.id)
                router.back()
              }}
              size="lg"
              block
              variant="soft"
            />
          )}
        </AnimatedGestureHandlerRootView>
      ),
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation])

  const handleSave = () => {
    if (!group)
      return

    useLineStore.getState().updateGroupName(group.id, name.current)
    inputRef.current?.clear()
  }

  return (
    <View className={`px-2 pt-5 gap-2 ${groups.length > 1 ? 'pb-28' : 'pb-15'}`}>
      <View className="gap-1">
        <UText className="ml-2 font-inter-medium">{group?.name}</UText>
        <UInput
          ref={inputRef}
          placeholder={t('newGroupTitlePlaceholder')}
          onChangeText={(text) => {
            name.current = text
          }}
          variant="soft"
        />
      </View>

      {(group && group.codes.length > 0) && (
        <FlatList
          data={group?.codes}
          renderItem={({ item }) => (
            <GestureHandlerRootView>
              <View className="flex-row items-stretch gap-1">
                <UButton
                  icon="trash-2"
                  onPress={() => {
                    if (!group)
                      return
                    useLineStore.getState().deleteLine(item, group.id)
                  }}
                  color="neutral"
                  variant="soft"
                />

                <UText className="px-2 py-1 font-inter-medium rounded-md bg-muted/50 align-middle">{item}</UText>
              </View>
            </GestureHandlerRootView>
          )}
          contentContainerClassName="gap-2"
        />
      )}
    </View>
  )
}

export default GroupIdScreen
