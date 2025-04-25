import { useBottomSheetModal } from '@gorhom/bottom-sheet'
import { FlashList, ListRenderItem } from '@shopify/flash-list'
import { router } from 'expo-router'
import { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { RectButton, RectButtonProps } from 'react-native-gesture-handler'

import { UiButton } from '@/components/ui/UiButton'
import { UiLineCode } from '@/components/ui/UiLineCode'
import { UiText } from '@/components/ui/UiText'

import { i18n } from '@/translations/i18n'
import { LineGroup } from '@/types/lineGroup'

interface Props extends RectButtonProps {
  group: LineGroup
}

export const LineGroupsItem = ({ group, ...props }: Props) => {
  const { dismissAll } = useBottomSheetModal()

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
      style={styles.container}
      onLongPress={handleLongPress}
      {...props}
    >
      <View style={styles.top}>
        <UiText>{group.title}</UiText>
        <UiButton
          icon="pencil"
          onPress={handleLongPress}
          variant="soft"
        />
      </View>

      <FlashList
        data={group?.lineCodes}
        renderItem={renderItem}
        estimatedItemSize={70}
        ListEmptyComponent={emptyItem}
        horizontal
      />
    </RectButton>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
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
})
