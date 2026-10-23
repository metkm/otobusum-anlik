import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import { LineCards } from '@/components/line/LineCards'
import { LineTimetable } from '@/components/line/LineTimetable'
import { ThemeProvider } from '@/components/ThemeProvider'
import { UButton } from '@/components/u/UButton'
import { CarouselContext, UCarousel } from '@/components/u/UCarousel'
import { UText } from '@/components/u/UText'
import { useLineCardWidth, useLineGroup } from '@/composables'
import { LineContext } from '@/composables/useLine'

const LineTimetables = () => {
  const { codes } = useLineGroup()
  const { snapInterval } = useLineCardWidth()
  const { t } = useTranslation()

  if (codes.length < 1) {
    return (
      <View className="flex grow items-center justify-center gap-2 p-2">
        <UText className="text-muted font-inter-medium max-w-xs text-center">
          {t('timetableEmpty')}
        </UText>

        <UButton
          label={t('goToSearch')}
          icon="search"
          variant="soft"
          color="neutral"
          to={{ pathname: '(home)/search' }}
        />
      </View>
    )
  }

  return (
    <UCarousel
      snapInterval={snapInterval}
      contentClassName="gap-2 p-2 pt-0"
      className="flex-1"
    >
      {codes.map((item) => (
        <LineContext
          key={item}
          value={item}
        >
          <ThemeProvider>
            <LineTimetable />
          </ThemeProvider>
        </LineContext>
      ))}
    </UCarousel>
  )
}

export const TimetableScreen = () => {
  const offset = useSharedValue(0)

  return (
    <View className="mt-safe mx-safe flex-1 pt-2">
      <CarouselContext value={offset}>
        <LineCards />
        <LineTimetables />
      </CarouselContext>
    </View>
  )
}

export default TimetableScreen
