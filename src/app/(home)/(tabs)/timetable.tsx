import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import { GroupCardItems } from '@/components/group/GroupCardItems'
import { LineTimetable } from '@/components/line/LineTimetable'
import { ThemeProvider } from '@/components/ThemeProvider'
import { UButton, UCarousel, CarouselContext, UText } from '@/components/u'
import { useLineGroup } from '@/composables'
import { GroupItemContext } from '@/composables/useGroupItem'

const LineTimetables = () => {
  const { items } = useLineGroup()
  const { t } = useTranslation()

  if (items.length < 1) {
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
          to={{ pathname: 'search' }}
        />
      </View>
    )
  }

  const codes = items.filter((x) => x.type === 'line')

  return (
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
