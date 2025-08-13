import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  type BottomSheetModalProps,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { ReactNode, RefObject, use, useImperativeHandle, useRef } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Pressable } from 'react-native-gesture-handler'
import { Easing } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ColorSchemesContext, useTheme } from '@/hooks/useTheme'

export interface UiSheetProps {
  children?: ReactNode
  trigger?: ReactNode
  sheetProps?: Omit<BottomSheetModalProps, 'children'>
  list?: boolean
  rootStyle?: StyleProp<ViewStyle>
  innerContainerStyle?: StyleProp<ViewStyle>
  ref?: RefObject<BottomSheetModal | null>
}

export const BackdropComponent = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
}

export const UiSheet = ({ children, trigger, list, sheetProps, rootStyle, innerContainerStyle, ref }: UiSheetProps) => {
  const sheet = useRef<BottomSheetModal>(null)
  const { schemeColor } = useTheme()
  const insets = useSafeAreaInsets()

  useImperativeHandle(ref, () => sheet.current!)

  const openSheet = () => {
    sheet.current?.present()
  }

  const containerPadding = {
    paddingBottom: insets.bottom + 9,
  }

  return (
    <View style={[rootStyle, styles.rootContainer]}>
      <Pressable onPress={openSheet} style={styles.pressableContainer}>{trigger}</Pressable>

      <BottomSheetModal
        ref={sheet}
        topInset={insets.top}
        backdropComponent={BackdropComponent}
        animationConfigs={{
          duration: 350,
          easing: Easing.out(Easing.exp),
        }}
        handleStyle={{
          backgroundColor: schemeColor.surfaceContainer,
        }}
        handleIndicatorStyle={{
          backgroundColor: schemeColor.onSurface,
        }}
        backgroundStyle={{
          backgroundColor: schemeColor.surfaceContainer,
        }}
        {...sheetProps}
      >
        <ColorSchemesContext value={use(ColorSchemesContext)}>
          {!list
            ? (
                <BottomSheetView style={[styles.innerContainer, containerPadding, innerContainerStyle]}>
                  {children}
                </BottomSheetView>
              )
            : (
                <BottomSheetScrollView
                  contentContainerStyle={[styles.innerContainer, containerPadding, innerContainerStyle]}
                >
                  {children}
                </BottomSheetScrollView>
              )}
        </ColorSchemesContext>
      </BottomSheetModal>
    </View>
  )
}

const styles = StyleSheet.create({
  innerContainer: {
    paddingHorizontal: 8,
    // paddingTop: 8,
    gap: 4,
  },
  rootContainer: {
    flexShrink: 1,
  },
  pressableContainer: {
    flexShrink: 1,
  },
})
