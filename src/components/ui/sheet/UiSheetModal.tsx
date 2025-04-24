import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  type BottomSheetBackdropProps,
  type BottomSheetModalProps,
} from '@gorhom/bottom-sheet'
import { ReactNode, RefObject } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { Easing } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useSheetModal } from '@/hooks/contexts/useSheetModal'
import { useSheetBackHandler } from '@/hooks/useSheetBackHandler'
import { useTheme } from '@/hooks/useTheme'

export interface UiSheetModalProps extends BottomSheetModalProps {
  cRef?: RefObject<BottomSheetModal | null>
  top?: () => React.ReactNode
  containerStyle?: StyleProp<ViewStyle>
  list?: boolean
}

export const BackdropComponent = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
}

const TopContainer = (props: ViewProps) => {
  const { colorsTheme } = useTheme()

  return (
    <View
      style={[
        styles.top,
        {
          borderColor: colorsTheme.surfaceContainerHigh,
        },
      ]}
    >
      {props.children}
    </View>
  )
}

export const UiSheetModal = ({ cRef, top, containerStyle, ...props }: UiSheetModalProps) => {
  const { bottomSheetStyle } = useTheme()
  const { handleSheetPositionChange } = useSheetBackHandler(cRef)
  const sheetHeight = useSheetModal()
  const insets = useSafeAreaInsets()

  return (
    <BottomSheetModal
      ref={cRef}
      backdropComponent={BackdropComponent}
      animatedPosition={sheetHeight?.height}
      animatedIndex={sheetHeight?.index}
      onChange={handleSheetPositionChange}
      animationConfigs={{
        duration: 350,
        easing: Easing.out(Easing.exp),
      }}
      {...bottomSheetStyle}
      {...props}
    >
      {props.list
        ? (
            <>
              {top
                ? (
                    <BottomSheetView>
                      <TopContainer>{top?.()}</TopContainer>
                    </BottomSheetView>
                  )
                : undefined}

              <BottomSheetScrollView contentContainerStyle={{ paddingBottom: insets.bottom }}>
                {props.children as ReactNode | ReactNode[]}
              </BottomSheetScrollView>
            </>
          )
        : (
            <BottomSheetView style={{ paddingBottom: insets.bottom, flex: 1 }}>
              {top ? <TopContainer>{top?.()}</TopContainer> : undefined}

              <View style={[styles.container, containerStyle]}>
                {props.children as ReactNode | ReactNode[]}
              </View>
            </BottomSheetView>
          )}
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 8,
    flex: 1,
  },
  top: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 12,
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
})
