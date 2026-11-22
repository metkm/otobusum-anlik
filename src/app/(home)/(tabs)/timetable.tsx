import { useTranslation } from 'react-i18next'
import { Dimensions, View } from 'react-native'

import { LineCard } from '@/components/line/card/LineCard'
import { LineTimetable } from '@/components/line/LineTimetable'
import { CarouselCardHeightProvider } from '@/components/provider/CarouselCardHeightProvider'
import { ThemeProvider } from '@/components/provider/ThemeProvider'
import { StopCard } from '@/components/stop/card/StopCard'
import { StopCardArrivals } from '@/components/stop/card/StopCardArrivals'
import { UButton, UCarousel, UEmpty } from '@/components/u'
import { useLineGroup } from '@/composables'
import { GroupItemContext } from '@/composables/useGroupItem'
import type { GroupItem } from '@/stores/groups'
import type { OnLayoutFunction } from '@/types/shared'

const RenderItem = ({ item }: { item: GroupItem }, onLayout: OnLayoutFunction) => {
  if (item.type === 'line') {
    return (
      <GroupItemContext value={item.code}>
        <ThemeProvider>
          <View
            onLayout={onLayout}
            className="flex-1 gap-2 pb-2"
          >
            <LineCard />
            <LineTimetable />
          </View>
        </ThemeProvider>
      </GroupItemContext>
    )
  }

  return (
    <GroupItemContext value={item.code}>
      <View
        className="flex-1"
        onLayout={onLayout}
      >
        <StopCard />
        <StopCardArrivals />
      </View>
    </GroupItemContext>
  )
}

export const TimetableScreen = () => {
  const { items } = useLineGroup()
  const { t } = useTranslation()

  const cardWidthModifier = items.length > 1 ? 0.94 : 1
  const cardWidth = Dimensions.get('window').width * cardWidthModifier - 16

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

  return (
    <View className="pt-safe-offset-2 pb-nav px-safe grow">
      <CarouselCardHeightProvider>
        <UCarousel
          data={items}
          keyExtractor={(item) => item.code}
          renderItem={RenderItem}
          ui={{ container: 'grow', viewport: 'grow' }}
          initialRenderCount={2}
          drawDistance={8}
          getFixedItemSize={() => cardWidth}
          enabled={items.length > 1}
        />
      </CarouselCardHeightProvider>
    </View>
  )
}

export default TimetableScreen
