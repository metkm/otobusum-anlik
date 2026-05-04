import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, ViewProps } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useShallow } from 'zustand/react/shallow'

import { SkeletonTimetable } from '../u/skeleton/SkeletonTimetable'
import { UButton } from '../u/UButton'
import { UQueryState } from '../u/UQueryState'
import { UText } from '../u/UText'

import { useLineCardWidth, useLineNews, useLineRoutes, useLineTheme, useLineTimetable } from '@/composables'
import { Time } from '@/composables/useLineTimetable'
import { useFilterStore } from '@/stores'
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

const now = new Date()
const nowDay = now.getDay()

export const LineTimetable = ({ className }: ViewProps) => {
  const { t } = useTranslation()

  const city = useFilterStore(useShallow(state => state.city))
  const [day, setDay] = useState(() => 1 << (nowDay + 1))

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

  const backgroundWithColor = theme?.backgroundWithColor()
  const backgroundMuted = theme?.background({ variant: 'soft' })

  const options: Record<City, { label: string, value: number }[]> = {
    istanbul: [
      {
        value: monday | tuesday | wednesday | thursday | friday,
        label: t('workday'),
      },
      {
        value: saturday,
        label: t('saturday'),
      },
      {
        value: sunday,
        label: t('sunday'),
      },
    ],
    izmir: [
      {
        value: saturday,
        label: t('saturday'),
      },
      {
        value: monday,
        label: t('monday'),
      },
      {
        value: tuesday,
        label: t('tuesday'),
      },
      {
        value: wednesday,
        label: t('wednesday'),
      },
      {
        value: thursday,
        label: t('thursday'),
      },
      {
        value: friday,
        label: t('friday'),
      },
      {
        value: sunday,
        label: t('sunday'),
      },
    ],
  }

  return (
    <View
      style={[{ width: cardWidth, elevation: 2 }, background]}
      className={cn('bg-muted rounded-md', className)}
    >
      <View className="m-2 mb-0">
        <UText className="text-muted">{routeCode}</UText>
        <UText className="text-lg font-inter-medium leading-tight">{route?.name}</UText>
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
        <ScrollView fadingEdgeLength={10}>
          {Object.entries(groupedByHour).map(([hour, minutes], index) => (
            <View
              key={hour}
              className="flex-row items-center shrink p-2 gap-2"
              style={(index % 2 !== 0) && backgroundMuted}
            >
              <UText
                className="font-inter-medium w-7 h-full min-h-7 text-center align-middle rounded-md"
                style={backgroundWithColor}
              >
                {hour}
              </UText>

              <View className="flex-row flex-wrap items-center gap-2 shrink">
                {minutes.map(min => (
                  <UText
                    key={min}
                    className="leading-tight"
                    style={[
                      cancelledTimes?.includes(`${hour}:${min}`) && {
                        textDecorationLine: 'line-through',
                        opacity: 0.5,
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
      </UQueryState>
    </View>
  )
}
