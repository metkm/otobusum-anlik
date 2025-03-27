import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { memo, useEffect, useMemo, useRef } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { useMap } from '@/hooks/contexts/useMap'
import { useLine } from '@/hooks/queries/useLine'
import { ThemeContext, useTheme } from '@/hooks/useTheme'

import { UiSheetModal } from '../../ui/sheet/UiSheetModal'
import { UiButton } from '../../ui/UiButton'

import { LineAnnouncements } from './LineAnnouncements'
import { LineBusStops } from './LineBusStops'
import { LineGroups } from './LineGroups'
import { LineName } from './LineName'
import { LineRoutes } from './LineRoutes'

import { queryClient } from '@/api/client'
import { getLineBusStops } from '@/api/getLineBusStops'
import { changeRouteDirection, getSelectedRouteCode, useFiltersStore } from '@/stores/filters'
import { deleteLine, getTheme, useLinesStore } from '@/stores/lines'
import { toggleLineVisibility, useMiscStore } from '@/stores/misc'
import { i18n } from '@/translations/i18n'

export interface LineProps {
  lineCode: string
  variant?: 'solid' | 'soft'
  containerStyle?: StyleProp<ViewStyle>
}

const Line = ({ lineCode, variant = 'soft', ...props }: LineProps) => {
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))
  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))

  const { getSchemeColorHex } = useTheme(lineTheme)
  const { lineWidth } = useLine(lineCode)

  const map = useMap()
  const uiSheetButtonModal = useRef<BottomSheetModal>(null)
  const uiSheetLineGroupsModal = useRef<BottomSheetModal>(null)

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

  const handleVisibility = () => toggleLineVisibility(lineCode)
  const handleDelete = () => deleteLine(lineCode)
  const handleRouteChange = () => changeRouteDirection(lineCode)

  const openMenu = () => uiSheetButtonModal.current?.present()
  const openGroupMenu = () => uiSheetLineGroupsModal.current?.present()

  const containerStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      backgroundColor:
        variant === 'soft' ? getSchemeColorHex('surface') : getSchemeColorHex('primary'),
      width: lineWidth,
      maxWidth: 800,
    }),
    [getSchemeColorHex, lineWidth, variant],
  )

  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(isVisible.value ? 1 : 0.4),
    }),
    [],
  )

  const buttonContainerStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      backgroundColor: getSchemeColorHex('secondaryContainer'),
    }),
    [getSchemeColorHex],
  )

  return (
    <ThemeContext.Provider value={lineTheme}>
      <Animated.View
        style={[containerStyle, containerAnimatedStyle, styles.container, props.containerStyle]}
        key={lineCode}
        {...props}
      >
        <View style={styles.titleContainer}>
          <LineName lineCode={lineCode} variant={variant} />

          <View style={styles.titleContainer}>
            <UiButton onPress={handleVisibility} icon="eye-outline" variant="soft" />

            {selectedCity === 'istanbul' && (
              <LineAnnouncements lineCode={lineCode} style={buttonContainerStyle} />
            )}

            <UiButton onPress={openMenu} icon="menu" variant="soft" />

            <UiSheetModal cRef={uiSheetButtonModal}>
              <BottomSheetView style={styles.menuSheetContainer}>
                <UiButton
                  onPress={openGroupMenu}
                  title={i18n.t('addToGroup')}
                  variant="soft"
                  icon="add-circle-outline"
                  square
                  align="left"
                />
                <UiButton
                  onPress={handleDelete}
                  title={i18n.t('deleteLine')}
                  variant="soft"
                  icon="trash-outline"
                  square
                  align="left"
                />
              </BottomSheetView>
            </UiSheetModal>

            <LineGroups cRef={uiSheetLineGroupsModal} lineCodeToAdd={lineCode} />
          </View>
        </View>

        <LineBusStops lineCode={lineCode} />

        <View style={styles.lineButtonsContainer}>
          <UiButton onPress={handleRouteChange} icon="repeat" variant="soft" />
          <LineRoutes lineCode={lineCode} />
        </View>

        {/* <LineRouteDirection lineCode={lineCode} variant={variant} /> */}
      </Animated.View>
    </ThemeContext.Provider>
  )
}

export const LineMemoized = memo(Line)

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    gap: 8,
    flexShrink: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  lineButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexGrow: 1,
  },
  menuSheetContainer: {
    padding: 8,
    gap: 8,
  },
})
