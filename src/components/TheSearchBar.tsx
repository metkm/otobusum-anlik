import { useRouter } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'

import { usePaddings } from '@/hooks/usePaddings'

import { TheMapButtons } from './TheMapButtons'
import { UiTextInput } from './ui/UiTextInput'

import { i18n } from '@/translations/i18n'

export const TheSearchBar = () => {
  const { tabRoutePaddings } = usePaddings()
  const router = useRouter()

  return (
    <View style={[styles.container, tabRoutePaddings]}>
      <View>
        <Pressable
          onPress={() => {
            router.navigate('/modal')
          }}
        >
          <UiTextInput
            icon="search"
            placeholder={i18n.t('searchPlaceholder')}
            readOnly
            style={{ pointerEvents: 'none' }}
            styleContainer={{ elevation: 4 }}
          />
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
