import { Pressable, StyleSheet, View } from 'react-native'
import { UiTextInput } from './ui/UiTextInput'
import { useRouter } from 'expo-router'
import { usePaddings } from '@/hooks/usePaddings'
import { i18n } from '@/translations/i18n'
import { TheMapButtons } from './TheMapButtons'
import { useTheme } from '@/hooks/useTheme'

export const TheSearchBar = () => {
  const paddings = usePaddings()
  const router = useRouter()
  const { colorsTheme } = useTheme()

  return (
    <View style={[styles.container, paddings]}>
      <View>
        <Pressable
          onPress={() => {
            router.navigate('/modal')
          }}
        >
          <View pointerEvents="none">
            <UiTextInput
              icon="search"
              placeholder={i18n.t('searchPlaceholder')}
              readOnly
              styleContainer={{
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: colorsTheme.surfaceContainerHigh,
              }}
            />
          </View>
        </Pressable>
      </View>

      <TheMapButtons />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    display: 'flex',
    gap: 8,
    elevation: 5,
  },
})
