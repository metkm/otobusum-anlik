import { BottomSheetModal } from '@gorhom/bottom-sheet'
import Ionicons from '@react-native-vector-icons/ionicons'
import React, { useCallback, useMemo, useRef } from 'react'
import { StyleSheet, Switch, View } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

import { Option, UiSheetSelect } from '../ui/sheet/UiSheetSelect'
import { UiButton } from '../ui/UiButton'
import { UiText } from '../ui/UiText'

import { colors } from '@/constants/colors'

interface GroupContainerProps {
  title: string
  children?: React.ReactNode
}

export const GroupContainer = (props: GroupContainerProps) => {
  return (
    <View style={styles.outerContainer}>
      <UiText style={styles.title}>{props.title}</UiText>

      {props.children}
    </View>
  )
}

interface SettingContainerBaseProps {
  title: string
  onPress?: () => void
}

type SettingLinkProps = SettingContainerBaseProps & {
  type: 'link'
}

type SettingSwitchProps = SettingContainerBaseProps & {
  type: 'switch'
  value: boolean
  onChange?: () => void
}

type SettingSelectProps<T> = SettingContainerBaseProps & {
  type: 'select'
  options: Option<T>[]
  value: T
  onChange?: (value: T) => void
}

type SettingProps<T> = SettingSwitchProps | SettingLinkProps | SettingSelectProps<T>

export const SettingContainer = <T,>(props: SettingProps<T>) => {
  const bottomSheetModal = useRef<BottomSheetModal>(null)
  const { colorsTheme } = useTheme()

  const handlePress = useCallback(() => {
    props.onPress?.()

    if (props.type === 'select') {
      bottomSheetModal.current?.present()
    } else if (props.type === 'switch') {
      props.onChange?.()
    }
  }, [props])

  const Item = useMemo(() => {
    if (props.type === 'switch') {
      return (
        <Switch
          value={props.value}
          onChange={props.onChange}
          thumbColor={colors.primary}
          trackColor={{ true: colors.primaryDarker }}
        />
      )
    }

    if (props.type === 'select') {
      const selectedOption = props.options.find(opt => opt.value === props.value)

      return (
        <>
          <UiSheetSelect
            cRef={bottomSheetModal}
            title={props.title}
            value={props.value}
            options={props.options}
            onValueChange={props.onChange}
          />

          <View style={styles.selectedValueContainer}>
            <UiText>{selectedOption?.label}</UiText>
            <Ionicons
              name="chevron-forward"
              color={colorsTheme.color}
              size={18}
            />
          </View>
        </>
      )
    }

    return null
  }, [props, colorsTheme.color])

  return (
    <UiButton
      title={props.title}
      variant="soft"
      square
      containerStyle={styles.settingContainer}
      onPress={handlePress}
    >
      {Item}
    </UiButton>
  )
}

const styles = StyleSheet.create({
  settingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    minHeight: 52,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 14,
  },
  outerContainer: {
    gap: 8,
  },
  selectedValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
})
