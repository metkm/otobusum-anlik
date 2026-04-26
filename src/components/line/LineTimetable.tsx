import { useMemo, useState } from 'react'
import { ScrollView, View, ViewProps } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { SkeletonTimetable } from '../u/skeleton/SkeletonTimetable'
import { UButton } from '../u/UButton'
import { UQueryState } from '../u/UQueryState'
import { UText } from '../u/UText'

import { useLine, useLineCardWidth, useLineNews, useLineRoutes, useLineTheme, useLineTimetable } from '@/composables'
import { Time } from '@/composables/useLineTimetable'
import { useFilterStore } from '@/stores'
import { i18n } from '@/translations/i18n'
import { City } from '@/types/city'
import { cn } from '@/utils/cn'
import { groupDeparturesByHour } from '@/utils/groupDepartures'
import { toAscii } from '@/utils/toAscii'

const sunday = 1 << 1
const monday = 1 << 2
const tuesday = 1 << 3
const wednesday = 1 << 4
const thursday = 1 << 5
const friday = 1 << 6
const saturday = 1 << 7

const options: Record<City, { label: string, value: number }[]> = {
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
const nowDay = now.getDay()

export const LineTimetable = ({ className }: ViewProps) => {
  const city = useFilterStore(useShallow(state => state.city))
  const [day, setDay] = useState(() => 1 << (nowDay + 1))

  const { code } = useLine()
  const { cardWidth } = useLineCardWidth()
  const { route, routeCode } = useLineRoutes()
  const { query: lineTimetableQuery } = useLineTimetable()
  const { query: lineNewsQuery } = useLineNews()

  const theme = useLineTheme()
  const background = theme?.background({ variant: 'ghost' })

  const filteredData = useMemo(() => {
    if (!lineTimetableQuery.data) return []

    const times: Time[] = []

    if (day & sunday) {
      times.push(...lineTimetableQuery.data.sunday)
    }

    if (day & monday) {
      times.push(...lineTimetableQuery.data.monday)
    }

    if (day & tuesday) {
      times.push(...lineTimetableQuery.data.tuesday)
    }

    if (day & wednesday) {
      times.push(...lineTimetableQuery.data.wednesday)
    }

    if (day & thursday) {
      times.push(...lineTimetableQuery.data.thursday)
    }

    if (day & friday) {
      times.push(...lineTimetableQuery.data.friday)
    }

    if (day & saturday) {
      times.push(...lineTimetableQuery.data.saturday)
    }

    return Array.from(new Set(times))
  }, [lineTimetableQuery.data, day])

  const cancelledTimes = lineNewsQuery.data?.map((ann) => {
    if (!ann.MESAJ.includes('dan Saat')) return

    const msgSplit = ann.MESAJ.split('dan Saat')
    const from = msgSplit.at(0)
    if (!from) return

    const [leftTitle] = route?.name.trim().split('-') ?? ['', '']

    const tLeftTitle = leftTitle ? toAscii(leftTitle) : undefined
    if (from.trim() !== tLeftTitle?.trim()) return

    const time = msgSplit.at(1)?.split('de hareket etmesi planlanan').at(0)?.trim()
    return time
  })

  const groupedByHour = groupDeparturesByHour(filteredData)
  const hours = Object.keys(groupedByHour).sort()

  return (
    <View
      style={[{ width: cardWidth, elevation: 5 }, background]}
      className={cn('bg-muted rounded-md', className)}
    >
      <View className="m-2 mb-0">
        <UText className="text-muted">{routeCode}</UText>
        <UText className="text-lg font-medium leading-tight">{route?.name}</UText>
      </View>

      <View className="flex-row gap-2 m-2">
        {options[city].map(option => (
          <UButton
            label={option.label}
            key={option.value}
            className="flex-1"
            block
            variant={day & option.value ? 'solid' : 'soft'}
            size="lg"
            onPress={() => setDay(option.value)}
          />
        ))}
      </View>

      <UQueryState
        query={lineTimetableQuery}
        loading={() => <SkeletonTimetable />}
      >
        <ScrollView
          contentContainerClassName="flex-row p-2"
          fadingEdgeLength={10}
        >
          <View className="gap-2">
            {hours.map(hour => (
              <UText
                key={hour}
                className="size-8 font-medium items-center text-center align-middle rounded-md"
                style={theme?.backgroundWithColor({ variant: 'solid' })}
              >
                {hour}
              </UText>
            ))}
          </View>

          <ScrollView horizontal contentContainerClassName="flex-col gap-2">
            {hours.map(hour => (
              <View key={hour} className="flex-row">
                {groupedByHour[hour]?.map(time => (
                  <UText
                    key={`${code}-${time}-${routeCode}`}
                    className="size-8 align-middle text-center"
                    style={[
                      cancelledTimes?.includes(`${hour}:${time}`) && {
                        textDecorationLine: 'line-through',
                        opacity: 0.5,
                      },
                    ]}
                  >
                    {time}
                  </UText>
                ))}
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      </UQueryState>

    </View>
  )
}
