import { BottomSheetModal } from '@gorhom/bottom-sheet'
import Ionicons from '@react-native-vector-icons/ionicons'
import { router } from 'expo-router'
import { memo, useCallback, useRef } from 'react'
import { StyleSheet, TouchableOpacityProps, View } from 'react-native'
import { RectButton, RectButtonProps } from 'react-native-gesture-handler'

import { useTheme } from '@/hooks/useTheme'

import { LineGroups } from './lines/line/LineGroups'
import { UiButton } from './ui/UiButton'
import { UiLineCode } from './ui/UiLineCode'
import { UiText } from './ui/UiText'

import { addLine } from '@/stores/lines'
import { BusLine, BusStop } from '@/types/bus'
import { isStop } from '@/utils/isStop'

interface Props extends RectButtonProps {
  item: BusStop | BusLine
}

export const TheSearchItem = memo(function SearchItem({ item, ...props }: Props) {
  const bottomSheetModal = useRef<BottomSheetModal>(null)
  const { colorsTheme } = useTheme()

  const handlePress = useCallback(() => {
    if (isStop(item)) {
      router.navigate({
        pathname: '/(tabs)',
        params: {
          stopId: item.stop_code,
        },
      })
    } else {
      addLine(item.code)
    }
  }, [item])

  const handleAddPress = () => {
    bottomSheetModal.current?.present()
  }

  return (
    <RectButton
      style={styles.container}
      onPress={handlePress}
      {...props}
    >
      <View style={styles.title}>
        {isStop(item)
          ? (
              <>
                <UiLineCode>
                  <Ionicons name="flag-sharp" size={16} color="white" />
                </UiLineCode>
                <UiText>{item.stop_name}</UiText>
              </>
            )
          : (
              <>
                <UiLineCode lineCode={item.code} />
                <UiText numberOfLines={2}>{item.title}</UiText>
              </>
            )}
      </View>

      {
        !isStop(item)
        && (
          <LineGroups
            cRef={bottomSheetModal}
            lineCodeToAdd={item.code}
          >
            <UiButton
              icon="add-circle-outline"
              onPress={handleAddPress}
              iconColor={colorsTheme.color}
              variant="soft"
            />
          </LineGroups>
        )
      }
    </RectButton>
  )
})

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 4,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
})
