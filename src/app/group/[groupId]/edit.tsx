import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useCallback, useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'

import { UiButton } from '@/components/ui/UiButton'
import { UiTextInput } from '@/components/ui/UiTextInput'

import { usePaddings } from '@/hooks/usePaddings'

import { unSelectGroup } from '@/stores/filters'
import { deleteGroup, updateGroupTitle } from '@/stores/lines'
import { i18n } from '@/translations/i18n'

export const GroupEditScreen = () => {
  const { groupId } = useLocalSearchParams()
  const navigation = useNavigation()
  const paddings = usePaddings(true)
  const title = useRef('')

  const handleQueryChange = useCallback(
    (text: string) => title.current = text,
    [],
  )

  const handleOnPress = useCallback(() => {
    if (!groupId || typeof groupId !== 'string') return
    updateGroupTitle(groupId, title.current)
    navigation.goBack()
  }, [groupId, navigation])

  const handleDeleteGroup = () => {
    if (!groupId || typeof groupId !== 'string') return

    deleteGroup(groupId)
    unSelectGroup()

    navigation.goBack()
  }

  useEffect(
    () => {
      navigation.setOptions({
        headerRight: () => (
          <UiButton
            title={i18n.t('save')}
            onPress={handleOnPress}
            variant="ghost"
          />
        ),
      })
    },
    [navigation, handleOnPress],
  )

  return (
    <View style={[styles.container, paddings]}>
      <UiTextInput
        // placeholder={group?.title}
        onChangeText={handleQueryChange}
      />

      <UiButton
        title={i18n.t('deleteGroup')}
        icon="trash-outline"
        variant="soft"
        onPress={handleDeleteGroup}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
})

export default GroupEditScreen
