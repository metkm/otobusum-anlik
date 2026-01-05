import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  type BottomSheetModalProps,
  type BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { ReactNode, RefObject, use, useImperativeHandle, useRef } from 'react'
import { FlatListProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { Easing } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useSheetBackHandler } from '@/hooks/useSheetBackHandler'
import { ColorSchemesContext, useTheme } from '@/hooks/useTheme'

export interface UiSheetProps<T> {
  children?: ReactNode
  trigger?: ReactNode
  sheetProps?: Omit<BottomSheetModalProps, 'children'>
  rootStyle?: StyleProp<ViewStyle>
  innerContainerStyle?: StyleProp<ViewStyle>
  ref?: RefObject<BottomSheetModal | null>
  flatlistProps?: FlatListProps<T>
}

export const BackdropComponent = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
}

export const UiSheet = <T,>({ children, trigger, sheetProps, rootStyle, innerContainerStyle, flatlistProps, ref }: UiSheetProps<T>) => {
  const sheet = useRef<BottomSheetModal>(null)
  const { schemeColor } = useTheme()
  const { handleSheetPositionChange } = useSheetBackHandler(sheet)
  const insets = useSafeAreaInsets()

  const tap = Gesture.Tap()

  useImperativeHandle(ref, () => sheet.current!)

  const openSheet = () => {
    sheet.current?.present()
  }

  tap
    .runOnJS(true)
    .onStart(openSheet)

  const containerPadding = {
    paddingBottom: insets.bottom + 8,
  }

  return (
    <View style={[rootStyle, styles.rootContainer]}>
      {trigger && (
        <GestureDetector gesture={tap}>
          {trigger}
        </GestureDetector>
      )}

      <BottomSheetModal
        ref={sheet}
        topInset={insets.top}
        backdropComponent={BackdropComponent}
        onChange={handleSheetPositionChange}
        // stackBehavior="replace" for some reason this causes rerender to not work.
        animationConfigs={{
          duration: 350,
          easing: Easing.out(Easing.exp),
        }}
        handleStyle={{
          backgroundColor: schemeColor.surface,
        }}
        handleIndicatorStyle={{
          backgroundColor: schemeColor.onSurface,
        }}
        backgroundStyle={{
          backgroundColor: schemeColor.surface,
        }}
        {...sheetProps}
      >
        <ColorSchemesContext value={use(ColorSchemesContext)}>
          {flatlistProps && flatlistProps.data && flatlistProps.data.length > 0
            ? (
                <BottomSheetFlatList
                  {...flatlistProps}
                  contentContainerStyle={containerPadding}
                  ItemSeparatorComponent={() => (
                    <View style={[styles.seperator, { backgroundColor: schemeColor.surfaceContainerHigh }]} />
                  )}
                />
              )
            : (
                <BottomSheetView style={[styles.innerContainer, { ...containerPadding, ...innerContainerStyle }]}>
                  {children}
                </BottomSheetView>
              )}
        </ColorSchemesContext>
      </BottomSheetModal>
    </View>
  )
}

const styles = StyleSheet.create({
  innerContainer: {
    paddingHorizontal: 8,
    gap: 4,
  },
  rootContainer: {
    flexShrink: 1,
  },
  pressableContainer: {
    flexShrink: 1,
  },
  seperator: {
    height: 1,
  },
})
