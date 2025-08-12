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
  ref?: RefObject<BottomSheetModal | null>
}

export const BackdropComponent = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
}

export const UiSheet = ({ children, trigger, list, sheetProps, rootStyle, ref }: UiSheetProps) => {
  const sheet = useRef<BottomSheetModal>(null)
  const { schemeColor } = useTheme()
  const insets = useSafeAreaInsets()

  useImperativeHandle(ref, () => sheet.current!)

  const openSheet = () => {
    sheet.current?.present()
  }

  return (
    <View style={rootStyle}>
      <Pressable onPress={openSheet}>{trigger}</Pressable>

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
      >
        <ColorSchemesContext value={use(ColorSchemesContext)}>
          {!list
            ? (
                // insets bottom not working for some reason
                <BottomSheetView style={[{ paddingBottom: insets.bottom }, styles.innerContainer]}>
                  {children}
                </BottomSheetView>
              )
            : (
                <BottomSheetScrollView
                  contentContainerStyle={[{ paddingBottom: insets.bottom }, styles.innerContainer]}
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
    padding: 8,
    gap: 4,
  },
})
