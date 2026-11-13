import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Animated, { useSharedValue } from 'react-native-reanimated'

import { GroupCardItems } from '@/components/group/GroupCardItems'
import { LineTimetable } from '@/components/line/LineTimetable'
import { ThemeProvider } from '@/components/provider/ThemeProvider'
import { UButton, UCarousel, CarouselContext, UEmpty } from '@/components/u'
import { useLineGroup } from '@/composables'
import { GroupItemContext } from '@/composables/useGroupItem'
import { LayoutAnimationTransition } from '@/constants/animation'

const LineTimetables = () => {
  const { items } = useLineGroup()
  const { t } = useTranslation()

  if (items.length < 1) {
    return (
      <UEmpty
        title={t('timetableEmpty')}
        className="m-2 grow"
      >
        <UButton
          label={t('goToSearch')}
          icon="search"
          variant="soft"
          color="neutral"
          to={{ pathname: '/search' }}
        />
      </UEmpty>
    )
  }

  const codes = items.filter((x) => x.type === 'line')

  return (
    <Animated.View
      layout={LayoutAnimationTransition}
      className="grow"
    >
      <UCarousel
        data={codes}
        keyExtractor={(item) => item.code}
        ui={{ container: 'p-2 pt-0 gap-2', viewport: 'flex-1 grow' }}
        renderItem={({ item }) => (
          <GroupItemContext
            key={item.code}
            value={item.code}
          >
            <ThemeProvider>
              <LineTimetable className="flex-1" />
            </ThemeProvider>
          </GroupItemContext>
        )}
      />
    </Animated.View>
  )
}

export const TimetableScreen = () => {
  const offset = useSharedValue(0)
  const cardHeight = useSharedValue(0)

  return (
    <View className="mt-safe mx-safe mb-[calc(var(--navigation-height)+env(safe-area-inset-bottom))] flex-1 pt-2">
      <CarouselContext value={{ cardHeight, offset }}>
        <GroupCardItems filter="line" />
        <LineTimetables />
      </CarouselContext>
    </View>
  )
}

export default TimetableScreen
