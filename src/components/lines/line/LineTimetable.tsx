import { memo, useMemo, useState } from 'react'
import { ScrollView, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UiSegmentedButtons } from '@/components/ui/UiSegmentedButtons'
import { UiText } from '@/components/ui/UiText'

import { useAnnouncements } from '@/hooks/queries/useAnnouncements'
import { useLine } from '@/hooks/queries/useLine'
import { useRoutes } from '@/hooks/queries/useRoutes'
import { useTimetable } from '@/hooks/queries/useTimetable'
import { ColorSchemesContext, useTheme } from '@/hooks/useTheme'

import { Time } from '@/api/getPlannedDepartures'
import { useFiltersStore } from '@/stores/filters'
import { i18n } from '@/translations/i18n'
import { Cities } from '@/types/cities'
import { charactersToAscii } from '@/utils/charactersToAscii'
import { groupDeparturesByHour } from '@/utils/groupDeparturesByHour'

const sunday = 1 << 1
const monday = 1 << 2
const tuesday = 1 << 3
const wednesday = 1 << 4
const thursday = 1 << 5
const friday = 1 << 6
const saturday = 1 << 7

const options: Record<Cities, any> = {
  istanbul: [
    {
      value: monday | tuesday | wednesday | thursday | friday,
      label: i18n.t('workday'),
    },
    {
      value: saturday,
      label: i18n.t('saturday'),
    },
    {
      value: sunday,
      label: i18n.t('sunday'),
    },
  ],
  izmir: [
    {
      value: saturday,
      label: i18n.t('saturday'),
    },
    {
      value: monday,
      label: i18n.t('monday'),
    },
    {
      value: tuesday,
      label: i18n.t('tuesday'),
    },
    {
      value: wednesday,
      label: i18n.t('wednesday'),
    },
    {
      value: thursday,
      label: i18n.t('thursday'),
    },
    {
      value: friday,
      label: i18n.t('friday'),
    },
    {
      value: sunday,
      label: i18n.t('sunday'),
    },
  ],
}

const now = new Date()
const day = now.getDay()

interface LineTimetableProps {
  lineCode: string
}

export const LineTimetable = ({ lineCode }: LineTimetableProps) => {
  const [selectedDay, setSelectedDay] = useState(() => 1 << (day + 1))
  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))

  const { schemeColor, storedTheme } = useTheme(lineCode)

  const { query: announcementsQuery } = useAnnouncements()
  const { routeCode, getRouteFromCode } = useRoutes(lineCode)

  const route = getRouteFromCode()
  const [leftTitle] = route?.route_long_name?.trim().split('-') ?? ['', ''] ?? ['', '']

  const { lineWidth } = useLine(lineCode)
  const { query } = useTimetable(lineCode)

  const filteredData = useMemo(
    () => {
      if (!query.data) return []

      const times: Time[] = []

      if (selectedDay & sunday) {
        times.push(...query.data.sunday)
      }

      if (selectedDay & monday) {
        times.push(...query.data.monday)
      }

      if (selectedDay & tuesday) {
        times.push(...query.data.tuesday)
      }

      if (selectedDay & wednesday) {
        times.push(...query.data.wednesday)
      }

      if (selectedDay & thursday) {
        times.push(...query.data.thursday)
      }

      if (selectedDay & friday) {
        times.push(...query.data.friday)
      }

      if (selectedDay & saturday) {
        times.push(...query.data.saturday)
      }

      return Array.from(new Set(times))
    },
    [query.data, selectedDay],
  )

  const announcements = useMemo(
    () => {
      return announcementsQuery.data?.filter(
        ann => ann.HATKODU = lineCode,
      ) || []
    },
    [announcementsQuery.data, lineCode],
  )

  const cancelledTimes = useMemo(
    () => announcements.map(
      (ann) => {
        if (!ann.MESAJ.includes('dan Saat')) return

        const msgSplit = ann.MESAJ.split('dan Saat')
        const from = msgSplit.at(0)
        if (!from) return

        const tLeftTitle = leftTitle ? charactersToAscii(leftTitle) : undefined
        if (from.trim() !== tLeftTitle?.trim()) return

        const time = msgSplit.at(1)?.split('de hareket etmesi planlanan').at(0)?.trim()
        return time
      },
    ),
    [announcements, leftTitle],
  )

  const groupedByHour = groupDeparturesByHour(filteredData)
  const hours = Object.keys(groupedByHour).sort()

  const containerStyle: StyleProp<ViewStyle> = {
    backgroundColor: schemeColor.surface,
    width: lineWidth,
  }

  const textStyle: StyleProp<TextStyle> = {
    color: schemeColor.onSurface,
  }

  const cellStyle: StyleProp<TextStyle> = {
    backgroundColor: schemeColor.primaryContainer,
    color: schemeColor.onPrimaryContainer,
  }

  return (
    <ColorSchemesContext value={storedTheme}>
      <View style={[styles.wrapper, containerStyle]}>
        <View style={styles.info}>
          <UiText style={textStyle}>
            {routeCode}
            {' '}
            -
            {lineCode}
          </UiText>
          <UiText style={[styles.title, textStyle]}>
            {route?.route_long_name.trim()}
          </UiText>
        </View>

        <UiSegmentedButtons
          value={selectedDay}
          onValueChange={setSelectedDay}
          buttons={options[selectedCity]}
        />

        {hours.length > 1
          ? (
              <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.innerScroll} fadingEdgeLength={40}>
                  <View style={styles.fixed}>
                    {hours.map(hour => (
                      <UiText key={hour} style={[styles.cell, cellStyle]}>
                        {hour}
                      </UiText>
                    ))}
                  </View>

                  <ScrollView
                    contentContainerStyle={{ flexDirection: 'column', gap: 4 }}
                    horizontal
                  >
                    {hours.map(hour => (
                      <View key={hour} style={styles.row}>
                        {groupedByHour[hour]?.map(time => (
                          <UiText
                            key={`${lineCode}-${time}-${routeCode}`}
                            style={[
                              styles.cell,
                              textStyle,
                              cancelledTimes.includes(`${hour}:${time}`) && {
                                textDecorationLine: 'line-through',
                                opacity: 0.5,
                              },
                            ]}
                          >
                            {time}
                          </UiText>
                        ))}
                      </View>
                    ))}
                  </ScrollView>
                </ScrollView>
              </View>
            )
          : (
              <View style={styles.containerEmpty}>
                <UiText>{i18n.t('timetableEmptyRange')}</UiText>
              </View>
            )}

      </View>
    </ColorSchemesContext>
  )
}

export const LineTimetableMemoized = memo(LineTimetable)

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 8,
    flexShrink: 1,
    elevation: 2,
  },
  info: {
    padding: 8,
  },
  container: {
    flexShrink: 1,
  },
  containerEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  innerScroll: {
    flexDirection: 'row',
    padding: 8,
  },
  cell: {
    width: 30,
    height: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  fixed: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
  },
})
