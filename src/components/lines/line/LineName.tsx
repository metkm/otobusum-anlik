import { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useLine } from '@/hooks/queries/useLine'
import { useTheme } from '@/hooks/useTheme'

import { UiActivityIndicator } from '../../ui/UiActivityIndicator'
import { UiText } from '../../ui/UiText'

import { lineUpdateInterval } from '@/constants/app'
import { iconSizes } from '@/constants/uiSizes'
import { useLinesStore, getTheme } from '@/stores/lines'
import { i18n } from '@/translations/i18n'

interface LineNameProps {
  lineCode: string
  variant?: 'soft' | 'solid'
}

const interval = 1_000

export const LineName = ({ lineCode, variant = 'solid' }: LineNameProps) => {
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))
  const [count, setCount] = useState(0)

  const { getSchemeColorHex } = useTheme(lineTheme)
  const { query } = useLine(lineCode)

  const color = getSchemeColorHex(variant === 'solid' ? 'onPrimary' : 'onSurface')

  const expected = useRef(Date.now() + interval)

  const step = useCallback(() => {
    const drift = Date.now() - expected.current
    if (drift > interval) {
      console.log('drift')
    }

    setCount(count => Math.max(0, count - 1))

    expected.current += interval
    setTimeout(step, Math.max(interval - drift))
  }, [])

  useEffect(() => {
    const diff = Date.now() - query.dataUpdatedAt
    const durationLeft = lineUpdateInterval - diff

    setCount(Math.floor(durationLeft / 1000))
    setTimeout(step, interval)
  }, [query.dataUpdatedAt, step])

  return (
    <View>
      <View style={styles.container}>
        <UiText
          style={{
            fontWeight: 'bold',
            color,
            lineHeight: 24,
          }}
          size="xl"
        >
          {lineCode}
        </UiText>

        {query.isFetching && (
          <UiActivityIndicator
            color={color}
            size={iconSizes['sm']}
          />
        )}
      </View>

      <UiText size="sm" info>{i18n.t('updateCount', { count })}</UiText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
})
