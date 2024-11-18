import { getPlannedDepartures, PlannedDeparture } from '@/api/getPlannedDepartures'
import { ScrollView, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import { useState } from 'react'

import { UiText } from './ui/UiText'
import { UiSegmentedButtons } from './ui/UiSegmentedButtons'

import { DayType, Direction } from '@/types/departure'
import { useQuery } from '@tanstack/react-query'
import { i18n } from '@/translations/i18n'
import { useLines } from '@/stores/lines'
import { useFilters } from '@/stores/filters'
import { useTheme } from '@/hooks/useTheme'
import { getRouteDirection } from '@/utils/getRouteDirection'

function groupDeparturesByHour(obj: PlannedDeparture[]) {
  const res: Record<string, PlannedDeparture[]> = {}

  for (let index = 0; index < obj.length; index++) {
    const element = obj[index]
    const hour = element?.['DT'].split(':').at(0)

    if (!hour || !element) continue

    if (!res[hour]) {
      res[hour] = [element]
    }
    else {
      res[hour].push(element)
    }
  }

  return res
}

interface Props {
  code: string
}

export function LineTimetable(props: Props) {
  const [dayType, setDayType] = useState<DayType>(() => 'I')
  const selectedRouteCode = useFilters(useShallow(state => state.selectedRoutes[props.code]))
  const lineTheme = useLines(useShallow(state => state.lineTheme[props.code]))

  const { getSchemeColorHex } = useTheme(lineTheme)

  const query = useQuery({
    queryKey: [`timetable-${props.code}`],
    queryFn: () => getPlannedDepartures(props.code),
  })

  const direction: Direction = selectedRouteCode
    ? getRouteDirection(selectedRouteCode) ?? 'G'
    : 'G'

  const filteredData
    = query.data?.filter(
      it => (direction ? it.SYON === direction : true) && it.SGUNTIPI === dayType,
    ) || []

  const groupedByHour = groupDeparturesByHour(filteredData || [])
  const hours = Object.keys(groupedByHour).sort()

  const containerStyle: StyleProp<ViewStyle> = {
    borderColor: getSchemeColorHex('primary'),
    backgroundColor: getSchemeColorHex('primary'),
  }

  const textStyle: StyleProp<TextStyle> = {
    color: getSchemeColorHex('onPrimary'),
  }

  const cellStyle: StyleProp<TextStyle> = {
    backgroundColor: getSchemeColorHex('primaryContainer'),
    color: getSchemeColorHex('onPrimaryContainer'),
  }

  if (!query.data) {
    return <UiText>{i18n.t('loading')}</UiText>
  }

  const title = query.data.at(0)?.HATADI

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View>
        <UiText style={textStyle}>
          {selectedRouteCode}
          {' '}
          -
          {props.code}
        </UiText>
        <UiText style={[styles.title, textStyle]}>{title}</UiText>
      </View>

      <View style={styles.filters}>
        <UiSegmentedButtons
          value={dayType}
          onValueChange={setDayType}
          style={{ flexGrow: 1 }}
          theme={lineTheme}
          buttons={[
            {
              value: 'I',
              label: i18n.t('workday'),
            },
            {
              value: 'C',
              label: i18n.t('saturday'),
            },
            {
              value: 'P',
              label: i18n.t('sunday'),
            },
          ]}
        />
      </View>

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.innerScroll}>
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
            {hours.map((hour) => {
              return (
                <View key={hour} style={styles.row}>
                  {groupedByHour[hour]?.map(departure => (
                    <UiText
                      key={`${props.code}-${departure.SSERVISTIPI}-${
                        departure.SGUZERAH
                      }-${hour}-${departure.DT.split(':').at(-1)}`}
                      style={[styles.cell, textStyle]}
                    >
                      {departure.DT.split(':').at(-1)}
                    </UiText>
                  ))}
                </View>
              )
            })}
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 14,
    gap: 8,
    borderRadius: 8,
  },
  container: {
    height: 300,
  },
  innerScroll: {
    flexDirection: 'row',
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
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  fixed: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
  },
})
