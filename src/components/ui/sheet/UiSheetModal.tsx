import {
  BottomSheetBackdrop,
  BottomSheetModal,
  type BottomSheetBackdropProps,
  type BottomSheetModalProps,
} from '@gorhom/bottom-sheet'
import { RefObject } from 'react'
import { StyleSheet } from 'react-native'
import { Easing } from 'react-native-reanimated'

import { useSheetModal } from '@/hooks/contexts/useSheetModal'
import { useSheetBackHandler } from '@/hooks/useSheetBackHandler'
import { useTheme } from '@/hooks/useTheme'

export interface UiSheetModalProps extends BottomSheetModalProps {
  cRef?: RefObject<BottomSheetModal>
}

export const BackdropComponent = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
}

export const UiSheetModal = (props: UiSheetModalProps) => {
  const { bottomSheetStyle } = useTheme()
  const { handleSheetPositionChange } = useSheetBackHandler(props.cRef)
  const sheetHeight = useSheetModal()

  return (
    <BottomSheetModal
      ref={props.cRef}
      backdropComponent={BackdropComponent}
      animatedPosition={sheetHeight?.height}
      animatedIndex={sheetHeight?.index}
      onChange={handleSheetPositionChange}
      style={styles.outer}
      animationConfigs={{
        duration: 350,
        easing: Easing.out(Easing.exp),
      }}
      {...bottomSheetStyle}
      {...props}
    >
      {props.children}
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
})
