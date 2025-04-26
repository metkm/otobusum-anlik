import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  type BottomSheetBackdropProps,
  type BottomSheetModalProps,
} from '@gorhom/bottom-sheet'
import Ionicons from '@react-native-vector-icons/ionicons'
import { ReactNode, RefObject } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Easing } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useSheetModal } from '@/hooks/contexts/useSheetModal'
import { useSheetBackHandler } from '@/hooks/useSheetBackHandler'
import { useTheme } from '@/hooks/useTheme'

import { UiText } from '../UiText'

import { iconSizes } from '@/constants/uiSizes'
import { IconValue } from '@/types/ui'

export interface UiSheetModalProps extends BottomSheetModalProps {
  cRef?: RefObject<BottomSheetModal | null>
  containerStyle?: StyleProp<ViewStyle>
  list?: boolean
  icon?: IconValue
  title?: string
  footer?: () => ReactNode
}

export const BackdropComponent = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
}

export const UiSheetModal = ({ cRef, icon, title, footer, containerStyle, ...props }: UiSheetModalProps) => {
  const { schemeColor } = useTheme()
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
      topInset={insets.top}
      bottomInset={insets.bottom}
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
      {...props}
    >
      {props.list
        ? (
            <>
              {(icon || title) && (
                <BottomSheetView style={[styles.top, {
                  borderColor: schemeColor.surfaceContainerHigh,
                }]}
                >
                  {icon && (
                    <Ionicons
                      name={icon}
                      size={iconSizes['lg']}
                      color={schemeColor.onSurface}
                    />
                  )}

                  {title && (
                    <UiText>{title}</UiText>
                  )}
                </BottomSheetView>
              )}

              <BottomSheetScrollView>
                {props.children as ReactNode | ReactNode[]}
              </BottomSheetScrollView>

              <View style={styles.bottom}>
                {footer?.()}
              </View>
            </>
          )
        : (
            <BottomSheetView style={{ paddingBottom: insets.bottom }}>
              {(icon || title) && (
                <View style={[styles.top, {
                  borderColor: schemeColor.surfaceContainerHigh,
                }]}
                >
                  {icon && (
                    <Ionicons
                      name={icon}
                      size={iconSizes['lg']}
                      color={schemeColor.onSurface}
                    />
                  )}

                  {title && (
                    <UiText>{title}</UiText>
                  )}
                </View>
              )}

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
  bottom: {
    padding: 12,
  },
})
