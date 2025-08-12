import { memo, useEffect, useMemo } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { UiSheet } from '@/components/ui/UiSheet'

import { useMap } from '@/hooks/contexts/useMap'
import { useLine } from '@/hooks/queries/useLine'
import { ColorSchemesContext, useTheme } from '@/hooks/useTheme'

import { UiButton } from '../../ui/UiButton'

import { LineAnnouncements } from './LineAnnouncements'
import { LineBusStops } from './LineBusStops'
import { LineGroups } from './LineGroups'
import { LineName } from './LineName'
import { LineRoutes } from './LineRoutes'

import { queryClient } from '@/api/client'
import { getLineBusStops } from '@/api/getLineBusStops'
import { changeRouteDirection, getSelectedRouteCode, useFiltersStore } from '@/stores/filters'
import { deleteLine } from '@/stores/lines'
import { toggleLineVisibility, useMiscStore } from '@/stores/misc'
import { i18n } from '@/translations/i18n'

export interface LineProps {
  lineCode: string
  variant?: 'solid' | 'soft'
  containerStyle?: StyleProp<ViewStyle>
}

const Line = ({ lineCode, variant = 'soft', ...props }: LineProps) => {
  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))

  const { schemeColor, storedTheme } = useTheme(lineCode)
  const { lineWidth } = useLine(lineCode)

  const map = useMap()
  const isVisible = useSharedValue(true)

  useEffect(() => {
    const unsub = useMiscStore.subscribe(
      state => state.invisibleLines,
      (newCodes) => {
        isVisible.value = !newCodes.includes(lineCode)
        if (isVisible.value) return

        const routeCode = getSelectedRouteCode(lineCode)

        const coords = queryClient
          .getQueryData<Awaited<ReturnType<typeof getLineBusStops>>>([`stop-locations`, routeCode])
          ?.map(coords => ({
            latitude: coords.y_coord,
            longitude: coords.x_coord,
          }))

        if (!coords) return
        map?.current?.fitInsideCoordinates(coords)
      },
      {
        fireImmediately: true,
      },
    )

    return unsub
  }, [isVisible, lineCode, map])

  const containerStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      backgroundColor: variant === 'soft' ? schemeColor.surface : schemeColor.primary,
      width: lineWidth,
      // maxWidth: 800,
    }),
    [lineWidth, schemeColor.primary, schemeColor.surface, variant],
  )

  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(isVisible.value ? 1 : 0.4),
    }),
    [],
  )

  const buttonContainerStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      backgroundColor: schemeColor.surfaceContainerHigh,
    }),
    [schemeColor],
  )

  return (
    <ColorSchemesContext value={storedTheme}>
      <Animated.View
        style={[containerStyle, containerAnimatedStyle, styles.container, props.containerStyle]}
        key={lineCode}
        {...props}
      >
        <View style={styles.titleContainer}>
          <LineName lineCode={lineCode} variant={variant} />

          <View style={styles.titleContainer}>
            <UiButton
              onPress={() => toggleLineVisibility(lineCode)}
              icon="eye-outline"
              variant="soft"
            />

            {selectedCity === 'istanbul' && (
              <LineAnnouncements
                lineCode={lineCode}
                style={buttonContainerStyle}
              />
            )}

            <UiSheet
              trigger={(
                <UiButton
                  icon="menu"
                  variant="soft"
                />
              )}
            >
              <LineGroups
                type="add"
                lineCode={lineCode}
                trigger={(
                  <UiButton
                    icon="add-circle-outline"
                    title={i18n.t('addToGroup')}
                    square
                  />
                )}
              />

              <UiButton
                icon="trash-outline"
                title={i18n.t('deleteLine')}
                onPress={() => deleteLine(lineCode)}
                variant="error"
                square
              />
            </UiSheet>
          </View>
        </View>

        <LineBusStops lineCode={lineCode} />

        <View style={styles.lineButtonsContainer}>
          <UiButton
            onPress={() => changeRouteDirection(lineCode)}
            icon="repeat"
            variant="soft"
          />

          <LineRoutes lineCode={lineCode} />
        </View>
      </Animated.View>
    </ColorSchemesContext>
  )
}

export const LineMemoized = memo(Line)

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    gap: 8,
    flexShrink: 0,
    elevation: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  lineButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: 4,
    flexShrink: 1,
  },
  menuSheetContainer: {
    padding: 8,
    gap: 8,
  },
})
