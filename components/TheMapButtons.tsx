import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { hexFromArgb } from '@material/material-color-utilities'
import Ionicons from '@react-native-vector-icons/ionicons'
import { useCallback, useEffect, useRef } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, {
  AnimatedProps,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

import { useTheme } from '@/hooks/useTheme'

import { LineGroups } from './lines/groups/LineGroups'
import { UiButton } from './ui/UiButton'

import { colors } from '@/constants/colors'
import { changeRouteDirection } from '@/stores/filters'
import { selectGroup, unSelectGroup, useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'
import { LineGroup } from '@/types/lineGroup'

export const TheMapButtons = () => {
  const lines = useLinesStore(state => state.lines)
  const lineGroups = useLinesStore(useShallow(state => Object.keys(state.lineGroups)))
  const selectedGroup = useLinesStore(state => state.selectedGroup)
  const selectedGroupLines = useLinesStore(state =>
    selectedGroup ? state.lineGroups[selectedGroup]?.lineCodes : undefined,
  )

  const insets = useSafeAreaInsets()
  const bgColor = useSharedValue(colors.primary)
  const txtColor = useSharedValue('#ffffff')
  const bottomSheetModalGroups = useRef<BottomSheetModal>(null)
  const { mode } = useTheme()

  const updateColors = useCallback(
    (index: number) => {
      const lines = selectedGroupLines || useLinesStore.getState().lines
      const lineCode = lines.at(index)
      if (lineCode === undefined) return

      const theme = useLinesStore.getState().lineTheme[lineCode]
      if (!theme) return

      const scheme = theme.schemes[mode]

      const targetBackground = hexFromArgb(scheme.primary)
      const targetText = hexFromArgb(scheme.onPrimary)

      bgColor.value = withTiming(targetBackground)
      txtColor.value = withTiming(targetText)
    },
    [bgColor, mode, selectedGroupLines, txtColor],
  )

  useEffect(() => {
    const unsub = useMiscStore.subscribe(
      state => state.selectedLineScrollIndex,
      (index) => {
        updateColors(index)
      },
      {
        fireImmediately: true,
      },
    )

    return unsub
  }, [updateColors])

  useEffect(() => {
    updateColors(0)
  }, [selectedGroup, updateColors, lines])

  const insetStyle: StyleProp<ViewStyle> = {
    top: insets.top,
    right: insets.right,
  }

  const handleChangeAllDirections = () => {
    const group = selectedGroupLines || useLinesStore.getState().lines

    for (let index = 0; index < group.length; index++) {
      const lineCode = group[index]
      if (!lineCode) continue

      changeRouteDirection(lineCode)
    }
  }

  const handleLineGroupsSelect = () => {
    bottomSheetModalGroups.current?.present()
  }

  const handlePressGroup = (group: LineGroup) => {
    selectGroup(group.id)
    bottomSheetModalGroups.current?.close()
  }

  const animatedContainerStyle = useAnimatedStyle(
    () => ({
      backgroundColor: bgColor.value,
      borderRadius: 14,
    }),
    [],
  )

  const animatedIconProps = useAnimatedProps(() => {
    return {
      color: txtColor.value,
    } as Partial<AnimatedProps<typeof Ionicons>>
  })

  return (
    <View style={[styles.container, insetStyle]}>
      {lines.length > 0 && (
        <Animated.View style={animatedContainerStyle}>
          <UiButton
            icon="repeat"
            onPress={handleChangeAllDirections}
            animatedIconProps={animatedIconProps}
            square
          />
        </Animated.View>
      )}

      {lineGroups.length > 0 && (
        <>
          <Animated.View style={animatedContainerStyle}>
            <UiButton
              icon="albums"
              onPress={handleLineGroupsSelect}
              animatedIconProps={animatedIconProps}
              square
            />
          </Animated.View>

          {
            !!selectedGroup && (
              <Animated.View style={animatedContainerStyle}>
                <UiButton
                  icon="close"
                  onPress={unSelectGroup}
                  animatedIconProps={animatedIconProps}
                  square
                />
              </Animated.View>
            )
          }

          <LineGroups ref={bottomSheetModalGroups} onPressGroup={handlePressGroup} />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    padding: 14,
    gap: 8,
  },
})
