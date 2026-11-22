import type { TrueSheet } from '@lodev09/react-native-true-sheet'
import { t } from 'i18next'
import { useRef } from 'react'
import { View } from 'react-native'
import ColorPicker, { type ColorFormatsObject, Panel2, Preview } from 'reanimated-color-picker'
import { useCSSVariable, withUniwind } from 'uniwind'

import { UBadge, UButton, USheet } from '@/components/u'
import { useGroupItem } from '@/composables'
import { useThemeStore } from '@/stores'

const StyledColorPicker = withUniwind(ColorPicker)

export const LineColorPicker = () => {
  const { code } = useGroupItem()
  const primaryColor = useCSSVariable('--color-primary')?.toString()

  const colorPickerRef = useRef<TrueSheet>(null)

  const onSelectColor = ({ hsl }: ColorFormatsObject) => {
    const [_h, _s, _l] = hsl.match(/\d+/g) as [string, string, string]
    const _hsl = [parseInt(_h), parseInt(_s), parseInt(_l)] as [number, number, number]

    useThemeStore.getState().createTheme(code, true, _hsl)
  }

  return (
    <>
      <UButton
        onPress={() => void colorPickerRef.current?.present()}
        size="lg"
        variant="soft"
      >
        <View className="flex-row items-center gap-2">
          <View className="bg-primary size-4 rounded-md" />
          <UButton.Text>{t('colorPicker')}</UButton.Text>
        </View>
      </UButton>

      <USheet
        ref={colorPickerRef}
        detents={['auto']}
      >
        <View className="mx-auto w-full max-w-xs gap-2">
          <StyledColorPicker
            className="mx-auto w-full gap-2"
            onCompleteJS={onSelectColor}
            value={primaryColor}
          >
            <Preview
              hideInitialColor
              textStyle={{ fontFamily: 'Inter-Medium', fontWeight: 'medium' }}
            />

            <Panel2 />
          </StyledColorPicker>

          <View className="flex-row justify-center gap-2">
            <UBadge
              icon="bus-front"
              label={code}
            />

            <UBadge
              variant="soft"
              icon="bus-front"
              label={code}
            />

            <UBadge
              variant="ghost"
              icon="bus-front"
              label={code}
            />
          </View>
        </View>
      </USheet>
    </>
  )
}
