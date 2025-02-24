import { BottomSheetModal, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet'
import { RefObject } from 'react'
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

import { UiText } from '../UiText'

import { UiSheetModal } from './UiSheetModal'

import { Option } from '@/types/sheet'

interface UiSheetSelectProps<T> {
  title: string
  options: Option<T>[]
  value?: T
  onValueChange?: (value: T) => void
  list?: boolean
}

export const UiSheetSelect = <T,>(
  props: UiSheetSelectProps<T> & { cRef?: RefObject<BottomSheetModal> },
) => {
  const { getSchemeColorHex } = useTheme()

  const dynamicBackground: StyleProp<ViewStyle> = {
    backgroundColor: getSchemeColorHex('primary'),
  }

  const dynamicBorder: StyleProp<ViewStyle> = {
    borderColor: getSchemeColorHex('secondaryContainer'),
  }

  const SelectItem = ({ item }: { item: Option<T> }) => {
    return (
      <TouchableOpacity
        key={`${item.label}-${item.value}`}
        onPress={() => props.onValueChange?.(item.value)}
        style={styles.item}
      >
        <UiText key={item.label}>{item.label}</UiText>

        <View style={[styles.outerCircle, dynamicBorder]}>
          {props.value === item.value && <View style={[styles.innerCircle, dynamicBackground]} />}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <UiSheetModal
      cRef={props.cRef}
      enableDynamicSizing={!props.list}
      snapPoints={['50%']}
    >
      {props.list
        ? (
            <View style={[styles.container]}>
              <UiText info style={styles.title}>
                {props.title}
              </UiText>

              <BottomSheetScrollView>
                {props.options.map(option => (
                  <SelectItem key={option.label} item={option} />
                ))}
              </BottomSheetScrollView>
            </View>
          )
        : (
            <BottomSheetView style={styles.viewContainer}>
              <UiText info style={styles.title}>
                {props.title}
              </UiText>

              {props.options.map(option => (
                <SelectItem key={option.label} item={option} />
              ))}
            </BottomSheetView>
          )}
    </UiSheetModal>
  )
}

const styles = StyleSheet.create({
  item: {
    padding: 8,
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  outerCircle: {
    width: 22,
    height: 22,
    borderRadius: 999,
    padding: 4,
    borderWidth: 2,
  },
  container: {
    flex: 1,
  },
  viewContainer: {
    padding: 8,
  },
  innerCircle: {
    borderRadius: 999,
    flex: 1,
  },
  title: {
    padding: 8,
  },
})
