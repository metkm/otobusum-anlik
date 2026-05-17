import { t } from 'i18next'
import { useState } from 'react'
import { Modal, View } from 'react-native'
import { GestureHandlerRootView, Pressable } from 'react-native-gesture-handler'
import ColorPicker, { type ColorFormatsObject, Panel3, Preview } from 'reanimated-color-picker'
import { withUniwind } from 'uniwind'

import { UButton } from '@/components/u/UButton'

import { useLine, useLineTheme } from '@/composables'
import { useThemeStore } from '@/stores'

const StyledColorPicker = withUniwind(ColorPicker)
const StyledPressable = withUniwind(Pressable)

export const LineModalsColorPicker = () => {
  const [isVisible, setIsVisible] = useState(false)
  const { code } = useLine()

  const theme = useLineTheme()
  const primary = theme?.background()?.backgroundColor

  const onSelectColor = ({ hsl }: ColorFormatsObject) => {
    const [_h, _s, _l] = hsl.match(/\d+/g) as [string, string, string]
    const _hsl = [parseInt(_h), parseInt(_s), parseInt(_l)] as [number, number, number]

    useThemeStore.getState().createTheme(code, true, _hsl)
  }

  const close = () => {
    setIsVisible(false)
  }

  return (
    <>
      <UButton
        label={t('colorPicker')}
        onPress={() => setIsVisible(true)}
        size="lg"
        variant="soft"
      >
        <View
          style={{ backgroundColor: primary }}
          className="size-4 rounded-md"
        />
      </UButton>

      <Modal
        visible={isVisible}
        onRequestClose={close}
        transparent
      >
        <GestureHandlerRootView>
          <StyledPressable
            onPress={close}
            className="flex-1 items-center justify-center bg-black/50"
          >
            <View className="bg-default rounded-md w-full max-w-xs p-4">
              <StyledColorPicker
                className="gap-2"
                onCompleteJS={onSelectColor}
                value={primary}
              >
                <Preview
                  hideInitialColor
                  textStyle={{ fontFamily: 'Inter-Medium', fontWeight: 'medium' }}
                />
                <Panel3 />
              </StyledColorPicker>
            </View>
          </StyledPressable>
        </GestureHandlerRootView>
      </Modal>
    </>
  )
}
