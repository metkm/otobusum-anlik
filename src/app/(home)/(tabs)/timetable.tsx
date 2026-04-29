import { View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { LineCards } from '@/components/line/LineCards'
import { LineTimetable } from '@/components/line/LineTimetable'
import { CarouselContext, UCarousel } from '@/components/u/UCarousel'
import { UText } from '@/components/u/UText'

import { useLineCardWidth } from '@/composables'
import { LineContext } from '@/composables/useLine'
import { useLineStore } from '@/stores'
import { i18n } from '@/translations/i18n'

const LineTimetables = () => {
  const lines = useLineStore(useShallow(state => state.getLines()))
  const { snapInterval } = useLineCardWidth()

  if (lines.length < 2) {
    return (
      <UText className="flex-1 align-middle mx-2 text-center text-muted font-inter-medium">{i18n.t('timetableEmpty')}</UText>
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
