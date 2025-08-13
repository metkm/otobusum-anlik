import { useBottomSheetModal } from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import { useCallback } from 'react'
import { ListRenderItem, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { FlatList, RectButton } from 'react-native-gesture-handler'

import { UiButton } from '@/components/ui/UiButton'
import { UiLineCode } from '@/components/ui/UiLineCode'
import { UiText } from '@/components/ui/UiText'

import { useTheme } from '@/hooks/useTheme'

import { i18n } from '@/translations/i18n'
import { LineGroup } from '@/types/lineGroup'

interface LineGroupsItemProps {
  group: LineGroup
  containerStyle?: StyleProp<ViewStyle>
  onPress?: () => void
}

export const LineGroupsItem = ({ group, containerStyle, onPress }: LineGroupsItemProps) => {
  const { dismissAll } = useBottomSheetModal()
  const { schemeColor } = useTheme()

  const handleLongPress = useCallback(
    () => {
      dismissAll()

      setTimeout(() => {
        router.push({
          pathname: '/group/[groupId]/edit',
          params: {
            groupId: group.id,
          },
        })
      }, 150)
    },
    [dismissAll, group.id],
  )

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item: lineCode }) => (
      <View style={styles.itemContainer}>
        <UiLineCode lineCode={lineCode} />
      </View>
    ),
    [],
  )

  const emptyItem = useCallback(
    () => <UiText size="sm">{i18n.t('emptyGroup')}</UiText>,
    [],
  )

  return (
    <RectButton
      style={[styles.container, containerStyle]}
      onLongPress={handleLongPress}
      onPress={onPress}
    >
      <View style={styles.top}>
        <UiText size="lg" style={{ fontWeight: 'bold' }}>{group.title}</UiText>

        <UiButton
          icon="pencil"
          onPress={handleLongPress}
          size="sm"
        />
      </View>

      <FlatList
        data={group?.lineCodes}
        renderItem={renderItem}
        ListEmptyComponent={emptyItem}
        contentContainerStyle={[styles.itemsContainer, { backgroundColor: schemeColor.surfaceContainer }]}
        horizontal
      />
    </RectButton>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    gap: 8,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    gap: 8,
  },
  itemContainer: {
    marginHorizontal: 4,
  },
  itemsContainer: {
    borderRadius: 8,
    minWidth: '100%',
    padding: 8,
  },
})
