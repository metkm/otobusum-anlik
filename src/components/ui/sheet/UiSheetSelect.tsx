import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { RefObject } from 'react'
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

import { UiText } from '../UiText'

import { UiSheetModal, UiSheetModalProps } from './UiSheetModal'

import { Option } from '@/types/sheet'

interface UiSheetSelectProps<T> extends Omit<UiSheetModalProps, 'children'> {
  options: Option<T>[]
  value?: T
  onValueChange?: (value: T) => void
  cRef?: RefObject<BottomSheetModal | null>
  list?: boolean
}

export const UiSheetSelect = <T,>({ cRef, list, options, value, onValueChange, ...modalProps }: UiSheetSelectProps<T>) => {
  const { schemeColor } = useTheme()

  const dynamicBackground: StyleProp<ViewStyle> = {
    backgroundColor: schemeColor.primary,
  }

  const dynamicBorder: StyleProp<ViewStyle> = {
    borderColor: schemeColor.primary,
  }

  const SelectItem = ({ item }: { item: Option<T> }) => {
    return (
      <TouchableOpacity
        key={`${item.label}-${item.value}`}
        onPress={() => onValueChange?.(item.value)}
        style={styles.item}
      >
        <UiText key={item.label}>{item.label}</UiText>

        <View style={[styles.outerCircle, dynamicBorder]}>
          {value === item.value && <View style={[styles.innerCircle, dynamicBackground]} />}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <UiSheetModal
      cRef={cRef}
      enableDynamicSizing={!list}
      snapPoints={['50%']}
      containerStyle={{ padding: 0 }}
      list={list}
      {...modalProps}
    >
      {options.map(option => (
        <SelectItem key={option.label} item={option} />
      ))}
    </UiSheetModal>
  )
}

const styles = StyleSheet.create({
  item: {
    padding: 12,
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
  innerCircle: {
    borderRadius: 999,
    flex: 1,
  },
})
