import { BottomSheetModal } from '@gorhom/bottom-sheet'
import Ionicons from '@react-native-vector-icons/ionicons'
import { memo, useMemo, useRef } from 'react'
import { StyleSheet } from 'react-native'

import { UiSheet } from '@/components/ui/UiSheet'
import { UiText } from '@/components/ui/UiText'

import { useRoutes } from '@/hooks/queries/useRoutes'
import { useTheme } from '@/hooks/useTheme'

import { UiButton } from '../../ui/UiButton'

import { RouteCode } from '@/api/getAllRoutes'
import { selectRoute } from '@/stores/filters'
import { i18n } from '@/translations/i18n'
import { Option } from '@/types/sheet'

interface Props {
  lineCode: string
}

export const LineRoutes = memo(function LineRoutes(props: Props) {
  const sheetRef = useRef<BottomSheetModal>(null)

  const { query, getRouteFromCode } = useRoutes(props.lineCode)
  const { schemeColor } = useTheme()

  const color = schemeColor.onSurface
  const lineRoute = getRouteFromCode()

  const [leftTitle, rightTitle] = lineRoute?.route_long_name?.trim().split('-') ?? ['', '']

  const routes = useMemo(() => {
    if (!query.data) return []

    const filtered: Option<RouteCode>[] = []
    const defaults: Option<RouteCode>[] = []

    for (let index = 0; index < query.data.length; index++) {
      const element = query.data[index]
      if (!element) continue;

      (element.route_code.endsWith('D0') ? defaults : filtered).push({
        label: `${element.route_code} ${element.route_long_name}`,
        value: element.route_code,
      })
    }

    return [...defaults, ...filtered]
  }, [query.data])

  const handleSelectRoute = (routeCode: RouteCode) => {
    selectRoute(props.lineCode, routeCode)
    sheetRef.current?.close()
  }

  return (
    <UiSheet
      ref={sheetRef}
      rootStyle={styles.grow}
      trigger={(
        <UiButton
          containerStyle={styles.grow}
          icon="git-branch-outline"
          variant="soft"
          isLoading={query.isPending}
        >
          {query.isPending
            ? (
                <UiText>{i18n.t('loading')}</UiText>
              )
            : (
                <>
                  <UiText size="sm" numberOfLines={1} style={{ color }}>
                    {leftTitle}
                  </UiText>
                  <Ionicons name="arrow-forward" size={18} color={color} />
                  <UiText size="sm" numberOfLines={1} style={{ color }}>
                    {rightTitle}
                  </UiText>
                </>
              )}
        </UiButton>
      )}
      sheetProps={{
        snapPoints: ['50%', '100%'],
        enableDynamicSizing: false,
      }}
      list
    >
      {routes.map(route => (
        <UiButton
          key={route.value}
          title={route.label}
          variant="ghost"
          onPress={() => handleSelectRoute(route.value)}
          iconTrail={route.value === lineRoute?.route_code ? 'checkmark' : undefined}
        />
      ))}
    </UiSheet>
  )
})

const styles = StyleSheet.create({
  grow: {
    flexGrow: 1,
  },
})
