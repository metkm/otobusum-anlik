import { BottomSheetModal } from '@gorhom/bottom-sheet'
import React, { useCallback, useMemo, useRef } from 'react'
import { StyleSheet, Switch, View } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

import { UiButton } from '../ui/UiButton'
import { UiSheet } from '../ui/UiSheet'
import { UiText } from '../ui/UiText'

import { Option } from '@/types/sheet'

interface GroupContainerProps {
  title: string
  children?: React.ReactNode
}

export const SettingsGroupContainer = (props: GroupContainerProps) => {
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

export const SettingsContainer = <T,>(props: SettingProps<T>) => {
  const sheetRef = useRef<BottomSheetModal>(null)
  const { schemeColor } = useTheme()

  const handlePress = useCallback(() => {
    props.onPress?.()

    if (props.type === 'select') {
      sheetRef.current?.present()
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
          thumbColor={schemeColor.primary}
          trackColor={{ true: schemeColor.primary, false: schemeColor.surfaceContainerHigh }}
        />
      )
    }

    if (props.type === 'select') {
      const selectedOption = props.options.find(opt => opt.value === props.value)

      return (
        <UiSheet
          ref={sheetRef}
          trigger={(
            <UiButton
              title={selectedOption?.label || ''}
              variant="ghost"
              iconTrail="chevron-forward"
            />
          )}
          list
        >
          {props.options.map(option => (
            <UiButton
              key={option.label}
              title={option.label}
              onPress={() => props.onChange?.(option.value)}
              variant="ghost"
              iconTrail={option.value === selectedOption?.value ? 'checkmark' : undefined}
            />
          ))}
        </UiSheet>
      )
    }

    return null
  }, [props, schemeColor])

  return (
    <UiButton
      title={props.title}
      variant="soft"
      square
      innerContainerStyle={styles.settingInnerContainer}
      onPress={handlePress}
    >
      {Item}
    </UiButton>
  )
}

const styles = StyleSheet.create({
  settingInnerContainer: {
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 14,
  },
  outerContainer: {
    gap: 8,
  },
})
