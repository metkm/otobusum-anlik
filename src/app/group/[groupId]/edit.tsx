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
  const { stackRoutePaddings } = usePaddings()
  const navigation = useNavigation()
  const title = useRef('')

  const handleQueryChange = useCallback((text: string) => (title.current = text), [])

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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <UiButton title={i18n.t('save')} onPress={handleOnPress} variant="soft" />,
    })
  }, [navigation, handleOnPress])

  return (
    <View style={[styles.container, stackRoutePaddings]}>
      <UiTextInput
        onChangeText={handleQueryChange}
        placeholder={i18n.t('newGroupTitlePlaceholder')}
      />

      <UiButton
        title={i18n.t('deleteGroup')}
        icon="trash-outline"
        variant="error"
        onPress={handleDeleteGroup}
        square
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
})

export default GroupEditScreen
