// Note: This component is not used anymore for now. Maybe it can be worked later but there needs to be some virtualization

import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'

import { GroupCardItems } from '@/components/group/GroupCardItems'
import { LineTimetable } from '@/components/line/LineTimetable'
import { CarouselProvider } from '@/components/provider/CarouselProvider'
import { ThemeProvider } from '@/components/provider/ThemeProvider'
import { UButton, UCarousel, UEmpty } from '@/components/u'
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
        ui={{ container: 'gap-2 px-2 pt-2', viewport: 'flex-1 grow' }}
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

export const TimetableScreen = () => (
  <View className="pt-safe-offset-2 pb-nav-offset-2 px-safe grow">
    <CarouselProvider>
      <GroupCardItems filter="line" />
      <LineTimetables />
    </CarouselProvider>
  </View>
)

export default TimetableScreen
