import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { memo, useCallback, useMemo, useRef } from 'react'
import { StyleSheet } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UiSheetSelect } from '@/components/ui/sheet/UiSheetSelect'

import { useRoutes } from '@/hooks/queries/useRoutes'

import { UiButton } from '../../ui/UiButton'

import { RouteCode } from '@/api/getAllRoutes'
import { selectRoute } from '@/stores/filters'
import { getTheme, useLinesStore } from '@/stores/lines'
import { i18n } from '@/translations/i18n'
import { Option } from '@/types/sheet'

interface Props {
  lineCode: string
}

export const LineRoutes = memo(function LineRoutes(props: Props) {
  const { query: allRoutes, getRouteFromCode } = useRoutes(props.lineCode)

  const lineTheme = useLinesStore(useShallow(() => getTheme(props.lineCode)))
  const route = getRouteFromCode()

  const bottomSheetModal = useRef<BottomSheetModal>(null)

  const routes = useMemo(() => {
    if (!allRoutes.data) return []

    const filtered: Option<RouteCode>[] = []
    const defaults: Option<RouteCode>[] = []

    for (let index = 0; index < allRoutes.data.length; index++) {
      const element = allRoutes.data[index]
      if (!element) continue

      (element.route_code.endsWith('D0') ? defaults : filtered)
        .push({
          label: `${element.route_code} ${element.route_long_name}`,
          value: element.route_code,
        })
    }

    return [...defaults, ...filtered]
  }, [allRoutes.data])

  const handleOnSelect = (value: RouteCode) => {
    selectRoute(props.lineCode, value)
  }

  const handleOnPress = useCallback(() => {
    bottomSheetModal.current?.present()
  }, [])

  return (
    <>
      <UiButton
        title={route?.route_long_name}
        onPress={handleOnPress}
        theme={lineTheme}
        containerStyle={styles.grow}
        icon="git-branch-outline"
      />

      <UiSheetSelect
        cRef={bottomSheetModal}
        title={i18n.t('routes')}
        options={routes}
        onValueChange={handleOnSelect}
        value={route?.route_code}
        list
      />
    </>
  )
})

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  title: {
    fontSize: 24,
    padding: 8,
  },
  grow: {
    flexGrow: 1,
  },
})
