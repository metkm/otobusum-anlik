import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useShallow } from 'zustand/react/shallow'

import { useLineCardWidth, useLineNews, useLineRoutes, useLineTimetable } from '@/composables'
import type { Time } from '@/composables/useLineTimetable'
import { useFilterStore } from '@/stores'
import type { City } from '@/types/city'
import { cn } from '@/utils/cn'
import { groupDeparturesByHour } from '@/utils/groupDepartures'
import { toAscii } from '@/utils/toAscii'

import { SkeletonTimetable } from '../u/skeleton/SkeletonTimetable'
import { UButton } from '../u/UButton'
import { UEmpty } from '../u/UEmpty'
import { UQueryState } from '../u/UQueryState'
import { UText } from '../u/UText'

const sunday = 1 << 1
const monday = 1 << 2
const tuesday = 1 << 3
const wednesday = 1 << 4
const thursday = 1 << 5
const friday = 1 << 6
const saturday = 1 << 7

const now = new Date()
const nowDay = now.getDay()

export const LineTimetable = () => {
  const { t } = useTranslation()

  const city = useFilterStore(useShallow((state) => state.city))
  const [day, setDay] = useState(() => 1 << (nowDay + 1))

  const { cardWidth } = useLineCardWidth()
  const { route, routeCode } = useLineRoutes()
  const { query: lineTimetableQuery } = useLineTimetable()
  const { query: lineNewsQuery } = useLineNews()

  const filteredData = useMemo(() => {
    if (!lineTimetableQuery.data) {
      return []
    }

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

    return [...new Set(times)]
  }, [lineTimetableQuery.data, day])

  const groupedByHour = groupDeparturesByHour(filteredData)
  const hourEntries = Object.entries(groupedByHour).sort((a, b) => Number(a[0]) - Number(b[0]))

  const cancelledTimes = lineNewsQuery.data?.map((ann) => {
    if (!ann.MESAJ.includes('dan Saat')) {
      return
    }

    const msgSplit = ann.MESAJ.split('dan Saat')
    const from = msgSplit.at(0)
    if (!from) {
      return
    }

    const [leftTitle] = route?.name.trim().split('-') ?? ['', '']

    const tLeftTitle = leftTitle ? toAscii(leftTitle) : undefined
    if (from.trim() !== tLeftTitle?.trim()) {
      return
    }

    const time = msgSplit.at(1)?.split('de hareket etmesi planlanan').at(0)?.trim()
    return time
  })

  const options: Record<City, { label: string; value: number }[]> = {
    istanbul: [
      {
        label: t('workday'),
        value: monday | tuesday | wednesday | thursday | friday,
      },
      {
        label: t('saturday'),
        value: saturday,
      },
      {
        label: t('sunday'),
        value: sunday,
      },
    ],
    izmir: [
      {
        label: t('saturday'),
        value: saturday,
      },
      {
        label: t('monday'),
        value: monday,
      },
      {
        label: t('tuesday'),
        value: tuesday,
      },
      {
        label: t('wednesday'),
        value: wednesday,
      },
      {
        label: t('thursday'),
        value: thursday,
      },
      {
        label: t('friday'),
        value: friday,
      },
      {
        label: t('sunday'),
        value: sunday,
      },
    ],
  }

  return (
    <View
      style={{ elevation: 2, width: cardWidth }}
      className="bg-default border-hairline border-muted rounded-md"
    >
      <View className="m-2 mb-0">
        <UText className="text-muted">{routeCode}</UText>

        {route?.name && (
          <UText className="font-inter-medium text-lg leading-tight">{route.name}</UText>
        )}
      </View>

      <View className="m-2 flex-row gap-2">
        {options[city].map((option) => (
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
        fetching={() => <SkeletonTimetable />}
      >
        {hourEntries.length > 1 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="border-t-hairline border-muted"
          >
            {hourEntries.map(([hour, minutes], index) => (
              <View
                key={hour}
                className={cn(
                  'flex-row items-center shrink p-2 gap-2',
                  index % 2 !== 0 ? 'bg-muted' : false,
                )}
              >
                <UText className="font-inter-medium bg-primary text-inverted h-full min-h-7 w-7 rounded-md text-center align-middle">
                  {hour}
                </UText>

                <View className="shrink flex-row flex-wrap items-center gap-2">
                  {minutes.map((min) => (
                    <UText
                      key={min}
                      className="leading-tight"
                      style={[
                        cancelledTimes?.includes(`${hour}:${min}`) && {
                          opacity: 0.5,
                          textDecorationLine: 'line-through',
                        },
                      ]}
                    >
                      {min}
                    </UText>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <UEmpty
            title={t('timetableEmptyRange')}
            icon="clock-fading"
            className="grow"
          />
        )}
      </UQueryState>
    </View>
  )
}
