import { useTranslation } from 'react-i18next'
import { Dimensions, View } from 'react-native'

import { GroupCardItems } from '@/components/group/GroupCardItems'
import { LineTimetable } from '@/components/line/LineTimetable'
import { CarouselProvider } from '@/components/provider/CarouselProvider'
import { ThemeProvider } from '@/components/provider/ThemeProvider'
import { UButton, UCarousel, UEmpty } from '@/components/u'
import { useLineGroup } from '@/composables'
import { GroupItemContext } from '@/composables/useGroupItem'

const LineTimetables = () => {
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

  const codes = items.filter((x) => x.type === 'line')

  return (
    <UCarousel
      data={codes}
      keyExtractor={(item) => item.code}
      renderItem={({ item }, onLayout) => (
        <GroupItemContext
          key={item.code}
          value={item.code}
        >
          <ThemeProvider>
            <LineTimetable onLayout={onLayout} />
          </ThemeProvider>
        </GroupItemContext>
      )}
      ui={{ container: 'flex-1', item: 'top-0 bottom-0', viewport: 'flex-1 mt-2' }}
      initialRenderCount={2}
      drawDistance={8}
      getFixedItemSize={() => cardWidth}
    />
  )
}

export const TimetableScreen = () => (
  <View className="pt-safe-offset-2 pb-nav-offset-2 px-safe grow">
    <CarouselProvider>
      <GroupCardItems
        filter="line"
        drawDistance={8}
      />
      <LineTimetables />
    </CarouselProvider>
  </View>
)

export default TimetableScreen
