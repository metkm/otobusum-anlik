import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import { LineCards } from '@/components/line/LineCards'
import { LineTimetable } from '@/components/line/LineTimetable'
import { UButton } from '@/components/u/UButton'
import { CarouselContext, UCarousel } from '@/components/u/UCarousel'
import { UText } from '@/components/u/UText'

import { useLineCardWidth } from '@/composables'
import { LineContext } from '@/composables/useLine'
import { useLines } from '@/composables/useLines'

const LineTimetables = () => {
  const lines = useLines()
  const { snapInterval } = useLineCardWidth()
  const { t } = useTranslation()

  if (lines.length < 1) {
    return (
      <View className="flex items-center justify-center gap-2 p-2">
        <UText className="text-muted font-inter-medium text-center max-w-xs">{t('timetableEmpty')}</UText>

        <UButton
          label={t('goToSearch')}
          icon="search"
          variant="soft"
          color="neutral"
          to="/search"
        />
      </View>
    )
  }

  return (
    <UCarousel
      snapInterval={snapInterval}
      contentClassName={`gap-2 pt-0 ${lines.length > 1 ? 'p-2 pt-0' : ''}`}
      className="flex-1"
    >
      {lines.map(item => (
        <LineContext key={item} value={item}>
          <LineTimetable className={lines.length < 2 ? 'rounded-none' : ''} />
        </LineContext>
      ))}
    </UCarousel>
  )
}

export const TimetableScreen = () => {
  const offset = useSharedValue(0)

  return (
    <View className="mt-safe mx-safe pt-2 flex-1">
      <CarouselContext value={offset}>
        <LineCards />
        <LineTimetables />
      </CarouselContext>
    </View>
  )
}

export default TimetableScreen
