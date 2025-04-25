import { BottomSheetModal } from '@gorhom/bottom-sheet'
import Ionicons from '@react-native-vector-icons/ionicons'
import { memo, useCallback, useMemo, useRef } from 'react'
import { StyleSheet } from 'react-native'

import { UiSheetSelect } from '@/components/ui/sheet/UiSheetSelect'
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
  const { query, getRouteFromCode } = useRoutes(props.lineCode)
  const { schemeColor } = useTheme()

  const color = schemeColor.onSurface

  const route = getRouteFromCode()
  const bottomSheetModal = useRef<BottomSheetModal>(null)

  const [leftTitle, rightTitle] = route?.route_long_name?.trim().split('-') ?? ['', ''] ?? ['', '']

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

  const handleOnSelect = (value: RouteCode) => {
    selectRoute(props.lineCode, value)
  }

  const handleOnPress = useCallback(() => {
    bottomSheetModal.current?.present()
  }, [])

  return (
    <>
      <UiButton
        onPress={handleOnPress}
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

      <UiSheetSelect
        cRef={bottomSheetModal}
        title={i18n.t('routes')}
        icon="git-branch-outline"
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
